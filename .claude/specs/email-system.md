# PixelBlog 邮件系统 · 子产品说明书

> 版本：v1.0
> 归属项目：PixelBlog（kbmjj123.cc）
> 文档类型：子产品说明书（Sub-Product Spec）
> 最后更新：2026-07-03
> 关联 PRD：@.claude/docs/product.md

---

## 一、概述

### 1.1 定位

邮件系统是 PixelBlog 的基础服务模块，负责博客与读者之间的**订阅确认**与**内容推送**。

博客定位为独立开发者像素风格博客，单作者、小读者群。邮件系统设计遵循**轻量、按需、免费额度内运行**原则。

### 1.2 设计原则

- **最小化**：只做订阅确认 + 手动 Newsletter，不自动触发
- **免费优先**：全程在 Resend 免费额度（3,000 封/月）内运行
- **渐进开启**：第一期只上线订阅流程，Newsletter 发送依赖 Resend Dashboard

---

## 二、技术选型

| 维度 | 选型 |
|------|------|
| 邮件服务 | Resend（免费版 3,000 封/月，100 封/天） |
| 邮件模板 | React Email（JSX/TSX，可复用像素设计 token） |
| Newsletter 发送 | Resend Dashboard 手动操作，不开发后台发送功能 |
| 定时任务 | 不需要 |

---

## 三、数据表

### 3.1 订阅者表（subscribers）

PRD 已定义，保留 `source` 字段标记来源（`sidebar` / `post-bottom`），便于后续分析渠道效果。

```sql
CREATE TABLE IF NOT EXISTS subscribers (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  email             TEXT    NOT NULL UNIQUE,
  name              TEXT,
  status            TEXT    NOT NULL DEFAULT 'pending'
                      CHECK(status IN ('pending', 'active', 'unsubscribed')),
  source            TEXT    DEFAULT 'sidebar',
  verification_token TEXT   NOT NULL,
  subscribed_at     TEXT    DEFAULT (datetime('now')),
  verified_at       TEXT,
  unsubscribed_at   TEXT,
  last_sent_at      TEXT,
  created_at        TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);
CREATE INDEX idx_subscribers_token ON subscribers(verification_token);
```

### 3.2 邮件发送日志表（email_logs）

PRD 已定义，用于追踪发送记录和排查问题。

```sql
CREATE TABLE IF NOT EXISTS email_logs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  subscriber_id INTEGER REFERENCES subscribers(id),
  email_type    TEXT    NOT NULL CHECK(email_type IN ('verify', 'newsletter')),
  recipient     TEXT    NOT NULL,
  subject       TEXT    NOT NULL,
  status        TEXT    DEFAULT 'sent' CHECK(status IN ('sent', 'failed', 'bounced')),
  resend_id     TEXT,
  error         TEXT,
  created_at    TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX idx_email_logs_subscriber ON email_logs(subscriber_id);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);
CREATE INDEX idx_email_logs_created ON email_logs(created_at DESC);
```

---

## 四、订阅流程

```
┌─────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│ 填写邮箱 │ →  │ POST /api/  │ →  │ 发送验证邮件  │ →  │ 点击链接  │
│ (表单)   │     │ subscribe   │     │ (React Email)│     │ 验证确认  │
└─────────┘     └──────────────┘     └──────────────┘     └──────────┘
                                                              │
                                                              ↓
                                                       status=active
                                                       订阅完成
```

### 步骤详解

1. **用户提交邮箱**
   - 表单调用 `POST /api/subscribe`
   - 生成 `verification_token`（crypto.randomUUID）
   - 写入 D1 `subscribers`（status=`pending`）
   - 若邮箱已存在且 `active`，返回错误提示"已订阅"
   - 若邮箱已存在且 `pending`，重新发送验证邮件

2. **发送验证邮件**
   - 使用 React Email 模板
   - 邮件内容：验证链接 + 博客介绍 + 最近 3 篇文章标题/链接
   - 记录到 `email_logs`

3. **用户验证**
   - 点击链接 → `GET /api/subscribe/verify?token=xxx`
   - 更新 `status=active`，记录 `verified_at`
   - 返回确认页面/重定向

4. **退订**
   - 每封邮件底部附退订链接
   - `GET /api/subscribe/unsubscribe?token=xxx`
   - 更新 `status=unsubscribed`

---

## 五、API 路由

