#!/usr/bin/env node
/**
 * gsc-import.cjs
 * Import Google Search Console data from manually exported CSV files.
 *
 * WHY THIS EXISTS
 *   gsc-pull.cjs calls the GSC REST API directly, which requires reaching
 *   googleapis.com. On networks where Google endpoints are unreachable,
 *   that script can never run. This script takes the CSV you export by hand
 *   from the GSC web UI and produces the EXACT same JSON structure, so every
 *   downstream consumer (content-strategist, aggregation, reports) keeps working
 *   unchanged.
 *
 * HOW TO GET THE CSV (GSC web UI)
 *   1. https://search.google.com/search-console/performance/search-analytics
 *   2. Set date range: "Last 3 months" (or whatever you want to baseline)
 *   3. Tab "Pages"  -> Export (top right) -> "Download CSV"
 *   4. Optional: Tab "Queries" -> Export -> "Download CSV"
 *   5. Optional: repeat with the PREVIOUS period for --compare-pages
 *
 * USAGE
 *   node scripts/gsc-import.cjs --pages pages.csv
 *   node scripts/gsc-import.cjs --pages pages.csv --queries queries.csv --start 2026-07-19 --end 2026-10-16
 *   node scripts/gsc-import.cjs --pages cur.csv --compare-pages prev.csv
 *   node scripts/gsc-import.cjs --pages cur.csv --baseline      # write dated snapshot, don't clobber main file
 *
 * OPTIONS
 *   --pages <file>          Pages report CSV (required unless --queries only)
 *   --queries <file>        Queries report CSV (optional)
 *   --compare-pages <file>  Pages CSV for the PREVIOUS period (optional, enables `changes`)
 *   --start <YYYY-MM-DD>    Period start  (default: 90 days ago)
 *   --end <YYYY-MM-DD>      Period end    (default: 3 days ago, GSC data lag)
 *   --out <file>            Output path   (default: content/.gsc-performance.json)
 *   --baseline              Write to content/.gsc-baseline-YYYY-MM.json instead
 *   --site <sc-domain:...>  Site property (default: sc-domain:kbmjj123.cc)
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_SITE = 'sc-domain:kbmjj123.cc';
const DEFAULT_OUT = path.resolve(__dirname, '../content/.gsc-performance.json');
const TOP_QUERIES_PER_PAGE = 10;

// --- CLI ---

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { site: DEFAULT_SITE, out: DEFAULT_OUT, baseline: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--pages' && args[i + 1]) opts.pages = args[i + 1];
    if (a === '--queries' && args[i + 1]) opts.queries = args[i + 1];
    if (a === '--compare-pages' && args[i + 1]) opts.comparePages = args[i + 1];
    if (a === '--start' && args[i + 1]) opts.start = args[i + 1];
    if (a === '--end' && args[i + 1]) opts.end = args[i + 1];
    if (a === '--out' && args[i + 1]) opts.out = path.resolve(args[i + 1]);
    if (a === '--site' && args[i + 1]) opts.site = args[i + 1];
    if (a === '--baseline') opts.baseline = true;
  }
  return opts;
}

// --- CSV parsing (handles quoted fields, commas inside quotes, BOM) ---

function parseCSV(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inQuotes) {
      if (ch === '"') {
        if (raw[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field); field = '';
    } else if (ch === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

// --- Value coercion ---

function num(s) {
  if (s == null) return 0;
  const n = parseFloat(String(s).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? 0 : n;
}

/** CTR arrives either as "1.2%" or as a raw fraction "0.012". Normalise to percent. */
function pct(s) {
  if (s == null) return 0;
  const str = String(s).trim();
  if (str.includes('%')) return Math.round(num(str) * 100) / 100;
  const n = num(str);
  // Raw fraction from API-style export; UI export is already a percentage.
  return Math.round((n <= 1 ? n * 100 : n) * 100) / 100;
}

function toPath(value) {
  const v = String(value).trim();
  try {
    return new URL(v).pathname;
  } catch (e) {
    return v.startsWith('/') ? v : `/${v}`;
  }
}

// --- Column detection ---
// GSC UI exports use localized-ish headers; match the common English variants.

