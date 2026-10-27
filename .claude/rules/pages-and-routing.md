# Pages & Routing

Follow @.claude/docs/*.html for page design. Route list in PRD `§9.1`.

## Page Structure

| Route | Template | Description |
|-------|----------|-------------|
| `/` | `index.html` | Post list (home) |
| `/[slug]` | — | Post detail (from HTML post-list link) |
| `/archive` | `archive.html` | Posts grouped by year |
| `/videos` | `videos.html` | YouTube grid, data from `data/videos.json` |
| `/about` | `about.html` | Author info, timeline, tech stack |
| `/projects` | `project.html` | 2-col project card grid |
| `/tags` | `tags.html` | Tag cloud page |
| `/category` | `category.html` | Category listing page |
| `/admin` | — | Admin dashboard (authenticated) |

## Loader

- `index.html` has loading overlay: 4-block grid + "LOADING" text
- JS removes on `window.load` event
- Every page SHOULD implement this loader pattern

## Error / Empty / Loading States

Every page must handle these states:

- **Loading**: `loading.html` — 4-block grid pulse animation + blinking "LOADING"
- **Error**: `error.html` — red border, triangle icon, retry/home buttons, error code display
- **Empty**: `empty.html` — blue border, cross icon, create post CTA, back link

Use `NuxtErrorBoundary` for error states across pages.

## Nav Items

Standard links: Home, Archive, Videos, About, Projects
Active page identified by matching route, applies `.active` class.
