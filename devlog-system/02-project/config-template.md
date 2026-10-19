# 02 · 项目配置模板

> 每个项目一份，放在 `.dev-log/config.md`。
> **只做补充微调，绝不复制全局规则。**

---

## 最小模板（复制即用）

```markdown
# .dev-log/config.md

project: <项目名>
desc: <一句话说明这个项目在做什么>

tags: [<标签1>, <标签2>, <标签3>]

focus:
  - <这个项目特别值得记录的点>
  - <另一个点>

ignore:
  - <明确不记的内容>
```

---

## 字段说明

| 字段 | 必填 | 作用 | 优先级 |
|---|---|---|---|
| `project` | ✅ | 项目标识，草稿中标注来源 | — |
| `desc` | ✅ | 一句话背景，帮助判断相关性 | — |
| `tags` | ✅ | 自动附加到每条记录 | 追加（不覆盖全局） |
| `focus` | 可选 | 这个项目特别关注的方向 | 追加 |
| `ignore` | 可选 | 明确不记录的内容 | **最高，覆盖一切** |

---

## 合并逻辑

```
最终 tags   = 全局技术标签 + 项目 tags
最终 focus  = 全局五类信号 + 项目 focus
最终 ignore = 项目 ignore（优先级最高，命中即不记录）
```

**ignore 是唯一拥有"否决权"的字段。**

---

## 可选开关（第一版可不填）

```markdown
settings:
  screenshot_daily_limit: 5      # 每日截图提醒上限，默认 5
  screenshot_enabled: true       # 关闭则完全不提醒
  min_signals_to_aggregate: 3    # 聚合所需最少条目数，默认 3
```

这些是**覆盖**语义（不同于 tags/focus 的追加）。
不填则用全局默认值。

---

## 写 focus 的思路

问自己：**这个项目里，什么坑最值得写？**

- 用了什么不常见的技术/服务？
- 哪部分最容易出问题？
- 什么数据是你想长期追踪的（成本、性能）？

例：
```markdown
focus:
  - Cloudflare 相关的限制和坑
  - 部署/构建失败
  - 性能数据变化
```

---

## 写 ignore 的思路

问自己：**这个项目的什么内容不该公开？**

- 业务逻辑细节
- 密钥/配置相关
- 客户相关信息

例：
```markdown
ignore:
  - 内部业务逻辑细节
  - 密钥/配置相关
  - 客户名称
```

---

## 完整示例

```markdown
# .dev-log/config.md

project: repocheck
desc: 一个开源库测评平台，Nuxt 3 + Cloudflare

tags: [nuxt, cloudflare, vue]

focus:
  - Cloudflare D1 / Workers / Pages 的限制
  - SSR 与 hydration 问题
  - 构建与部署失败
  - 性能数据变化（体积、LCP）

ignore:
  - 内部业务逻辑
  - 密钥与配置
  - 未公开的 API 细节
```
