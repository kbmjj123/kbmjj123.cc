# PixelBlog 产品需求文档（PRD）

> 版本：1.0  
> 最后更新：2026-06-22  
> 项目类型：个人独立开发者博客系统  
> 技术栈：Nuxt 4 + Cloudflare Pages/D1/R2 + Resend + Nuxt Content  

---

## 1. 项目概述

### 1.1 背景与目标
- 为独立开发者打造一个**像素风格、完全自控、全自动化**的博客平台。
- 强调内容所有权、低维护成本、国际化分发。
- 本项目为个人项目，代码开源（但不接受外部贡献）。

### 1.2 核心价值
- **像素美学**：独特复古设计，区别于主流博客。
- **全链路自动化**：写文 → 提交 Git → 自动构建部署 → 自动分发到各大社区。
- **零成本运营**：基于 Cloudflare 免费额度，无服务器费用。
- **数据完全掌控**：内容以 Markdown 存储，可迁移；评论、订阅数据自持。

---

## 2. 技术架构

| 层级 | 技术选型 |
| :--- | :--- |
| **前端框架** | Nuxt 4 + Vue 3（SSR / SSG 混合） |
| **内容管理** | Nuxt Content（读取 Markdown） |
| **数据库** | Cloudflare D1（SQLite），用于动态数据（评论、订阅、统计、元数据） |
| **搜索** | D1 FTS5 全文搜索 |
| **部署 & 托管** | Cloudflare Pages（自动构建部署） |
| **对象存储** | Cloudflare R2（图片、备份） |
| **邮件服务** | Resend（订阅邮件、验证、Newsletter） |
| **自动化调度** | Cloudflare Workers + Cron Triggers |
| **版本控制** | Git (GitHub) |
| **图片处理** | `@napi-rs/canvas` 生成 OG 图片 |
| **移动端写稿** | Telegram Bot（通过 Workers 接收） |
| **监控与统计** | Umami（自建） + Cloudflare Web Analytics |

---

## 3. 数据模型（D1 SQLite）

### 3.1 文章表 (posts)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | INTEGER PK | 自增 |
| slug | TEXT UNIQUE | URL 标识 |
| title | TEXT | 文章标题 |
| content | TEXT | Markdown 正文 |
| excerpt | TEXT | 简短摘要 |
| date | DATE | 发布日期 |
| updated_at | DATETIME | 最后更新 |
| category | TEXT | 分类 |
| tags | TEXT (JSON) | 标签数组 |
| series | TEXT | 所属系列（可选） |
| series_order | INTEGER | 系列序号 |
| is_pinned | BOOLEAN | 是否置顶 |
| status | TEXT | draft / published / scheduled |
| scheduled_at | DATETIME | 定时发布时间 |
| author_id | INTEGER | 预留用户 ID |
| views | INTEGER | 阅读次数 |
| created_at | DATETIME | 创建时间 |
| content_path | TEXT | Markdown 文件路径 |

### 3.2 搜索表 (posts_fts) – FTS5 虚拟表
| 字段 | 类型 |
| :--- | :--- |
| slug | TEXT |
| title | TEXT |
| content | TEXT |
| excerpt | TEXT |
| tags | TEXT |

配套触发器自动同步 `posts` 表的增删改。

### 3.3 评论表 (comments)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | INTEGER PK | 自增 |
| post_slug | TEXT | 关联文章 slug |
| parent_id | INTEGER | 父评论 ID（支持嵌套） |
| author_name | TEXT | 昵称 |
| author_email | TEXT | 邮箱（用于头像） |
| author_url | TEXT | 个人网站（可选） |
| content | TEXT | 评论内容 |
| is_approved | BOOLEAN | 是否审核通过 |
| is_spam | BOOLEAN | 垃圾标记 |
| ip_address | TEXT | 来源 IP |
| user_agent | TEXT | 浏览器 UA |
| upvotes | INTEGER | 点赞数 |
| downvotes | INTEGER | 反对数 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 编辑时间 |

### 3.4 订阅者表 (subscribers)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | INTEGER PK | 自增 |
| email | TEXT UNIQUE | 邮箱 |
| name | TEXT | 可选姓名 |
| subscribed_at | DATETIME | 订阅时间 |
| status | TEXT | active / unsubscribed |
| source | TEXT | 订阅来源（blog / landing） |
| unsubscribed_at | DATETIME | 退订时间 |
| email_verified | BOOLEAN | 是否已验证 |
| verification_token | TEXT | 验证 token |
| last_sent_at | DATETIME | 上次接收邮件时间 |
| created_at | DATETIME | 记录创建时间 |