function findCol(headers, candidates) {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const c of candidates) {
    const idx = lower.indexOf(c.toLowerCase());
    if (idx !== -1) return idx;
  }
  // partial match fallback
  for (const c of candidates) {
    const idx = lower.findIndex((h) => h.includes(c.toLowerCase()));
    if (idx !== -1) return idx;
  }
  return -1;
}

const PAGE_COLS = ['Top pages', 'top pages', 'Page', 'page', 'Pages', 'Landing page'];
const QUERY_COLS = ['Top queries', 'top queries', 'Query', 'query', 'Queries'];
const CLICK_COLS = ['Clicks', 'clicks'];
const IMPR_COLS = ['Impressions', 'impressions'];
const CTR_COLS = ['CTR', 'ctr'];
const POS_COLS = ['Position', 'position', 'Average position', 'Avg position'];

function readRows(file, label) {
  const rows = parseCSV(file);
  if (rows.length < 2) {
    throw new Error(`${label}: no data rows found in ${file}`);
  }
  const headers = rows[0];
  const iPage = findCol(headers, PAGE_COLS);
  const iQuery = findCol(headers, QUERY_COLS);
  const iClicks = findCol(headers, CLICK_COLS);
  const iImpr = findCol(headers, IMPR_COLS);
  const iCtr = findCol(headers, CTR_COLS);
  const iPos = findCol(headers, POS_COLS);

  if (iClicks === -1 || iImpr === -1) {
    throw new Error(
      `${label}: could not find Clicks/Impressions columns in ${file}.\n` +
      `  Found headers: ${headers.join(' | ')}`
    );
  }
  if (iPage === -1 && iQuery === -1) {
    throw new Error(
      `${label}: could not find a Page or Query column in ${file}.\n` +
      `  Found headers: ${headers.join(' | ')}`
    );
  }

  const out = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    // Skip GSC's trailing "(sum)" / total rows
    const keyRaw = iQuery !== -1 ? row[iQuery] : row[iPage];
    if (!keyRaw || /^\(.*\)$/.test(String(keyRaw).trim())) continue;
    out.push({
      key: String(keyRaw).trim(),
      page: iPage !== -1 ? String(row[iPage] || '').trim() : null,
      query: iQuery !== -1 ? String(row[iQuery] || '').trim() : null,
      clicks: num(row[iClicks]),
      impressions: num(row[iImpr]),
      ctr: iCtr !== -1 ? pct(row[iCtr]) : 0,
      position: iPos !== -1 ? Math.round(num(row[iPos]) * 10) / 10 : 0,
    });
  }
  return { rows: out, hasPage: iPage !== -1, hasQuery: iQuery !== -1 };
}

// --- Date range ---

function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 90);
  end.setDate(end.getDate() - 3); // GSC data lags ~3 days
  const iso = (d) => d.toISOString().split('T')[0];
  return { start: iso(start), end: iso(end) };
}

// --- Main ---

