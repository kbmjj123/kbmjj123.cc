#!/usr/bin/env node
/**
 * gsc-pull.cjs
 * Pull Google Search Console performance data via REST API.
 * Uses service account authentication (no googleapis dependency).
 *
 * Prerequisites:
 *   1. Create a Google Cloud project + enable Search Console API
 *   2. Create a Service Account, download JSON key
 *   3. Place key at .claude/credentials/gsc-service-account.json
 *   4. Add the service account email as a Restricted user in GSC
 *
 * Usage: node scripts/gsc-pull.cjs [--days 30] [--site sc-domain:kbmjj123.cc]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// --- Config ---

const CREDENTIALS_PATH = path.resolve(__dirname, '../.claude/credentials/gsc-service-account.json');
const OUTPUT_PATH = path.resolve(__dirname, '../content/.gsc-performance.json');
const BLOG_PROCESS_PATH = path.resolve(__dirname, '../content/.blog-process.json');
const DEFAULT_SITE = 'sc-domain:kbmjj123.cc';
const DEFAULT_DAYS = 30;
const TOP_QUERIES_PER_PAGE = 10;
const GSC_API_BASE = 'https://www.googleapis.com/webmasters/v3';

// --- Parse CLI args ---

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { days: DEFAULT_DAYS, site: DEFAULT_SITE };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--days' && args[i + 1]) opts.days = parseInt(args[i + 1], 10);
    if (args[i] === '--site' && args[i + 1]) opts.site = args[i + 1];
  }
  return opts;
}

// --- HTTP helper via curl ---

function curlPost(url, headers, body) {
  const headerFlags = Object.entries(headers)
    .map(([k, v]) => `-H "${k}: ${v}"`)
    .join(' ');

  // Write body to temp file to avoid shell escaping issues
  const tmpFile = path.join(require('os').tmpdir(), `gsc-${Date.now()}.json`);
  fs.writeFileSync(tmpFile, typeof body === 'string' ? body : JSON.stringify(body));

  try {
    const result = execSync(
      `curl -s -X POST "${url}" ${headerFlags} -d @${tmpFile}`,
      { encoding: 'utf8', timeout: 30000 }
    );
    return JSON.parse(result);
  } finally {
    try { fs.unlinkSync(tmpFile); } catch (e) {}
  }
}

function curlPostForm(url, body) {
  const result = execSync(
    `curl -s -X POST "${url}" -H "Content-Type: application/x-www-form-urlencoded" -d "${body}"`,
    { encoding: 'utf8', timeout: 30000 }
  );
  return JSON.parse(result);
}

// --- JWT Auth (service account, no external deps) ---

function base64url(data) {
  return Buffer.from(typeof data === 'string' ? data : JSON.stringify(data))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signJWT(privateKey, header, payload) {
  const signingInput = `${base64url(header)}.${base64url(payload)}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  return sign.sign(privateKey, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const jwt = `${base64url(header)}.${base64url(payload)}.${signJWT(credentials.private_key, header, payload)}`;

  const data = curlPostForm(
    'https://oauth2.googleapis.com/token',
    `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  );

  if (!data.access_token) {
    throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

// --- GSC API calls ---

function gscQuery(accessToken, siteUrl, body) {
  const encodedSite = encodeURIComponent(siteUrl);
  const url = `${GSC_API_BASE}/sites/${encodedSite}/searchAnalytics/query`;

  const result = curlPost(url, {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }, body);

  if (result.error) {
    console.error(`  ⚠️  GSC API error: ${result.error.message}`);
    return { rows: [] };
  }

  return result;
}

// --- Date helpers ---

function dateRange(daysBack) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - daysBack);
  // GSC API dates must be at least 3 days ago
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 3);
  if (end > minDate) end.setTime(minDate.getTime());
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

// --- Main ---

function main() {
  const opts = parseArgs();

  // 1. Load credentials
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`❌ Credentials not found at: ${CREDENTIALS_PATH}`);
    console.error('   See script header for setup instructions.');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  console.log(`🔑 Authenticating as: ${credentials.client_email}`);

  const accessToken = getAccessToken(credentials);
  console.log('✅ Authenticated');

  // 2. Determine date ranges
  const currentPeriod = dateRange(opts.days);
  const previousPeriod = dateRange(opts.days * 2);
  console.log(`📅 Current period: ${currentPeriod.start} → ${currentPeriod.end}`);
  console.log(`📅 Previous period: ${previousPeriod.start} → ${currentPeriod.start}`);

  // 3. Pull page-level data for current period
  console.log('\n📊 Fetching page-level data...');
  const pageData = gscQuery(accessToken, opts.site, {
    startDate: currentPeriod.start,
    endDate: currentPeriod.end,
    dimensions: ['page'],
    rowLimit: 500,
  });

  const pages = {};
  const rows = pageData.rows || [];
  console.log(`   Found ${rows.length} pages`);

  for (const row of rows) {
    const pagePath = new URL(row.keys[0]).pathname;
    pages[pagePath] = {
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: Math.round(row.ctr * 10000) / 100,
      avgPosition: Math.round(row.position * 10) / 10,
      topQueries: [],
    };
  }

  // 4. Pull query-level data for current period
  console.log('\n📊 Fetching query-level data...');
  const queryData = gscQuery(accessToken, opts.site, {
    startDate: currentPeriod.start,
    endDate: currentPeriod.end,
    dimensions: ['query', 'page'],
    rowLimit: 5000,
  });

  const queryRows = queryData.rows || [];
  console.log(`   Found ${queryRows.length} query-page combinations`);

  // Group queries by page
  const queriesByPage = {};
  for (const row of queryRows) {
    const pagePath = new URL(row.keys[1]).pathname;
    if (!queriesByPage[pagePath]) queriesByPage[pagePath] = [];
    queriesByPage[pagePath].push({
      query: row.keys[0],
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: Math.round(row.ctr * 10000) / 100,
      position: Math.round(row.position * 10) / 10,
    });
  }

  // Attach top queries to each page
  for (const [pagePath, queries] of Object.entries(queriesByPage)) {
    if (pages[pagePath]) {
      queries.sort((a, b) => b.impressions - a.impressions);
      pages[pagePath].topQueries = queries.slice(0, TOP_QUERIES_PER_PAGE);
    }
  }

  // 5. Pull previous period data for comparison
  console.log('\n📊 Fetching previous period for comparison...');
  const prevData = gscQuery(accessToken, opts.site, {
    startDate: previousPeriod.start,
    endDate: currentPeriod.start,
    dimensions: ['page'],
    rowLimit: 500,
  });

  const prevPages = {};
  for (const row of (prevData.rows || [])) {
    const pagePath = new URL(row.keys[0]).pathname;
    prevPages[pagePath] = {
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: Math.round(row.ctr * 10000) / 100,
      avgPosition: Math.round(row.position * 10) / 10,
    };
  }

  // 6. Compute changes
  const changes = { improved: [], declined: [], new: [] };

  for (const [slug, current] of Object.entries(pages)) {
    const prev = prevPages[slug];
    if (!prev) {
      changes.new.push({ slug, impressions: current.impressions, clicks: current.clicks });
      continue;
    }

    const posDelta = current.avgPosition - prev.avgPosition;
    const impDelta = current.impressions - prev.impressions;

    if (posDelta < -3) {
      changes.improved.push({ slug, metric: 'position', from: prev.avgPosition, to: current.avgPosition });
    }
    if (posDelta > 5) {
      changes.declined.push({ slug, metric: 'position', from: prev.avgPosition, to: current.avgPosition });
    }
    if (impDelta > prev.impressions * 0.5 && prev.impressions > 50) {
      changes.improved.push({ slug, metric: 'impressions', from: prev.impressions, to: current.impressions });
    }
    if (impDelta < -prev.impressions * 0.3 && prev.impressions > 50) {
      changes.declined.push({ slug, metric: 'impressions', from: prev.impressions, to: current.impressions });
    }
  }

  // 7. Determine trend per page
  for (const [slug, page] of Object.entries(pages)) {
    const change = changes.improved.find(c => c.slug === slug);
    const decline = changes.declined.find(c => c.slug === slug);
    if (change && !decline) page.trend = 'improving';
    else if (decline && !change) page.trend = 'declining';
    else if (changes.new.find(c => c.slug === slug)) page.trend = 'new';
    else page.trend = 'stable';
  }

  // 8. Write output
  const output = {
    lastPulled: new Date().toISOString().split('T')[0],
    siteUrl: opts.site,
    period: currentPeriod,
    pages,
    previousPeriod: prevPages,
    changes,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\n✅ Written to ${OUTPUT_PATH}`);
  console.log(`   ${Object.keys(pages).length} pages, ${changes.improved.length} improved, ${changes.declined.length} declined, ${changes.new.length} new`);

  // 9. Update .blog-process.json performance field
  if (fs.existsSync(BLOG_PROCESS_PATH)) {
    const processDoc = JSON.parse(fs.readFileSync(BLOG_PROCESS_PATH, 'utf8'));
    let updated = 0;

    for (const article of processDoc.articles) {
      const slugPath = `/${article.slug}`;
      const pagePerf = pages[slugPath];
      if (pagePerf) {
        article.performance = {
          lastChecked: output.lastPulled,
          impressions: pagePerf.impressions,
          clicks: pagePerf.clicks,
          ctr: pagePerf.ctr,
          avgPosition: pagePerf.avgPosition,
          topQueries: pagePerf.topQueries.map(q => q.query),
          trend: pagePerf.trend,
        };
        updated++;
      }
    }

    processDoc.lastUpdated = output.lastPulled;
    fs.writeFileSync(BLOG_PROCESS_PATH, JSON.stringify(processDoc, null, 2));
    console.log(`\n✅ Updated ${BLOG_PROCESS_PATH} — ${updated} articles enriched with performance data`);
  }
}

try {
  main();
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