### 3.5 邮件发送日志表 (email_logs)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | INTEGER PK | 自增 |
| subscriber_id | INTEGER | 关联订阅者 |
| email_type | TEXT | welcome / newsletter / digest |
| sent_at | DATETIME | 发送时间 |
| status | TEXT | sent / opened / clicked |
| error | TEXT | 错误信息 |

### 3.6 用户表 (users) – 预留
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | INTEGER PK | 自增 |
| email | TEXT UNIQUE | 登录邮箱 |
| username | TEXT UNIQUE | 用户名 |
| display_name | TEXT | 显示名 |
| password_hash | TEXT | 加密密码 |
| role | TEXT | admin / editor / author |
| bio | TEXT | 个人简介 |
| avatar_url | TEXT | 头像 URL |
| created_at | DATETIME | 创建时间 |

> 当前仅单用户（管理员），预留多用户支持，但初期不做界面。

### 3.7 文章互动表 (post_actions) – 可选
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | INTEGER PK | 自增 |
| post_id | INTEGER | 文章 ID |
| action_type | TEXT | like / bookmark |
| user_id | INTEGER | 用户 ID（若登录） |
| session_id | TEXT | 匿名标识 |
| created_at | DATETIME | 操作时间 |

---

## 4. 功能详细需求

### 4.1 内容管理
- **创作方式**：在 `content/posts/` 目录下编写 Markdown 文件，支持 Frontmatter（YAML 格式）。
- **Frontmatter 字段**：title, excerpt, date, updated, category, tags, series, series_order, is_pinned, status, scheduled_at, cover, author。
- **草稿功能**：`status = draft` 的文章不对外公开。
- **定时发布**：`status = scheduled` 且到达 `scheduled_at` 后自动转为 published（通过脚本或构建时判断）。
- **系列文章**：相同 `series` 字段的文章自动归类，按 `series_order` 排序。
- **置顶**：`is_pinned = true` 的文章在首页优先显示。

### 4.2 文章展示
- **首页**：按时间（或置顶）显示文章列表，每篇显示标题、摘要、日期、分类、标签。
- **详情页**：完整展示文章内容，包含元数据、评论、订阅模块。
- **归档页**：按年份分组显示所有已发布文章标题和日期。
- **关于页**：静态页面，展示作者信息、项目介绍。
- **项目页**：展示独立项目列表（可静态配置）。

### 4.3 元数据同步机制
- **触发时机**：每次构建时（`build:done` 钩子）自动执行同步脚本。
- **同步动作**：扫描 `content/posts/` 下所有 `.md` 文件，解析 Frontmatter 和内容，更新 D1 的 `posts` 表（插入或更新）。
- **冲突处理**：以 Markdown 文件为准，覆盖 D1 中对应 slug 的记录。
- **FTS5 同步**：通过触发器自动更新 `posts_fts`。

### 4.4 全文搜索
- **技术**：D1 的 FTS5 扩展。
- **接口**：`GET /api/search?q={query}&page=1&limit=20`
- **返回**：匹配的文章列表（标题高亮、摘要片段高亮），并返回总数。
- **UI**：在页面顶部或侧边栏提供搜索框，结果跳转到独立搜索页或当前页异步显示。

### 4.5 自建评论系统
- **展示**：文章底部显示评论列表（树形嵌套回复）。
- **提交**：需填写昵称、邮箱（仅用于头像和通知）、内容。支持回复某条评论。
- **审核**：默认新评论状态 `is_approved = false`，管理员可在后台审核（可先只通过 Telegram 通知管理员，手动标记通过）。
- **反垃圾**：限制内容中链接数量（>3 条视为垃圾），可结合 Cloudflare Turnstile 人机验证。
- **API**：
  - `GET /api/comments/[slug]` – 获取评论（仅显示 approved）
  - `POST /api/comments` – 提交评论（存入待审核）
  - `PUT /api/comments/[id]` – 审核通过（仅管理员）

### 4.6 邮件订阅（Resend）
- **订阅表单**：在文章底部、侧边栏或弹出窗口提供邮箱输入框。
- **流程**：
  1. 用户输入邮箱，调用 `POST /api/subscribe`。
  2. 生成验证 token，存入 D1，并发送验证邮件（含确认链接）。
  3. 用户点击确认链接，调用 `GET /api/subscribe/verify?token=xxx` 更新状态为 verified。
  4. 后续可通过后台发送 Newsletter。
