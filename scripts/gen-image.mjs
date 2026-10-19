#!/usr/bin/env node

/**
 * AI Image Generator — kbmjj123.cc
 *
 * Generate images via AI API for blog posts.
 *
 * Usage:
 *   node scripts/gen-image.mjs "prompt text"
 *   node scripts/gen-image.mjs "prompt" --style pixel --post my-article
 *   node scripts/gen-image.mjs "prompt" -o public/images/blog/cat.png
 *   node scripts/gen-image.mjs "prompt" --dry-run
 *
 * Env vars (in .env):
 *   AI_IMAGE_API_KEY   — API key
 *   AI_IMAGE_BASE_URL  — API base URL (default: https://ai.xmiaom.com/v1)
 *   AI_IMAGE_MODEL     — model name (default: gpt-image-2-4k)
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

// ── constants ─────────────────────────────────────────────────────

const PUBLIC_DIR = 'public';
const DEFAULT_OUTPUT_DIR = 'public/images/gen';

const STYLE_PRESETS = {
  pixel: {
    name: '像素风',
    prefix: 'Pixel art style, 16-bit retro game aesthetic, crisp pixels, limited color palette, ',
    suffix: ', pixel art, retro gaming, 8-bit inspired, clean edges, high detail',
  },
  photo: {
    name: '写实摄影',
    prefix: 'Professional photography, high resolution, ',
    suffix: ', sharp focus, detailed, studio lighting, 8k quality',
  },
  flat: {
    name: '扁平插画',
    prefix: 'Flat illustration style, vector art, clean lines, ',
    suffix: ', modern flat design, vibrant colors, minimal shadows, professional',
  },
  minimal: {
    name: '极简风格',
    prefix: 'Minimalist design, clean, simple, ',
    suffix: ', white space, geometric, modern, elegant, professional',
  },
  blog: {
    name: '博客封面',
    prefix: 'Blog post cover image, tech blog aesthetic, wide format, ',
    suffix: ', modern, clean, professional, high quality, editorial style',
  },
};

// ── arg parsing ───────────────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = {
    prompt: '',
    output: '',
    post: '',
    size: '1200x630',
    style: 'pixel',
    quality: 'high',
    name: '',
    prefix: '',
    suffix: '',
    dryRun: false,
    apiKey: '',
    noWatermark: false,
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === '--output' || arg === '-o') {
      opts.output = args[++i];
    } else if (arg === '--post' || arg === '-p') {
      opts.post = args[++i];
    } else if (arg === '--size' || arg === '-s') {
      opts.size = args[++i];
    } else if (arg === '--style') {
      opts.style = args[++i];
    } else if (arg === '--quality' || arg === '-q') {
      opts.quality = args[++i];
    } else if (arg === '--name' || arg === '-n') {
      opts.name = args[++i];
    } else if (arg === '--prefix') {
      opts.prefix = args[++i];
    } else if (arg === '--suffix') {
      opts.suffix = args[++i];
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--api-key') {
      opts.apiKey = args[++i];
    } else if (arg === '--no-watermark') {
      opts.noWatermark = true;
    } else if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else if (!arg.startsWith('-')) {
      opts.prompt = arg;
    } else {
      console.error(`✗  Unknown option: ${arg}`);
      process.exit(1);
    }
    i++;
  }

  if (!opts.prompt) {
    console.error('✗  Prompt is required');
    printUsage();
    process.exit(1);
  }

  return opts;
}

function printUsage() {
  console.log(`
✦  AI Image Generator — kbmjj123.cc

Usage:
  node scripts/gen-image.mjs "prompt text" [options]

Options:
  -o, --output <path>    Output file path (default: public/images/gen/<date>_<name>.png)
  -p, --post <slug>      Associate with article slug
  -s, --size <WxH>       Image size (default: 1200x630)
  --style <preset>       Style preset: pixel|photo|flat|minimal|blog (default: pixel)
  -q, --quality <level>  Quality: low|medium|high (default: high)
  -n, --name <name>      Custom filename (without extension)
  --prefix <text>        Add text before prompt
  --suffix <text>        Add text after prompt
  --dry-run              Print final prompt without calling API
  --api-key <key>        Override API key
  --no-watermark         Skip watermark
  -h, --help             Show this help

Env vars (.env):
  AI_IMAGE_API_KEY       API key (required)
  AI_IMAGE_BASE_URL      API base URL (default: https://ai.xmiaom.com/v1)
  AI_IMAGE_MODEL         Model name (default: gpt-image-2-4k)

Examples:
  node scripts/gen-image.mjs "a cat on keyboard" --style pixel
  node scripts/gen-image.mjs "futuristic city" --style photo --post tech-2026
  node scripts/gen-image.mjs "minimal logo" --style minimal -o public/logo.png
`);
}

// ── env loading ───────────────────────────────────────────────────

function loadEnv() {
  // Try to load .env file manually (no dotenv dependency)
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (existsSync(file)) {
      const content = readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

// ── prompt building ───────────────────────────────────────────────

function buildPrompt(opts) {
  const preset = STYLE_PRESETS[opts.style];
  if (!preset) {
    console.error(`✗  Unknown style: ${opts.style}`);
    console.error(`   Available: ${Object.keys(STYLE_PRESETS).join(', ')}`);
    process.exit(1);
  }

  const parts = [];
  if (opts.prefix) parts.push(opts.prefix);
  parts.push(preset.prefix);
  parts.push(opts.prompt);
  parts.push(preset.suffix);
  if (opts.suffix) parts.push(opts.suffix);

  return parts.join('');
}

// ── filename generation ───────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function generateFilename(opts) {
  const date = new Date().toISOString().slice(0, 10);
  const namePart = opts.name || slugify(opts.prompt);
  return `${date}_${namePart}.png`;
}

function resolveOutputPath(opts) {
  if (opts.output) {
    return path.resolve(opts.output);
  }

  const filename = generateFilename(opts);
  return path.resolve(DEFAULT_OUTPUT_DIR, filename);
}

// ── API call ──────────────────────────────────────────────────────

async function callApi(prompt, opts) {
  const apiKey = opts.apiKey || process.env.AI_IMAGE_API_KEY;
  if (!apiKey) {
    console.error('✗  API key required. Set AI_IMAGE_API_KEY in .env or use --api-key');
    process.exit(1);
  }

  const baseUrl = (process.env.AI_IMAGE_BASE_URL || 'https://ai.xmiaom.com/v1').replace(/\/$/, '');
  const model = process.env.AI_IMAGE_MODEL || 'gpt-image-2-4k';
  const url = `${baseUrl}/chat/completions`;

  console.log(`✦  Calling API...`);
  console.log(`   Model: ${model}`);
  console.log(`   Prompt: ${prompt.slice(0, 80)}${prompt.length > 80 ? '...' : ''}`);

  const body = {
    model,
    messages: [{ role: 'user', content: prompt }],
  };

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(120_000), // 2 min timeout
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      }

      const data = await res.json();
      console.log(`✦  API response received`);
      console.log(`   Response preview:`, JSON.stringify(data, null, 2).slice(0, 1000));
      return data;
    } catch (e) {
      lastError = e;
      if (attempt < 3) {
        console.log(`   Attempt ${attempt} failed, retrying in 3s...`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }

  console.error(`✗  API failed after 3 attempts: ${lastError.message}`);
  process.exit(1);
}

// ── response parsing ──────────────────────────────────────────────

function extractImageUrl(apiResponse) {
  // Try OpenAI-compatible response format
  const choice = apiResponse.choices?.[0];
  if (!choice) {
    console.error('✗  No choices in API response');
    console.error('   Response:', JSON.stringify(apiResponse, null, 2).slice(0, 500));
    process.exit(1);
  }

  const content = choice.message?.content;

  // Case 1: content is markdown image — ![alt](url)
  if (typeof content === 'string') {
    const mdMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (mdMatch) {
      return mdMatch[1];
    }
  }

  // Case 2: content is a URL string
  if (typeof content === 'string' && content.startsWith('http')) {
    return content;
  }

  // Case 3: content is JSON with image URL
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      if (parsed.url) return parsed.url;
      if (parsed.image_url) return parsed.image_url;
      if (parsed.data?.[0]?.url) return parsed.data[0].url;
    } catch {
      // not JSON, continue
    }
  }

  // Case 4: content is array with image objects
  if (Array.isArray(content)) {
    for (const item of content) {
      if (item.type === 'image_url' && item.image_url?.url) {
        return item.image_url.url;
      }
      if (item.url) return item.url;
    }
  }

  // Case 5: look for URL in the response broadly
  const responseStr = JSON.stringify(apiResponse);
  const urlMatch = responseStr.match(/https?:\/\/[^\s"'{}\\)]+\.(png|jpg|jpeg|webp|gif)[^\s"'{}]*/i);
  if (urlMatch) {
    return urlMatch[0].replace(/\\u0026/g, '&');
  }

  console.error('✗  Could not extract image URL from response');
  console.error('   Response preview:', JSON.stringify(apiResponse, null, 2).slice(0, 800));
  process.exit(1);
}

