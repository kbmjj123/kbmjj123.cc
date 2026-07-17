#!/usr/bin/env node

/**
 * Watermark script — kbmjj123.cc
 *
 * Usage: node scripts/watermark.mjs <post-slug>
 *
 * Reads content/posts/<slug>.md, extracts all local image references,
 * converts non-webp/non-svg images to webp, adds watermark "kbmjj123.cc"
 * at bottom-right, creates 50% thumbnail as -m.webp, updates markdown refs.
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

const POSTS_DIR = 'content/posts';
const PUBLIC_DIR = 'public';

// ── helpers ──────────────────────────────────────────────────────

function extractImages(md) {
  const re = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const imageMap = new Map();
  const replacements = [];

  let m;
  while ((m = re.exec(md)) !== null) {
    const url = m[2];

    // skip external / non-image
    if (url.startsWith('http')) continue;
    if (!url.startsWith('/images/')) continue;

    const ext = path.extname(url).toLowerCase();

    // skip svg & gif (animated)
    if (ext === '.svg' || ext === '.gif') continue;
    // skip if somehow referencing thumbnail
    if (url.endsWith('-m.webp') || url.endsWith('-m.png') || url.endsWith('-m.jpg')) continue;

    const filepath = path.join(PUBLIC_DIR, url.replace(/^\//, ''));
    if (!imageMap.has(filepath)) {
      imageMap.set(filepath, { url, filepath, ext, dir: path.dirname(filepath) });
    }

    if (ext !== '.webp') {
      const to = url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      replacements.push({ from: url, to });
    }
  }

  return { images: [...imageMap.values()], replacements };
}

function watermarkSvg(w, h) {
  const fontSize = Math.max(11, Math.round(Math.min(w, h) * 0.018));
  const pad = Math.max(8, Math.round(Math.min(w, h) * 0.014));
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <text x="${w - pad}" y="${h - pad}" font-family="sans-serif"
        font-size="${fontSize}" fill="rgba(255,255,255,0.55)"
        text-anchor="end">kbmjj123.cc</text>
</svg>`
  );
}

function escRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── image processing ─────────────────────────────────────────────

async function processOne(img) {
  const { url, filepath, ext } = img;
  const dir = path.dirname(filepath);
  const base = path.basename(filepath, ext);
  const webpPath = path.join(dir, `${base}.webp`);
  const thumbPath = path.join(dir, `${base}-m.webp`);

  // skip if already watermarked (webp + -m.webp exists)
  if (ext === '.webp' && existsSync(thumbPath)) {
    return { url, status: 'skipped', reason: 'already watermarked' };
  }

  if (!existsSync(filepath)) {
    return { url, status: 'error', reason: 'file not found' };
  }

  let meta;
  try {
    meta = await sharp(filepath).metadata();
  } catch (e) {
    return { url, status: 'error', reason: `unreadable (${e.message})` };
  }
  if (!meta.width || !meta.height) {
    return { url, status: 'error', reason: 'unknown dimensions' };
  }

  // read into buffer so we never clash writing to same file
  const buf = await sharp(filepath).toBuffer();
  const tw = Math.round(meta.width * 0.5);

  try {
    // full-size watermarked webp
    await sharp(buf)
      .webp({ quality: 85 })
      .composite([{ input: watermarkSvg(meta.width, meta.height), top: 0, left: 0 }])
      .toFile(webpPath);

    // 50 % thumbnail (watermark resized naturally)
    await sharp(buf)
      .resize({ width: tw })
      .webp({ quality: 75 })
      .composite([{ input: watermarkSvg(tw, Math.round(tw / meta.width * meta.height)), top: 0, left: 0 }])
      .toFile(thumbPath);

    // remove original if it was a different format
    if (ext !== '.webp') unlinkSync(filepath);

    return { url, status: 'done' };
  } catch (e) {
    return { url, status: 'error', reason: e.message };
  }
}

// ── main ─────────────────────────────────────────────────────────

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: node scripts/watermark.mjs <post-slug>');
    console.error('  Processes images referenced in content/posts/<slug>.md');
    process.exit(1);
  }

  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  if (!existsSync(mdPath)) {
    console.error(`✗  ${mdPath} not found`);
    process.exit(1);
  }

  console.log(`✦  Reading ${slug}.md …`);

  const md = readFileSync(mdPath, 'utf-8');
  const { images, replacements } = extractImages(md);

  if (images.length === 0) {
    console.log('✦  No local images found — nothing to do.');
    return;
  }

  console.log(`✦  ${images.length} image(s) found\n`);

  const results = [];
  for (const img of images) {
    process.stdout.write(`   ${img.url}`);
    const r = await processOne(img);
    results.push(r);

    if (r.status === 'done') {
      console.log(`  ✓  → ${path.basename(img.url, img.ext)}.webp + -m.webp`);
    } else if (r.status === 'skipped') {
      console.log(`  –  skipped (${r.reason})`);
    } else {
      console.log(`  ✗  FAILED (${r.reason})`);
    }
  }

  // update markdown references
  if (replacements.length > 0) {
    let body = md;
    // sort longest-first so no substring collision
    replacements.sort((a, b) => b.from.length - a.from.length);
    for (const { from, to } of replacements) {
      body = body.replace(new RegExp(escRe(from), 'g'), to);
    }
    writeFileSync(mdPath, body, 'utf-8');
    console.log(`\n✦  Updated ${replacements.length} reference(s) in ${slug}.md`);
  }

  const done_ = results.filter((r) => r.status === 'done').length;
  const skipped_ = results.filter((r) => r.status === 'skipped').length;
  const errors_ = results.filter((r) => r.status === 'error').length;
  console.log(`\n✦  Done  —  ${done_} processed · ${skipped_} skipped · ${errors_} error(s)`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
