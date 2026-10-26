# .dev-log/config.md

project: kbmjj123.cc
desc: 独立开发者的技术博客与工具站（Nuxt 4 + Cloudflare Workers/D1），内容来自真实搭建过程中的踩坑与数据
template_version: 1

tags: [nuxt, cloudflare, vue, indie-dev]

focus:
  - Cloudflare D1 / Workers / R2 的限制与配额坑
  - SSR / SSG / 预渲染三种部署模式的差异与坑
  - 构建与部署失败（尤其是本地能跑、上线挂掉）
  - 成本与性能数据变化（账单、LCP、构建体积）
  - GSC / 收录 / SEO 数据变化

ignore:
  - 订阅者邮箱与任何用户个人信息（D1 subscribers 表、Resend 相关）
  - .env / .dev.vars 内容与 API key（RESEND_API_KEY、AI_IMAGE_API_KEY）
  - .claude/credentials/ 下的任何内容
  - 未公开的产品与营收细节
  - 第三方客户或合作方名称

settings:
  screenshot_daily_limit: 5
  min_signals_to_aggregate: 3