- **取消订阅**：每封邮件底部附退订链接（`GET /api/subscribe/unsubscribe?email=xxx`），更新状态为 unsubscribed。
- **Newsletter 发送**：后台触发 `POST /api/newsletter/send`（需管理员身份），读取所有 verified 且 active 的订阅者，通过 Resend 批量发送（限速 50 封/批）。
- **邮件模板**：使用 Resend 的 HTML 邮件，风格与像素博客一致。

### 4.7 自动分发到开发者社区
- **目标平台**：Dev.to、Hashnode、Medium（按优先级，前两者支持 `canonical_url` 保护原创）。
- **触发方式**：每次部署成功后，由 Cloudflare Worker 检查新文章（与上次发布记录对比）。
- **分发内容**：文章标题、正文（转换为目标平台格式）、标签。
- **SEO 保护**：设置 `canonical_url` 指向本站原文，避免重复内容惩罚。
- **手动补充**：Hacker News、Reddit 仅提供手动提交指导（不自动化）。

### 4.8 OG 图片生成
- **尺寸**：1200×630（标准 OG 尺寸）。
- **路由**：`/api/og/[slug].png`，动态生成，缓存 1 天。
- **设计**：像素风边框、装饰、标题自适应字号、摘要、日期、分类、站点标识。
- **预览工具**：提供独立 HTML 页面 `public/og-preview.html`，可实时调整参数预览并下载。
- **集成**：在文章详情页 `<head>` 中通过 `og:image` 引用该链接。

### 4.9 Telegram Bot 移动写稿
- **功能**：通过 Telegram Bot 发送文本消息，自动创建或更新草稿。
- **认证**：仅允许 `TELEGRAM_ALLOWED_CHAT_ID` 指定的用户。
- **指令**：
  - 直接发送文字 → 保存为草稿（标题取前 80 字）。
  - `/draft <标题> \n <内容>` → 自定义标题。
  - 发送图片 → 暂存到 R2，并生成图片链接草稿。
- **Webhook**：配置 Telegram 回调到 `/api/telegram/webhook`。

### 4.10 SEO 与站点地图
- **Sitemap**：自动生成 `sitemap.xml`（包含所有已发布文章链接），构建时生成。
- **robots.txt**：允许抓取所有内容，禁止 `/admin`、`/api` 路径。
- **Meta 标签**：文章详情页动态设置 title, description, og:title, og:description, og:image, og:url, twitter:card。
- **结构化数据**：在详情页注入 JSON-LD（Schema.org BlogPosting）。

### 4.11 RSS Feed
- **生成**：`/api/rss` 动态生成 RSS 2.0，包含最近 20 篇文章的标题、链接、发布日期、摘要。
- **自动更新**：每次构建后重新生成（因内容变化）。

### 4.12 访问统计
- **主要方案**：Cloudflare Web Analytics（免费，无需额外配置）。
- **自建补充**：Umami（开源，部署在 Cloudflare Pages 或 Workers），用于更细粒度的数据分析。
- **文章热度**：在 D1 中记录 `views` 字段，每次访问时累加（可去重 IP + UA）。

### 4.13 相关文章推荐
- **逻辑**：基于当前文章的标签，查询相同标签的其他文章（最多 5 篇），按时间排序。
- **实现**：在 `server/api/posts/[slug]/related.get.ts` 中通过 D1 查询 `tags` 字段（JSON 数组）匹配。

### 4.14 版本历史与备份
- **Git 版本控制**：所有 Markdown 内容已由 Git 管理。
- **数据库备份**：定期（通过 Worker 定时任务）导出 D1 数据到 R2，保存为 SQL 或 JSON。
- **图片备份**：上传到 R2 的图片自动备份。

### 4.15 后台管理界面（初期最小化）
- **后台入口**：`/admin` 路由（仅本地或管理员登录可访问）。
- **功能**：
  - 文章列表（显示所有文章，包括草稿），可编辑、删除。
  - 审核评论（通过/删除）。
  - 查看订阅者列表。
  - 发送 Newsletter（填写标题、正文、预览）。
- **认证**：使用 `ADMIN_SECRET` 环境变量（HTTP Basic Auth 或表单登录）。

---

## 5. 自动化部署与分发流水线

```
Git Push → Cloudflare Pages 构建
  ├── npm install
  ├── npm run build
  │   ├── 读取 content/posts/ 生成页面
  │   ├── 执行同步脚本 → 更新 D1 表（posts + FTS5）
  │   ├── 生成 sitemap.xml
  │   ├── 生成 RSS Feed
  │   └── 生成 OG 图片（预生成或按需）
  ├── 部署到 Pages 边缘节点
  └── 触发 Webhook → Cloudflare Worker
      ├── 检测新文章 → 分发到 Dev.to / Hashnode / Medium
      ├── 发送 Telegram 通知
      └── 触发 Newsletter 发送（如启用自动）
```

