# 02 · 项目配置示例

三个不同类型项目的配置参考。

---

## 示例一：前端 Web 应用（Nuxt + Cloudflare）

```markdown
# .dev-log/config.md

project: repocheck
desc: 一个开源库测评平台，Nuxt 3 + Cloudflare Pages

tags: [nuxt, cloudflare, vue]

focus:
  - Cloudflare D1 / Workers / Pages 的限制
  - SSR 与 hydration 问题
  - 构建与部署失败
  - 性能数据变化（包体积、LCP）

ignore:
  - 内部业务逻辑
  - 密钥与配置
  - 未公开的 API 细节
```

**特点**：关注边缘运行时的限制和 SSR 问题，这类坑最容易被别人搜到。

---

## 示例二：CLI 工具 / npm 包

```markdown
# .dev-log/config.md

project: pkg-tool
desc: 一个给开发者用的命令行工具

tags: [node, cli, npm]

focus:
  - Node 版本兼容性问题
  - 打包与分发问题（bin、shebang、跨平台）
  - 原生依赖编译失败
  - 发布流程踩坑

ignore:
  - 用户项目内容
  - 私有 registry 配置
```

**特点**：CLI 的坑集中在兼容性和分发，跟 Web 完全不同。

---

## 示例三：小工具 / 个人项目（快速验证）

```markdown
# .dev-log/config.md

project: side-tool
desc: 一个周末小项目，验证某个想法

tags: [side-project, cloudflare]

focus:
  - 第三方 API 接入的坑
  - 成本相关（免费额度、账单变化）
  - 快速原型的取舍决策

ignore:
  - 无

settings:
  screenshot_daily_limit: 3
```

**特点**：小项目不追求全面，只记"有意思的坑"和"成本数据"，
提醒上限调低以免打断节奏。

---

## 配置写法的三个层次

### 极简版（够用）

```markdown
project: my-app
desc: 一个 Web 应用
tags: [nuxt]
```

### 标准版（推荐）

```markdown
project: my-app
desc: 一个 Web 应用
tags: [nuxt, cloudflare]
focus:
  - 部署问题
  - 性能
ignore:
  - 业务逻辑
```

### 完整版（有明确需求时）

加上 `settings` 覆盖默认参数。

---

## 常见错误

| 错误 | 说明 |
|---|---|
| 把全局规则复制进来 | 违反分层原则，后续改核心要同步 N 份 |
| tags 堆了 10 个 | 每条记录都会带，反而稀释了有效标签 |
| focus 写得太泛 | "所有 bug" 等于没写 |
| ignore 留空但项目有敏感内容 | 有泄露风险 |
| 每个项目都写 settings | 大部分用默认值就行，不用覆盖 |