// ── image download ────────────────────────────────────────────────

async function downloadImage(url, apiKey) {
  console.log(`✦  Downloading image from: ${url}`);

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // Try with auth header first (some APIs require it)
      const headers = {};
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const res = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(60_000),
      });

      if (!res.ok) {
        // If auth failed, try without auth
        if (res.status === 401 || res.status === 403) {
          console.log(`   Auth failed, trying without auth header...`);
          const res2 = await fetch(url, {
            signal: AbortSignal.timeout(60_000),
          });
          if (!res2.ok) {
            throw new Error(`HTTP ${res2.status}`);
          }
          const arrayBuffer = await res2.arrayBuffer();
          return Buffer.from(arrayBuffer);
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (e) {
      lastError = e;
      if (attempt < 3) {
        console.log(`   Download attempt ${attempt} failed, retrying...`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  console.error(`✗  Download failed: ${lastError.message}`);
  process.exit(1);
}

// ── image saving ──────────────────────────────────────────────────

async function saveImage(buffer, outputPath) {
  const dir = path.dirname(outputPath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  await writeFile(outputPath, buffer);
  console.log(`✦  Saved: ${outputPath}`);
}

// ── watermark (optional) ──────────────────────────────────────────

async function addWatermark(imagePath) {
  try {
    const sharp = (await import('sharp')).default;
    const buf = await sharp(imagePath).toBuffer();
    const meta = await sharp(buf).metadata();

    if (!meta.width || !meta.height) return;

    const fontSize = Math.max(11, Math.round(Math.min(meta.width, meta.height) * 0.018));
    const pad = Math.max(8, Math.round(Math.min(meta.width, meta.height) * 0.014));

    const svg = Buffer.from(
      `<svg width="${meta.width}" height="${meta.height}" xmlns="http://www.w3.org/2000/svg">
        <text x="${meta.width - pad}" y="${meta.height - pad}" font-family="sans-serif"
              font-size="${fontSize}" fill="rgba(255,255,255,0.55)"
              text-anchor="end">kbmjj123.cc</text>
      </svg>`
    );

    await sharp(buf)
      .composite([{ input: svg, top: 0, left: 0 }])
      .toFile(imagePath);

    console.log(`✦  Watermark added`);
  } catch {
    // sharp not available or failed — skip silently
  }
}

// ── output helpers ────────────────────────────────────────────────

function printResult(outputPath, opts) {
  // Convert absolute path to public-relative URL
  const publicRelative = outputPath.includes(`${PUBLIC_DIR}/`)
    ? '/' + path.relative(PUBLIC_DIR, outputPath).replace(/\\/g, '/')
    : outputPath;

  console.log('');
  console.log('─'.repeat(50));
  console.log('✅  Image generated successfully!');
  console.log('');
  console.log('📋  Frontmatter:');
  console.log(`    cover: ${publicRelative}`);
  console.log('');
  console.log('📋  Markdown:');
  console.log(`    ![image](${publicRelative})`);
  console.log('─'.repeat(50));
}

// ── main ──────────────────────────────────────────────────────────

async function main() {
  loadEnv();

  const opts = parseArgs(process.argv);

  // Build final prompt
  const fullPrompt = buildPrompt(opts);

  if (opts.dryRun) {
    console.log('─'.repeat(50));
    console.log('✦  Dry run — final prompt:');
    console.log('');
    console.log(`   ${fullPrompt}`);
    console.log('');
    console.log(`   Style: ${opts.style} (${STYLE_PRESETS[opts.style].name})`);
    console.log(`   Size:  ${opts.size}`);
    console.log('─'.repeat(50));
    return;
  }

  // Resolve output path
  const outputPath = resolveOutputPath(opts);

  // Check if file exists
  if (existsSync(outputPath)) {
    console.error(`✗  File already exists: ${outputPath}`);
    console.error('   Use --name or --output to specify a different path');
    process.exit(1);
  }

  // Call API
  const apiResponse = await callApi(fullPrompt, opts);

  // Extract image URL from response
  const imageUrl = extractImageUrl(apiResponse);
  console.log(`✦  Got image URL: ${imageUrl.slice(0, 80)}...`);

  // Download image
  const apiKey = opts.apiKey || process.env.AI_IMAGE_API_KEY;
  const imageBuffer = await downloadImage(imageUrl, apiKey);

  // Save image
  await saveImage(imageBuffer, outputPath);

  // Add watermark (unless disabled)
  if (!opts.noWatermark) {
    await addWatermark(outputPath);
  }

  // Print result
  printResult(outputPath, opts);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