**定时任务（Cron）**：
- 每天检查失效链接（扫描所有文章外链，报告坏链）。
- 每周备份 D1 数据到 R2。

---

## 6. 环境变量清单

| 变量名 | 用途 | 必填 | 获取方式 |
| :--- | :--- | :--- | :--- |
| `RESEND_API_KEY` | Resend 邮件发送 | ✅ | Resend Dashboard |
| `NUXT_PUBLIC_SITE_URL` | 站点根 URL | ✅ | 自己的域名 |
| `DEV_TO_API_KEY` | Dev.to 发布 | ❌ | Dev.to 设置 |
| `HASHNODE_TOKEN` | Hashnode 发布 | ❌ | Hashnode 开发者设置 |
| `HASHNODE_PUBLICATION_ID` | Hashnode 发布 ID | ❌ | Hashnode 博客设置 |
| `MEDIUM_TOKEN` | Medium 发布 | ❌ | Medium OAuth |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token | ❌ | @BotFather |
| `TELEGRAM_ALLOWED_CHAT_ID` | 允许的 Chat ID | ❌ | 获取后填入 |
| `ADMIN_SECRET` | 后台登录密码 | ❌ | 自定义 |
| `R2_ACCESS_KEY_ID` | R2 访问密钥 | ❌ | Cloudflare R2 |
| `R2_SECRET_ACCESS_KEY` | R2 密钥 | ❌ | Cloudflare R2 |
| `R2_BUCKET_NAME` | R2 存储桶 | ❌ | Cloudflare R2 |

---

## 7. 非功能性需求

### 7.1 性能
- 首页加载 LCP < 2.5s（得益于 Nuxt + Cloudflare CDN）。
- OG 图片生成时间 < 500ms（缓存后 < 100ms）。
- 搜索响应时间 < 300ms（FTS5 索引）。

### 7.2 安全
- 评论提交需验证 IP 和速率限制（Cloudflare Rate Limiting）。
- 后台管理路径 `/admin` 需验证 `ADMIN_SECRET`。
- 所有敏感操作（如发送邮件）均在后端校验。

### 7.3 可维护性
- 代码使用 TypeScript，类型安全。
- 使用 ESLint + Prettier 统一风格。
- 所有 API 文档（JSDoc）。

### 7.4 成本
- Cloudflare 免费额度：Pages 免费 500 次构建/月，D1 免费 5GB 存储 + 500 万行读/月，R2 免费 10GB 存储。
- Resend 免费 3000 封/月。
- 总体月成本趋近于 0。

---

## 8. 开发阶段与优先级

| 阶段 | 任务 | 优先级 |
| :--- | :--- | :--- |
| **P0** | 基础框架（Nuxt 4 + Content + D1 配置） | 必须 |
| **P0** | 文章展示（首页、详情、归档） | 必须 |
| **P0** | 元数据同步（Markdown → D1） | 必须 |
| **P0** | FTS5 搜索功能 | 必须 |
| **P1** | 自建评论系统 | 必须 |
| **P1** | 邮件订阅（Resend） | 必须 |
| **P1** | OG 图片生成 | 必须 |
| **P1** | Sitemap / RSS / SEO Meta | 必须 |
| **P2** | 自动分发到 Dev.to / Hashnode | 重要 |
| **P2** | Telegram Bot 写稿 | 重要 |
| **P3** | Newsletter 发送（后台） | 可选 |
| **P3** | 阅读量统计 & 相关推荐 | 可选 |
| **P3** | 后台管理界面 | 可选 |
| **P3** | 自动备份 & 失效链接检查 | 可选 |

---

## 9. 附录

### 9.1 页面路由规划

| 路径 | 页面 | 说明 |
| :--- | :--- | :--- |
| `/` | 首页 | 文章列表 |
| `/[slug]` | 文章详情 | 动态路由 |
| `/archive` | 归档 | 按年分组 |
| `/about` | 关于 | 静态页 |
| `/projects` | 项目 | 静态页 |
| `/api/*` | API 路由 | 所有接口 |

### 9.2 设计参考
- 像素风格规范：颜色（`#0b0b12`, `#4ade80`, `#fbbf24`）、字体（Press Start 2P）、边框样式、装饰元素。
- 已有 HTML 模板作为 UI 基线，将转换为 Vue 组件。
