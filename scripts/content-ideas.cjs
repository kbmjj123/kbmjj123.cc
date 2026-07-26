#!/usr/bin/env node
/**
 * content-ideas.cjs
 * Generate content ideas from real user search data.
 *
 * Data sources:
 *   1. GSC API — queries your site already appears for (with position/impressions)
 *   2. Google Autocomplete — what users are actively searching for right now
 *   3. (Optional) Semrush CSV report — parse exported keyword data
 *
 * Prerequisites:
 *   - Run `node scripts/gsc-pull.cjs` first to populate .gsc-performance.json
 *   - Or provide a Semrush CSV at .claude/semrush-report.csv
 *
 * Usage:
 *   node scripts/content-ideas.cjs [--top 10] [--semrush .claude/semrush-report.csv]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- Config ---

const GSC_DATA_PATH = path.resolve(__dirname, '../content/.gsc-performance.json');
const BLOG_PROCESS_PATH = path.resolve(__dirname, '../content/.blog-process.json');
const POSTS_DIR = path.resolve(__dirname, '../content/posts');
const DEFAULT_TOP = 10;

// Cold-start seed keywords: blog's tech stack + domain pillars
const SEED_KEYWORDS = [
  // Tools / Infrastructure
  'cloudflare d1',
  'cloudflare pages',
  'cloudflare r2',
  'cloudflare workers',
  'nuxt 4',
  'nuxt content',
  'nuxt ssg',
  'vercel',
  'supabase',
  'drizzle orm',
  // Building / Technical
  'static site generation',
  'server side rendering',
  'image optimization',
  'full text search',
  'email subscription',
  'og image generation',
  // Growth / SEO
  'google search console',
  'seo for developers',
  'web performance',
  'core web vitals',
  // Workflow
  'github actions deploy',
  'ci cd pipeline',
  'developer workflow',
];

// --- Parse CLI args ---

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { top: DEFAULT_TOP, semrush: null, seed: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--top' && args[i + 1]) opts.top = parseInt(args[i + 1], 10);
    if (args[i] === '--semrush' && args[i + 1]) opts.semrush = path.resolve(args[i + 1]);
    if (args[i] === '--seed') opts.seed = true;
  }
  return opts;
}

// --- Google Autocomplete ---

function fetchAutocomplete(query, lang = 'en') {
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encoded}&hl=${lang}`;
    const result = execSync(`curl -s "${url}" -H "User-Agent: Mozilla/5.0"`, {
      encoding: 'utf8',
      timeout: 10000,
    });
    const parsed = JSON.parse(result);
    return parsed[1] || [];
  } catch (e) {
    return [];
  }
}

function expandQuery(query) {
  // Get autocomplete suggestions for the base query
  const suggestions = fetchAutocomplete(query);

  // Also try with question words to find informational queries
  const questionVariants = [
    `how to ${query}`,
    `${query} vs`,
    `${query} tutorial`,
    `${query} example`,
  ];

  const allSuggestions = new Set(suggestions);

  // Fetch question variants
  for (const v of questionVariants) {
    fetchAutocomplete(v).forEach(s => allSuggestions.add(s));
  }

  return Array.from(allSuggestions);
}

// --- Semrush CSV Parser ---

function parseSemrushCSV(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Semrush CSV not found: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  // Parse header
  const header = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());

  // Find column indices
  const keywordIdx = header.findIndex(h => h.includes('keyword'));
  const volumeIdx = header.findIndex(h => h.includes('volume'));
  const kdIdx = header.findIndex(h => h.includes('difficulty') || h.includes('kd'));
  const cpcIdx = header.findIndex(h => h.includes('cpc'));

  if (keywordIdx === -1) {
    console.error('❌ Could not find keyword column in Semrush CSV');
    return [];
  }

  const keywords = [];
  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parse (handles quoted fields)
    const cols = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
    if (!cols || cols.length < keywordIdx + 1) continue;

    const keyword = cols[keywordIdx].replace(/"/g, '').trim();
    if (!keyword) continue;

    keywords.push({
      keyword,
      volume: volumeIdx >= 0 ? parseInt(cols[volumeIdx].replace(/"/g, ''), 10) || 0 : 0,
      kd: kdIdx >= 0 ? parseInt(cols[kdIdx].replace(/"/g, ''), 10) || 0 : 0,
      cpc: cpcIdx >= 0 ? parseFloat(cols[cpcIdx].replace(/"/g, '')) || 0 : 0,
      source: 'semrush',
    });
  }

  console.log(`📊 Parsed ${keywords.length} keywords from Semrush CSV`);
  return keywords;
}

// --- Gap Analysis ---

function getExistingCoverage() {
  // Read all existing post slugs and frontmatter to build coverage map
  const coverage = {
    slugs: new Set(),
    titles: [],
    keywords: new Set(), // words found in titles and tags
  };

  if (!fs.existsSync(POSTS_DIR)) return coverage;

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  for (const f of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
    const slug = f.replace(/\.md$/, '');
    coverage.slugs.add(slug);

    // Extract title from frontmatter
    const titleMatch = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (titleMatch) {
      const title = titleMatch[1].replace(/["']/g, '');
      coverage.titles.push({ slug, title });
      // Extract meaningful words from title
      title.toLowerCase().split(/\s+/).forEach(w => {
        if (w.length > 3) coverage.keywords.add(w);
      });
    }

    // Extract tags
    const tagMatches = raw.match(/tags:\s*\n((?:\s+-\s+.+\n?)+)/);
    if (tagMatches) {
      tagMatches[1].match(/#(\w+)/g)?.forEach(t => {
        coverage.keywords.add(t.replace('#', '').toLowerCase());
      });
    }
  }

  return coverage;
}

function isCovered(keyword, coverage) {
  const words = keyword.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const matchedWords = words.filter(w => coverage.keywords.has(w));
  // If >50% of meaningful words match existing content, consider it covered
  return matchedWords.length >= Math.ceil(words.length * 0.5);
}

// --- Scoring ---

function scoreOpportunity(item) {
  // Higher score = better opportunity
  // Factors: impressions (demand), position (room to improve), not covered yet
  let score = 0;

  // Impressions indicate demand
  score += Math.log2(Math.max(item.impressions, 1)) * 10;

  // Position 20-50 = room to improve with better content
  if (item.position > 20 && item.position < 50) score += 30;
  else if (item.position >= 50 && item.position < 80) score += 15;
  else if (item.position >= 80) score += 5; // too buried, may not be relevant

  // Bonus if not covered by existing content
  if (!item.covered) score += 25;

  // Bonus if Autocomplete confirms demand
  if (item.autocompleteCount > 0) score += item.autocompleteCount * 3;

  return Math.round(score);
}

// --- Main ---

function main() {
  const opts = parseArgs();

  console.log('🔍 Content Idea Generator\n');

  // 1. Load GSC data
  let gscQueries = [];
  if (fs.existsSync(GSC_DATA_PATH)) {
    const gsc = JSON.parse(fs.readFileSync(GSC_DATA_PATH, 'utf8'));
    if (gsc.lastPulled) {
      // Extract all queries from all pages
      for (const [pagePath, pageData] of Object.entries(gsc.pages || {})) {
        for (const q of (pageData.topQueries || [])) {
          gscQueries.push({
            query: q.query,
            impressions: q.impressions,
            clicks: q.clicks,
            position: q.position,
            ctr: q.ctr,
            page: pagePath,
            source: 'gsc',
          });
        }
      }
      console.log(`📊 GSC: ${gscQueries.length} queries from ${Object.keys(gsc.pages || {}).length} pages`);
    } else {
      console.log('⚠️  GSC data file exists but has no data. Run `node scripts/gsc-pull.cjs` first.');
    }
  } else {
    console.log('⚠️  No GSC data found. Run `node scripts/gsc-pull.cjs` first.');
  }

  // 2. Load Semrush data (if provided)
  let semrushKeywords = [];
  if (opts.semrush) {
    semrushKeywords = parseSemrushCSV(opts.semrush);
  }

  // 3. Load existing content coverage
  const coverage = getExistingCoverage();
  console.log(`📝 Existing content: ${coverage.slugs.size} articles, ${coverage.keywords.size} unique keywords\n`);

  // 4. Build opportunity list from GSC data
  // Focus on queries where we have impressions but poor position
  const opportunities = [];

  for (const q of gscQueries) {
    if (q.impressions < 10) continue; // too little data

    const covered = isCovered(q.query, coverage);
    const item = {
      query: q.query,
      impressions: q.impressions,
      clicks: q.clicks,
      position: q.position,
      ctr: q.ctr,
      existingPage: q.page,
      covered,
      autocompleteCount: 0,
      autocompleteSuggestions: [],
      source: 'gsc',
    };

    opportunities.push(item);
  }

  // 4b. Cold-start mode: if no GSC data, use seed keywords
  if (opportunities.length === 0) {
    console.log('🌱 No GSC data — entering cold-start mode with seed keywords...\n');
    for (const seed of SEED_KEYWORDS) {
      if (isCovered(seed, coverage)) continue;
      opportunities.push({
        query: seed,
        impressions: 0,
        clicks: 0,
        position: 0,
        ctr: 0,
        covered: false,
        autocompleteCount: 0,
        autocompleteSuggestions: [],
        source: 'seed',
      });
    }
    console.log(`🌱 Added ${opportunities.length} seed keywords to explore`);
  }

  // 5. Add Semrush keywords
  for (const kw of semrushKeywords) {
    if (kw.volume < 50) continue;
    const covered = isCovered(kw.keyword, coverage);
    const existing = opportunities.find(o => o.query === kw.keyword);
    if (existing) {
      // Enrich existing GSC data with Semrush volume/KD
      existing.volume = kw.volume;
      existing.kd = kw.kd;
      existing.source = 'gsc+semrush';
    } else {
      opportunities.push({
        query: kw.keyword,
        impressions: 0,
        clicks: 0,
        position: 0,
        ctr: 0,
        volume: kw.volume,
        kd: kw.kd,
        covered,
        autocompleteCount: 0,
        autocompleteSuggestions: [],
        source: 'semrush',
      });
    }
  }

  // 6. Expand top queries with Google Autocomplete
  console.log('🌐 Expanding queries with Google Autocomplete...');
  const topQueries = opportunities
    .filter(o => !o.covered)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20); // limit to top 20 to avoid too many API calls

  for (const item of topQueries) {
    const suggestions = expandQuery(item.query);
    item.autocompleteSuggestions = suggestions;
    item.autocompleteCount = suggestions.length;

    // Also check if any suggestion is a new uncovered opportunity
    for (const suggestion of suggestions) {
      if (suggestion === item.query) continue;
      if (isCovered(suggestion, coverage)) continue;
      if (opportunities.find(o => o.query === suggestion)) continue;

      opportunities.push({
        query: suggestion,
        impressions: 0,
        clicks: 0,
        position: 0,
        ctr: 0,
        covered: false,
        autocompleteCount: 0,
        autocompleteSuggestions: [],
        source: 'autocomplete',
        parentQuery: item.query,
      });
    }
  }

  // 7. Score and rank
  for (const item of opportunities) {
    item.score = scoreOpportunity(item);
  }

  const ranked = opportunities
    .filter(o => !o.covered) // only uncovered topics
    .sort((a, b) => b.score - a.score)
    .slice(0, opts.top);

  // 8. Output
  console.log('\n' + '='.repeat(60));
  console.log(`TOP ${opts.top} CONTENT IDEAS (by opportunity score)`);
  console.log('='.repeat(60) + '\n');

  if (ranked.length === 0) {
    console.log('No uncovered opportunities found. All seed topics may be covered.');
    console.log('Try:');
    console.log('  1. Add more seed keywords to SEED_KEYWORDS in the script');
    console.log('  2. Provide Semrush CSV via --semrush flag');
    console.log('  3. Run `node scripts/gsc-pull.cjs` to get GSC data');
    return;
  }

  for (let i = 0; i < ranked.length; i++) {
    const item = ranked[i];
    const num = String(i + 1).padStart(2, ' ');

    console.log(`${num}. "${item.query}"`);
    console.log(`    Score: ${item.score} | Source: ${item.source}`);

    if (item.impressions > 0) {
      console.log(`    GSC: ${item.impressions} impressions, position ${item.position}, ${item.ctr}% CTR`);
    }
    if (item.volume) {
      console.log(`    Semrush: ${item.volume}/mo volume, KD: ${item.kd}`);
    }
    if (item.autocompleteSuggestions.length > 0) {
      const related = item.autocompleteSuggestions.slice(0, 5).join(', ');
      console.log(`    Autocomplete: ${related}`);
    }
    if (item.existingPage) {
      console.log(`    Related page: ${item.existingPage}`);
    }
    if (item.parentQuery) {
      console.log(`    Expanded from: "${item.parentQuery}"`);
    }

    console.log('');
  }

  // 9. Save to file
  const outputPath = path.resolve(__dirname, '../content/.content-ideas.json');
  const output = {
    generatedAt: new Date().toISOString(),
    top: opts.top,
    ideas: ranked.map(item => ({
      query: item.query,
      score: item.score,
      source: item.source,
      impressions: item.impressions,
      position: item.position,
      volume: item.volume || null,
      kd: item.kd || null,
      autocompleteSuggestions: item.autocompleteSuggestions.slice(0, 10),
      existingPage: item.existingPage || null,
      parentQuery: item.parentQuery || null,
    })),
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`✅ Saved to ${outputPath}`);
}

try {
  main();
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