function main() {
  const opts = parseArgs();

  if (!opts.pages && !opts.queries) {
    console.error('❌ Need at least --pages <csv> or --queries <csv>');
    console.error('   See header of this file for how to export from GSC.');
    process.exit(1);
  }

  const range = {
    start: opts.start || defaultRange().start,
    end: opts.end || defaultRange().end,
  };

  console.log(`📅 Period: ${range.start} → ${range.end}`);

  const pages = {};

  if (opts.pages) {
    const { rows } = readRows(opts.pages, 'pages');
    console.log(`📄 Parsed ${rows.length} page rows`);
    for (const r of rows) {
      const p = toPath(r.key);
      pages[p] = {
        impressions: r.impressions,
        clicks: r.clicks,
        ctr: r.ctr,
        avgPosition: r.position,
        topQueries: [],
      };
    }
  }

  // Queries: attach to pages when the export carries both dimensions,
  // otherwise keep a site-level list on the root.
  let siteQueries = null;
  if (opts.queries) {
    const { rows, hasPage } = readRows(opts.queries, 'queries');
    console.log(`🔍 Parsed ${rows.length} query rows` + (hasPage ? ' (with page dimension)' : ''));
    if (hasPage) {
      const byPage = {};
      for (const r of rows) {
        const p = toPath(r.page);
        (byPage[p] = byPage[p] || []).push({ query: r.query, clicks: r.clicks, impressions: r.impressions, position: r.position });
      }
      for (const [p, list] of Object.entries(byPage)) {
        if (!pages[p]) {
          pages[p] = { impressions: 0, clicks: 0, ctr: 0, avgPosition: 0, topQueries: [] };
        }
        pages[p].topQueries = list
          .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
          .slice(0, TOP_QUERIES_PER_PAGE)
          .map((q) => ({ query: q.query, clicks: q.clicks, impressions: q.impressions, position: q.position }));
      }
    } else {
      siteQueries = rows
        .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
        .slice(0, 50)
        .map((r) => ({ query: r.key, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position }));
    }
  }

  // Previous period -> enables `changes`
  let previousPeriod = null;
  let changes = { improved: [], declined: [] };
  if (opts.comparePages) {
    const { rows } = readRows(opts.comparePages, 'compare-pages');
    console.log(`📄 Parsed ${rows.length} previous-period rows`);
    previousPeriod = {};
    for (const r of rows) {
      const p = toPath(r.key);
      previousPeriod[p] = {
        impressions: r.impressions,
        clicks: r.clicks,
        ctr: r.ctr,
        avgPosition: r.position,
      };
    }
    for (const [p, cur] of Object.entries(pages)) {
      const prev = previousPeriod[p];
      if (!prev) continue;
      if (prev.avgPosition > 0 && cur.avgPosition > 0) {
        const delta = Math.round((prev.avgPosition - cur.avgPosition) * 10) / 10;
        if (Math.abs(delta) >= 1) {
          const entry = { slug: p, metric: 'position', from: prev.avgPosition, to: cur.avgPosition };
          (delta > 0 ? changes.improved : changes.declined).push(entry);
        }
      }
      const dImpr = cur.impressions - prev.impressions;
      if (Math.abs(dImpr) >= 10) {
        const entry = { slug: p, metric: 'impressions', from: prev.impressions, to: cur.impressions };
        (dImpr > 0 ? changes.improved : changes.declined).push(entry);
      }
    }
    console.log(`📈 Changes: +${changes.improved.length} improved / -${changes.declined.length} declined`);
  }

  const totalImpr = Object.values(pages).reduce((s, p) => s + p.impressions, 0);
  const totalClicks = Object.values(pages).reduce((s, p) => s + p.clicks, 0);

  const payload = {
    lastPulled: new Date().toISOString().split('T')[0],
    siteUrl: opts.site,
    period: { start: range.start, end: range.end },
    source: 'manual-csv-import',
    pages,
    ...(previousPeriod ? { previousPeriod } : {}),
    ...(previousPeriod ? { changes } : {}),
    ...(siteQueries ? { siteQueries } : {}),
  };

  let outPath = opts.out;
  if (opts.baseline) {
    const stamp = new Date().toISOString().slice(0, 7);
    outPath = path.resolve(__dirname, `../content/.gsc-baseline-${stamp}.json`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));

  console.log(`\n✅ Wrote ${outPath}`);
  console.log(`   Pages: ${Object.keys(pages).length}`);
  console.log(`   Total impressions: ${totalImpr}`);
  console.log(`   Total clicks: ${totalClicks}`);
  console.log(`   Overall CTR: ${totalImpr ? ((totalClicks / totalImpr) * 100).toFixed(2) : 0}%`);

  const withClicks = Object.entries(pages).filter(([, p]) => p.clicks > 0);
  console.log(`   Pages with ≥1 click: ${withClicks.length}`);
  if (withClicks.length) {
    console.log('\n   Top pages by clicks:');
    withClicks
      .sort((a, b) => b[1].clicks - a[1].clicks)
      .slice(0, 10)
      .forEach(([p, d]) => console.log(`     ${d.clicks}c / ${d.impressions}i  pos ${d.avgPosition}  ${p}`));
  }

  const top10 = Object.entries(pages).filter(([, p]) => p.avgPosition > 0 && p.avgPosition <= 10);
  console.log(`\n   Pages ranking in top 10: ${top10.length}`);
  if (top10.length) {
    top10
      .sort((a, b) => a[1].avgPosition - b[1].avgPosition)
      .slice(0, 10)
      .forEach(([p, d]) => console.log(`     pos ${d.avgPosition}  ${p}`));
  }
}

main();
