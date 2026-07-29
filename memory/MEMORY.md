# Memory Index

> Persistent memory for the content system. Loaded each session to provide context.
> Each file contains one fact/topic with frontmatter for metadata.

## Content System Memory

- [Successful Content Patterns](successful-content-patterns.md) — Patterns from high-performing articles, used to guide writing
- [Competitor Intelligence](competitor-intelligence.md) — SERP analysis and competitor content profiles
- [Content Gaps](content-gaps.md) — Keyword opportunities and uncovered search intents
- [Skill Changelog](skill-changelog.md) — History of rule changes to content skills

## How Memory Works

1. `content-evolver` writes to these files during monthly reviews
2. `content-strategist` reads them when recommending topics
3. `blog-post-producer` reads them when writing articles
4. User confirms all rule updates before they're applied
