/**
 * rebuild-process.js
 * Rebuild content/.blog-process.json from all .md files in content/posts/.
 * Run after bulk edits, slug changes, or when process doc gets out of sync.
 *
 * Usage: node .claude/skills/blog-post-producer/scripts/rebuild-process.js
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.resolve(__dirname, '../../../../content/posts');
const OUTPUT_FILE = path.resolve(__dirname, '../../../../content/.blog-process.json');

// --- Helpers ---

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const lines = m[1].split('\n');
  const data = {};
  let ctx = null;
  data.seo = {};

  lines.forEach(line => {
    const t = line;
    if (t === 'tags:') { ctx = 'tags'; data.tags = []; return; }
    if (t === 'relatedPosts:') { ctx = 'relatedPosts'; data.relatedPosts = []; return; }
    if (t === 'seo:') { ctx = 'seo'; return; }

    if (t.startsWith('  ')) {
      const arr = t.match(/^\s+-\s+"(.+)"\s*$/);
      if (arr) {
        const v = arr[1];
        if (ctx === 'tags') { (data.tags || (data.tags = [])).push(v); return; }
        if (ctx === 'relatedPosts') { (data.relatedPosts || (data.relatedPosts = [])).push(v); return; }
        if (ctx === 'seoKeywords') { (data.seo.keywords || (data.seo.keywords = [])).push(v); return; }
      }
      const kv = t.match(/^\s+(\w+):\s*(.+)\s*$/);
      if (kv) {
        if (ctx === 'seo') {
          if (kv[1] === 'keywords') { ctx = 'seoKeywords'; return; }
          data.seo[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
          return;
        }
      }
      return;
    }

    ctx = null;
    const kv = t.match(/^(\w+):\s*(.*)$/);
    if (!kv) return;
    let val = kv[2].trim();
    if (val.startsWith('"')) val = val.replace(/^"(.*)"\s*$/, '$1');
    else if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (val === 'null') val = null;
    else if (!isNaN(Number(val)) && val.length > 0) val = Number(val);
    data[kv[1]] = val;
  });

  return data;
}

function extractBody(raw) {
  return raw.replace(/^---[\s\S]*?---\n*/, '');
}

function extractOutgoingLinks(body) {
  const links = [];
  // Match [text](/slug) for internal post links.
  // Exclude: (#) anchors, (https://...) external, (/images/...) assets.
  const re = /\[([^\]]+)\]\(\/([^)]+)\)/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    let slug = m[2].trim();
    // Skip anchors, external URLs, and asset paths
    if (slug === '#' || slug.startsWith('#') || slug.startsWith('http') || slug.startsWith('images/')) continue;
    // Strip any trailing fragment or query
    slug = slug.replace(/[#?].*$/, '').trim();
    if (!slug) continue;
    // Avoid duplicates
    if (!links.find(l => l.targetSlug === slug)) {
      links.push({ targetSlug: slug, anchorText: m[1].trim() });
    }
  }
  return links;
}

// --- Main ---

// Load existing performance data before rebuilding
const existingPerformance = {};
if (fs.existsSync(OUTPUT_FILE)) {
  try {
    const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    if (existing.articles) {
      existing.articles.forEach(a => {
        if (a.performance) existingPerformance[a.slug] = a.performance;
      });
    }
  } catch (e) {
    // File may be corrupted; proceed without performance data
  }
}

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).sort();
const articles = [];
const seriesMap = {};

files.forEach(f => {
  const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
  const slug = f.replace(/\.md$/, '');
  const fm = parseFrontmatter(raw);
  const body = extractBody(raw);
  const outgoing = extractOutgoingLinks(body);

  const art = {
    slug,
    title: fm.title || slug,
    status: fm.draft === true ? 'draft' : 'published',
    category: fm.category || '',
    series: fm.series || null,
    seriesOrder: fm.seriesOrder || null,
    createdAt: fm.date || null,
    tags: fm.tags || [],
    image: fm.image || null,
    relatedPostsDeclared: fm.relatedPosts || [],
    outgoingCount: outgoing.length,
    incomingCount: 0,
  };

  articles.push(art);

  if (fm.series && fm.series !== null && fm.series !== 'null') {
    if (!seriesMap[fm.series]) seriesMap[fm.series] = [];
    seriesMap[fm.series].push({ slug, order: fm.seriesOrder || 99 });
  }
});

// Count incoming links
articles.forEach(art => {
  art.incomingCount = 0; // will compute below
});

const allLinks = [];
articles.forEach(source => {
  const body = extractBody(fs.readFileSync(path.join(POSTS_DIR, source.slug + '.md'), 'utf8'));
  const outgoing = extractOutgoingLinks(body);
  outgoing.forEach(link => {
    allLinks.push({ from: source.slug, to: link.targetSlug, anchor: link.anchorText });
    const target = articles.find(a => a.slug === link.targetSlug);
    if (target) target.incomingCount++;
  });
});

// Build series
const series = Object.entries(seriesMap).map(([name, entries]) => {
  entries.sort((a, b) => (a.order || 99) - (b.order || 99));
  const slugs = entries.map(e => e.slug);
  return {
    name,
    articles: slugs,
    complete: slugs.every(s => articles.find(a => a.slug === s)?.status === 'published'),
    createdAt: entries[0]?.createdAt || null,
  };
});

// Assemble output (preserve performance data from previous rebuild)
const output = {
  lastUpdated: new Date().toISOString().split('T')[0],
  totalArticles: articles.length,
  published: articles.filter(a => a.status === 'published').length,
  drafts: articles.filter(a => a.status === 'draft').length,
  series,
  articles: articles.map(a => ({
    slug: a.slug,
    title: a.title,
    status: a.status,
    category: a.category,
    series: a.series,
    seriesOrder: a.seriesOrder,
    createdAt: a.createdAt,
    tags: a.tags,
    outgoingCount: a.outgoingCount,
    incomingCount: a.incomingCount,
    relatedPostsDeclared: a.relatedPostsDeclared,
    ...(existingPerformance[a.slug] ? { performance: existingPerformance[a.slug] } : {}),
  })),
  linkGraph: {
    totalLinks: allLinks.length,
    articlesWithNoOutgoing: articles.filter(a => a.outgoingCount === 0).map(a => a.slug),
    articlesWithNoIncoming: articles.filter(a => a.incomingCount === 0).map(a => a.slug),
    allLinks,
  },
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`Rebuilt: ${articles.length} articles, ${series.length} series, ${allLinks.length} links`);
