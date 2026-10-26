# 中文参考版本（不参与部署）

此目录存放博客文章的中文翻译版本，仅供作者和中文读者参考。

- **不参与构建和部署** — Nuxt Content collection 只收集 `content/posts/*.md`
- 文件命名: `{slug}.zh.md`，与英文原版同名
- 英文原版: `content/posts/{slug}.md`
- 由 `blog-post-producer` skill 在写英文版时同步生成

## Frontmatter

```yaml
---
title: "中文标题"
description: "中文描述"
slug: "{english-slug}"
originalDate: YYYY-MM-DD
category: {category}
tags: [...]
note: "中文参考版本 — 不参与部署。英文原版: content/posts/{slug}.md"
---
```
