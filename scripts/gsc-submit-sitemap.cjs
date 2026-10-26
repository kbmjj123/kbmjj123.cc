#!/usr/bin/env node
/**
 * gsc-submit-sitemap.cjs
 * 向 Google Search Console 提交（重新提交）sitemap，并回读处理状态。
 *
 * 与 gsc-pull.cjs 的关键差别：本脚本用 **full** scope（webmasters），
 * 而非 readonly —— 提交 sitemap 是写操作，只读凭据会被 403 拒绝。
 *
 * 前置条件：
 *   1. 本脚本必须用 full scope 自行取 token。
 *      **不要复用 gsc-pull.cjs 生成的 readonly token** —— 那会得到 403
 *      （ACCESS_TOKEN_SCOPE_INSUFFICIENT）。实测 service account 在 GSC 里的
 *      权限本来就够，卡点只在 scope 声明。
 *   2. 本机代理：脚本内 curl 依赖环境变量里的代理，
 *      若 HTTP_PROXY 被宿主机沙箱覆盖，需要显式指定：
 *        env https_proxy=http://127.0.0.1:7890 HTTPS_PROXY=http://127.0.0.1:7890 \
 *            node scripts/gsc-submit-sitemap.cjs
 *
 * Usage: node scripts/gsc-submit-sitemap.cjs
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const CREDENTIALS_PATH = path.resolve(__dirname, '../.claude/credentials/gsc-service-account.json');
const SITE = 'sc-domain:kbmjj123.cc';
const SITEMAP = 'https://kbmjj123.cc/sitemap.xml';
const API = 'https://www.googleapis.com/webmasters/v3';

// full scope，不是 readonly
const SCOPE = 'https://www.googleapis.com/auth/webmasters';

function b64(o) {
  return Buffer.from(JSON.stringify(o)).toString('base64url');
}

function getToken() {
  const c = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: c.client_email,
    scope: SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const input = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64(claim);
  const sig = crypto.createSign('RSA-SHA256').update(input).sign(c.private_key, 'base64url');
  const assertion = input + '.' + sig;

  const out = execSync(
    'curl -s -X POST "https://oauth2.googleapis.com/token"' +
      ' -H "Content-Type: application/x-www-form-urlencoded"' +
      ' --data-urlencode "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer"' +
      ' --data-urlencode "assertion=' + assertion + '"',
    { encoding: 'utf8' }
  );
  const j = JSON.parse(out);
  if (!j.access_token) {
    throw new Error('认证失败：' + (j.error_description || j.error || out.slice(0, 200)));
  }
  return j.access_token;
}

function curl(args) {
  return execSync('curl -s ' + args, { encoding: 'utf8' });
}

// --- 1. 认证 ---
console.log('🔑 认证中（scope: ' + SCOPE + '）...');
const TOKEN = getToken();
console.log('✅ 已认证\n');
const AUTH = '-H "Authorization: Bearer ' + TOKEN + '"';

const siteEnc = encodeURIComponent(SITE);
const feedEnc = encodeURIComponent(SITEMAP);

// --- 2. 提交前状态 ---
console.log('=== 提交前 ===');
const before = curl(AUTH + ' "' + API + '/sites/' + siteEnc + '/sitemaps"');
let parsedBefore = null;
try { parsedBefore = JSON.parse(before); } catch (e) { /* ignore */ }
if (parsedBefore && parsedBefore.sitemap) {
  for (const s of parsedBefore.sitemap) {
    console.log('  ' + s.path);
    console.log('     最后提交: ' + (s.lastSubmitted || '(无)'));
    console.log('     待处理  : ' + s.isPending + '   警告:' + s.warnings + '   错误:' + s.errors);
  }
} else {
  console.log('  ' + before.slice(0, 200));
}

// --- 3. 提交 ---
console.log('\n=== 提交 sitemap ===');
const res = curl('-w "\\nHTTP:%{http_code}" -X PUT ' + AUTH + ' "' + API + '/sites/' + siteEnc + '/sitemaps/' + feedEnc + '"');
const httpLine = (res.match(/HTTP:(\d+)/) || [])[1];

if (httpLine === '204' || httpLine === '200') {
  console.log('✅ 提交成功（HTTP ' + httpLine + '）');
} else if (httpLine === '403') {
  console.log('❌ HTTP 403 —— 权限不足。');
  console.log('   先确认是 scope 问题还是用户权限问题：看响应里 reason 字段。');
  console.log('   - ACCESS_TOKEN_SCOPE_INSUFFICIENT → 用了 readonly token，本脚本应自行取 full token');
  console.log('   - 其他 → 去 GSC 后台 → 设置 → 用户和权限，确认该账号是「完全用户」：');
  console.log('     ' + JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8')).client_email);
  console.log('\n   原始响应：');
  console.log('   ' + res.replace(/\n/g, '\n   ').slice(0, 600));
  process.exit(1);
} else {
  console.log('❌ 提交失败（HTTP ' + httpLine + '）');
  console.log(res.slice(0, 600));
  process.exit(1);
}

// --- 4. 提交后状态 ---
console.log('\n=== 提交后状态 ===');
const after = curl(AUTH + ' "' + API + '/sites/' + siteEnc + '/sitemaps"');
try {
  const p = JSON.parse(after);
  for (const s of p.sitemap || []) {
    console.log('  ' + s.path);
    console.log('     最后提交: ' + (s.lastSubmitted || '(无)'));
    console.log('     待处理  : ' + s.isPending);
    if (s.contents) {
      console.log('     URL 数  : 已发现 ' + s.contents.length);
    }
  }
} catch (e) {
  console.log('  ' + after.slice(0, 300));
}

console.log('\n提示：Google 处理 sitemap 通常需要 1–7 天。');
console.log('      之后用 gsc-pull.cjs 复查 impressions 是否增长。');