| 方法 | 路由 | 认证 | 说明 |
|------|------|------|------|
| POST | `/api/subscribe` | 无 | 提交订阅邮箱 |
| GET | `/api/subscribe/verify` | token 参数 | 验证确认 |
| GET | `/api/subscribe/unsubscribe` | token 参数 | 退订 |

### POST /api/subscribe

```typescript
// Request
{ email: string, name?: string, source?: string }

// Response 200
{ success: true, message: "验证邮件已发送" }

// Response 409
{ success: false, error: "该邮箱已订阅" }
```

### GET /api/subscribe/verify?token=xxx

```typescript
// Response 200
{ success: true, message: "订阅成功" }

// Response 400
{ success: false, error: "无效或已过期的验证链接" }
// → 重定向到订阅确认页，显示成功/失败状态
```

### GET /api/subscribe/unsubscribe?token=xxx

```typescript
// Response 200
{ success: true, message: "已退订" }
// → 重定向到退订确认页
```

---

## 六、邮件模板

使用 React Email，放在 `email-templates/` 目录下。

### 6.1 verify-email.tsx

验证邮件模板，包含：

- **标题**：确认订阅 KB MJJ123 .cc 博客
- **正文**：
  - 感谢订阅
  - 说明订阅内容（"你将收到不定期 Newsletter，汇总近期文章和独立开发动态"）
  - 确认按钮（链接到验证接口）
  - **最近 3 篇文章**（标题 + 日期 + 链接），展示订阅价值
- **底部**：博客信息 + 退订链接
- **设计**：像素风格，复用 CSS 设计 token

### 6.2 newsletter.tsx（可选）

Newsletter 通用模板，通过 Resend Dashboard 手动编辑发送，不使用此代码模板（仅做设计参考，不开发）。

---

## 七、订阅表单位置

### 7.1 侧边栏组件（同步上线）

在 `AppSidebar` 中新增订阅 widget：

```
┌─────────────────────┐
│ ▸ 订阅更新           │
│                     │
│ 输入邮箱，获取最新文章 │
│ ┌─────────────────┐ │
│ │ your@email.com  │ │
│ └─────────────────┘ │
│ [ 订阅 ]            │
│                     │
│ 不频繁 · 随时退订    │
└─────────────────────┘
```

- 像素风格，与 sidebar 现有 widget 一致
- 输入框 + 按钮，提交后显示成功/错误状态
- 使用 `.widget` 样式容器

### 7.2 文章底部表单（后续可加）

第一期以侧边栏为主。文章底部订阅表单作为 P3 可选，后期按需添加。

---

## 八、Resend Dashboard 使用约定

Newsletter 发送通过 Resend Dashboard 手动操作。

| 动作 | 操作方式 | 说明 |
|------|---------|------|
| 导出订阅者邮箱 | 查询 D1 `subscribers WHERE status='active'` | 从 D1 导出 CSV |
| 创建受众 | Resend Dashboard → Audiences → 导入 CSV | 首次创建 "kbmjj123.cc" 受众 |
| 发送邮件 | Resend Dashboard → Campaigns → 新建 | 使用自定义 HTML 或纯文本 |
| 查看统计 | Resend Dashboard → Analytics | 查看打开率、点击率 |

> 后期如果订阅者超 50 人，可考虑开发后台 Newsletter 发送功能（替代 Dashboard 手动操作）。当前阶段手动足够。

---

## 九、第一期上线清单

| 序号 | 事项 | 类型 |
|------|------|------|
| 1 | 创建 D1 表 `subscribers` + `email_logs` | Database |
| 2 | 安装 `resend` npm 包 + `react-email` | Deps |
| 3 | 添加 `RESEND_API_KEY` 到 Cloudflare 环境变量 | Config |
| 4 | 实现 `email-templates/verify-email.tsx` | Email |
| 5 | 实现 `server/utils/email.ts`（发送工具函数） | Utils |
| 6 | 实现 `POST /api/subscribe` | API |
| 7 | 实现 `GET /api/subscribe/verify` | API |
| 8 | 实现 `GET /api/subscribe/unsubscribe` | API |
| 9 | 在 `AppSidebar` 添加订阅 widget | UI |
| 10 | 验证全流程：提交 → 收邮件 → 确认 → 退订 | QA |

---

## 十、版本变更记录

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| v1.0 | 2026-07-03 | 初始版本，确定单渠道（Resend）、手动 Newsletter、不发欢迎邮件、React Email 模板 |
