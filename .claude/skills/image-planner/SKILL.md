# Image Planner — kbmjj123.cc

## Overview

This skill automates the image workflow for blog posts. It analyzes an article, creates the image directory, adds cover image to frontmatter, inserts image placeholders at appropriate locations, and generates a checklist of images the user needs to provide.

**Parent skill**: `blog-post-producer` — automatically invokes this skill during Phase 4D.

**Trigger**: User says "add images" / "plan images" / "image placeholders" / "图片占位" / "补图" or when finishing an article draft that has no images.

## Workflow

### Phase 1: Analyze Article

1. Read the article at `content/posts/{slug}.md`
2. Extract from frontmatter:
   - `category` — used in image path
   - `image` — check if already set
   - `slug` — derived from filename
3. Scan body for:
   - Existing `![alt](path)` image references
   - Sections that would benefit from images (tutorials, architecture, UI steps)
   - Code blocks that produce visual output (terminal, JSON)
   - Multi-component system descriptions (need architecture diagrams)

### Phase 2: Create Image Directory

```bash
mkdir -p public/images/{category}/{slug}/
```

### Phase 3: Determine Image Plan

Based on article type, determine which images are needed:

| Article Type | Recommended Images |
|-------------|-------------------|
| **Tutorial / How-to** | Cover + screenshots at each UI step + architecture diagram |
| **Troubleshooting** | Cover + error screenshots + fix verification screenshots |
| **Comparison** | Cover + comparison table (can be markdown, not image) |
| **Philosophy / Mindset** | Cover + 1-2 illustrative images |
| **Tool Review** | Cover + tool UI screenshots + results |
| **Architecture / System** | Cover + architecture diagram (SVG) + data flow diagram |

### Phase 4: Insert Placeholders

#### 4A — Cover Image

Add to frontmatter:

```yaml
image: "/images/{category}/{slug}/cover.webp"
```

If `image` field already exists but is empty string `""`, replace it.
If `image` field already has a value, leave it unchanged.

#### 4B — Body Images

For each image placement point, insert:

```markdown
![Descriptive alt text](/images/{category}/{slug}/{filename}.webp)
```

**Placement rules:**
- Architecture diagrams: after the system description paragraph, before code blocks
- Screenshots: after the step that requires the UI action
- Code output: after the code block that produces the output
- Cover-level images: at the top of the relevant section

**Alt text rules:**
- Describe what is SHOWN, not what the image IS
- ❌ "Screenshot" / "Image" / "Diagram"
- ✅ "Connection chain: Phone → Tailscale → Cockpit → Claude Code → DeepSeek API"
- ✅ "Google Cloud Console: enabling the Search Console API"

### Phase 5: Generate Checklist

Output a checklist to the user:

```
## 📸 Image Checklist

Directory: `public/images/{category}/{slug}/`

| # | File | Description | Placement | Status |
|---|------|-------------|-----------|--------|
| 1 | `cover.webp` | [description] | frontmatter | ⬜ 待补充 |
| 2 | `architecture.svg` | [description] | [section] | ✅ 已生成 / ⬜ 待生成 |
| 3 | `screenshot.webp` | [description] | [section] | ⬜ 待补充 |

⚠️ = 需要用户提供真实截图
✅ = AI 可生成（SVG/mermaid）
```

### Phase 6: Generate SVGs (If Applicable)

For architecture diagrams, flowcharts, and system design images that AI can generate:

1. Create SVG file at the specified path
2. Use the blog's pixel design tokens:
   - Background: `#0b0b12`
   - Card: `#13131e`
   - Border: `#2a2a42`
   - Green: `#4ade80`
   - Gold: `#fbbf24`
   - Blue: `#60a5fa`
   - Text: `#e8edf5` / `#9aa8c9`
3. Font: `Inter, -apple-system, sans-serif`
4. Mark as ✅ in checklist

## Image Naming Convention

```
public/images/{category}/{slug}/
├── cover.webp                          # 封面图 (1200×630)
├── architecture.svg                    # 架构图 (AI 生成)
├── {step}-{description}.webp           # 步骤截图
├── {step}-{description}-m.webp         # 移动端变体 (可选)
└── terminal-{output-name}.webp         # 终端输出截图
```

**Naming rules:**
- Lowercase, hyphenated
- Prefix with step number for sequential screenshots: `01-enable-api.webp`
- Use descriptive names: `phone-cockpit-terminal.webp` not `screenshot1.webp`
- Mobile variant suffix: `-m.webp` (optional, 600px wide)

## Image Size Guidelines

| Type | Width | Aspect Ratio |
|------|-------|-------------|
| Cover | 1200px | 1.91:1 (1200×630) |
| Screenshot | 1200px | varies |
| Mobile screenshot | 600px | varies |
| Architecture SVG | 800px | varies |

## Integration with blog-post-producer

This skill is called by `blog-post-producer` during Phase 4 (Write Articles) when visual assets are needed. It can also be invoked standalone on any existing article.

**Standalone trigger**: "add images to [slug]" / "plan images for [slug]" / "给 [slug] 加图片占位"

## Output

After running, the article `.md` file will have:
1. `image` field set in frontmatter
2. `![alt](path)` placeholders in body at appropriate locations
3. A checklist printed to the user showing what images are needed

The user then:
1. Captures real screenshots and saves to the specified paths
2. Reviews any AI-generated SVGs
3. Sets `draft: false` when all images are in place
