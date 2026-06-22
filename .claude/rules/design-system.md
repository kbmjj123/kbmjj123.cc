# Pixel Design System

Follow @.claude/docs/*.html exactly for all visual output.

## Design Tokens

```css
/* Core palette — DO NOT change */
--bg-deep: #0b0b12;         /* page bg */
--bg-card: #13131e;         /* card/container bg */
--border-pixel: #2a2a42;    /* default border */
--text-primary: #e8edf5;    /* headings */
--text-secondary: #9aa8c9;  /* body text */
--text-muted: #4d5a7a;      /* meta/counts */
--accent-green: #4ade80;    /* primary accent */
--accent-gold: #fbbf24;     /* secondary accent */

/* Semantic */
--error-red: #f87171;       /* error pages */
--accent-blue: #60a5fa;     /* empty states */

/* Fonts */
--font-ui: 'Inter', -apple-system, ...;
--font-pixel: 'Press Start 2P', monospace;
```

## Layout

- Max-width container: 1150px, `--bg-card` bg, 2px `--border-pixel` border
- Top decorative bar: dashed green gradient `repeating-linear-gradient`
- Main grid: `2.2fr 1fr` (content + sidebar), collapses to 1fr at 860px
- Content sections: card with `◆` top-left indicator via `::before`
- Body bg: `--bg-deep` + dot grid pattern (50px circles at 2% opacity)

## Navigation

- Pixel font 10px, links wrapped in `[` `]` brackets
- Hover/active: green border + bg tint
- Active page uses `.active` class (same hover style)

## Sidebar Widgets

- `.widget`: translucent card, `--border-pixel` border
- `.widget-title`: gold pixel font, `▸` prefix, bottom border
- Category list: dotted separators, count bubble with pixel font
- Tag cloud: pixel font 7-8px, `--bg-deep` bg, border-pixel, hover→green

## Buttons

- `.btn-read`: green border, pixel font ~10px, 2px shadow on hover
- Fill bg on hover, text goes dark
- Error/empty variants use their accent color instead of green

## Animations

- `fadeUp`: 0.5s ease, opacity 0→1 + translateY 20px→0
- `flowLine`: top bar green dashes scroll horizontally (4s linear)
- `pulseBlock`: gold pixel block scales 1→1.15 (3s ease-in-out infinite)
- Loading: 4-block grid with staggered `blockPulse` animation

## States

| Page | Border Accent | Icon/Emoji |
|------|--------------|------------|
| 404/500 | `--error-red` | Triangle warning |
| Empty | `--accent-blue` | Cross (+) icon |
| Loading | `--accent-green` | 4-block grid |
| Normal | `--border-pixel` | — |

## Responsive

- **860px max**: grid→single column, header stacks, font sizes reduce
- **480px max**: tighter padding, smaller pixel font, compact sections
- Use `@media (max-width: 860px)` and `(max-width: 480px)` exclusively

## Scrollbar

Custom style: 10px wide, green thumb, `--bg-deep` track.
