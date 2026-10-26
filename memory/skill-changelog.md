---
name: skill-changelog
description: History of rule changes to content skills — what changed, why, and user decisions.
metadata:
  type: project
---

# Skill Changelog

> Records every rule update to `content-strategist` and `blog-post-producer`. Each entry includes the evidence and user's decision.
> Last updated: 2026-07-29 (initial)

## Format

```
### [Date] — [Change Title]

**Skill**: [content-strategist / blog-post-producer / content-evolver]
**Section**: [which section was changed]
**What**: [specific change]
**Why**: [data evidence — which articles, what metrics]
**Decision**: [approved / modified / rejected]
**User note**: [any user feedback]
```

---

## Changelog

### 2026-07-29 — Initial Setup

**Skill**: content-evolver (new)
**Section**: —
**What**: Created content-evolver skill with closed-loop learning workflow. Created memory files: successful-content-patterns.md, competitor-intelligence.md, content-gaps.md, skill-changelog.md.
**Why**: Content system needed feedback mechanism to improve over time.
**Decision**: Approved
**User note**: Semi-automatic, user confirms all rule updates.

### 2026-07-29 — Article Optimization: claude-code-on-phone

**Skill**: blog-post-producer (via content-evolver review)
**Section**: SEO title, DeepSeek section, New section "Two Months In"
**What**: 
1. SEO title changed from "Claude Code on Phone: $29/Month Workflow..." to "Claude Code Remote Setup: Run CLI on Phone via Cockpit + Tailscale ($29/Month)" — covers "claude code remote" keyword
2. Expanded DeepSeek section with: cost breakdown table, API configuration details, limitations list
3. Added "Two Months In" section with: Top 3 use cases, expected vs unexpected findings, biggest surprise
4. readTime updated from 9mins to 12mins
**Why**: Competitor analysis showed no top results cover mobile usage, DeepSeek alternative, or long-term experience. These additions fill identified intent gaps.
**Decision**: Approved
**User note**: —
