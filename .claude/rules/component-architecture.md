# Component Architecture

## Layout Components (`components/layout/`)

| Component | Role |
|-----------|------|
| `AppHeader` | Site title, nav links, theme toggle |
| `AppFooter` | Copyright, social links, RSS |
| `AppSidebar` | About widget, categories, tags, pixel counter |
| `MobileTabBar` | Bottom nav on mobile |
| `NavItem` | Individual nav link (handles active state) |
| `ThemeToggle` | Dark/light mode switch |
| `AuthButton` | Admin login/logout |

## UI Components (`components/ui/`)

| Component | Usage |
|-----------|-------|
| `BaseButton` | `.btn-read` style, pixel font, green border |
| `BaseInput` | Styled form input matching pixel theme |
| `BaseSelect` | Styled select dropdown |
| `BaseBadge` | Category/tag/style badges |
| `BaseTag` | Pixel-font tag chip |
| `BaseToast` | Notification toast |
| `BaseSkeleton` | Loading placeholder |

## Pattern Rules

- Every component uses CSS variables from `main.css` — no hardcoded colors
- Pixel font (`--font-pixel`) used for: titles, nav, meta, tags, buttons, counters
- UI font (`--font-ui`) used for: body text, excerpts, descriptions
- Components emit events upward (no direct store mutations)
- All interactive elements have hover states (green accent)
- Animation durations consistent: 0.15s for hover, 0.5s for fadeIn, 3-4s for looped

## OG Image Component

- `AppOgImage` in `components/og/` — renders 1200×630 pixel OG card
- Uses `@resvg/resvg-js` or Satori for server-side rendering
- Design matches pixel theme: green borders, pixel font, gold accents

## Page-Level Components

Create page-specific components under `components/` matching page name:
- `PostList` — homepage article feed
- `PostDetail` — single post display
- `ArchiveList` — year-grouped archive
- `ProjectGrid` — project card grid
- `RelatedPosts` — tag-based recommendations
