# DevLog System · 开发过程记录系统

> 一套挂在 CodeBuddy 全局规则里的 Skill，在编码过程中自动沉淀素材，
> 支撑「碎片发 X / dev.to，聚合成博客文章」的内容生产链路。

---

## 一、这套系统解决什么问题

| 问题 | 解决方式 |
|---|---|
| 写代码时没空记录踩坑 | Skill 在对话结束自动检测并提取 |
| 事后回忆写不出细节 | 记录发生在当下，附原始报错与截图 |
| 流水账日记没有检索价值 | L0 日志 → L1 碎片 → L2 文章，分层升级 |
| 多项目并行会串味 | 日志存项目内，项目级配置只做微调 |
| 截图太麻烦不想截 | 分级提醒 + 每日上限 + 时间戳自动关联 |

---

## 二、文档索引

| 目录 | 文档 | 说明 |
|---|---|---|
| **00-strategy** | [内容策略](./00-strategy/01-content-strategy.md) | 三层内容模型 L0/L1/L2、内容公式、选题方向 |
| | [博客到专区路线](./00-strategy/02-blog-to-directory.md) | 两阶段路线：先攒权重，后开 curated directory |
| | ⭐ [第一性原理](./00-strategy/03-first-principles.md) | 这类站点值不值得做、AI 抢不走什么 |
| | ⭐ [正反馈系统](./00-strategy/04-motivation-system.md) | 里程碑、小胜利日志、低谷怎么办 |
| **01-skill** | [全局核心规则](./01-skill/core-rules.md) | **核心**，可直接复制到 CodeBuddy 全局规则 |
| | [信号检测](./01-skill/signal-detection.md) | 什么值得记、什么不记 |
| | [记录格式](./01-skill/record-format.md) | 日志条目结构、标签体系 |
| | [截图机制](./01-skill/screenshot.md) | 提醒分级、上限、时间戳关联、孤儿回收 |
| | [隐私与目录](./01-skill/privacy-and-directory.md) | 脱敏规则、目录结构 |
| **02-project** | [配置模板](./02-project/config-template.md) | 每项目一个 override 文件 |
| | [配置示例](./02-project/example.md) | 三个不同类型项目的示例 |
| **03-aggregation** | [L1 碎片](./03-aggregation/l1-fragments.md) | 日志 → X / dev.to |
| | [L2 文章](./03-aggregation/l2-articles.md) | 日志聚合 → 博客文章 |
| **04-build** | [MVP 边界](./04-build/mvp-scope.md) | 第一版做什么、不做什么 |
| | 任务卡 | ⚠️ 已被 `08-upgrade-checklist.md` 取代（原为 CodeBuddy T1–T8） |
| **05-opensource** | [工具站开源化清单](./05-opensource/checklist.md) | 开源前清理、许可证、品牌保护、风险 |
| **06/07/08** | [环境设计](./06-environment.md) | WorkBuddy 环境：目录、skill 落点、资源索引 |
| | ⭐ [文章原型](./07-article-archetypes.md) | 四类结构，取代 01 第五节的固定公式 |
| | ⭐ [升级改造清单](./08-upgrade-checklist.md) | **从这里开始**，分阶段，带验收与止损 |

---

## 二点五、什么时候读哪份

| 状态 | 读哪份 |
|---|---|
| 想确认方向对不对 | `00-strategy/03-first-principles.md` |
| **没动力了 / 想放弃** | `00-strategy/04-motivation-system.md` 第二节 + 第五节 |
| 不知道写什么 | `00-strategy/01-content-strategy.md` |
| **想知道下一步做什么** | **`08-upgrade-checklist.md`** |
| 写新文章前决定结构 | `07-article-archetypes.md` |
| 要在新项目里接入 | `06-environment.md` |

---

## 三、快速开始（最短路径）

```bash
# 1. 把核心规则挂到 CodeBuddy 全局
cp 01-skill/core-rules.md  <你的 CodeBuddy 全局规则目录>/dev-log-core.md

# 2. 在每个项目里放一份配置
mkdir -p .dev-log/shots .dev-log/outputs .dev-log/drafts
cp 02-project/config-template.md .dev-log/config.md
# 编辑 config.md，填项目名、标签、focus、ignore

# 3. 正常写代码
#    Skill 自动记录，你只在它提醒时顺手截个图

# 4. 攒够了就生成
#    说一句"生成博客草稿"，得到 L2 初稿
```

---

## 四、核心设计原则

1. **全局核心只有一份** —— 项目配置只做补充微调，绝不复制完整规则
2. **零额外时间投入** —— 你正常编码，记录是副产品
3. **截图路径最短** —— 存到固定目录即可，不改名、不整理
4. **时间戳自动关联** —— 截完不用告诉 Agent，靠时间自动配对
5. **噪音可控** —— 提醒有分级、有上限、不重复
6. **素材先攒够再输出** —— 不在素材不足时强行凑文

---

## 五、已确定的决策（第一版）

| 决策项 | 结论 | 备注 |
|---|---|---|
| 日志存储位置 | **项目内** `.dev-log/` | 多项目并行不串味；跨项目聚合靠全局路径清单 |
| 配置文件名 | `.dev-log/config.md` | 如需放根目录可用 `DEVLOG.md`，二选一即可 |
| 分层方式 | 全局核心 + 项目 override | override 只补充，不覆盖核心逻辑 |
| 记录粒度 | 细粒度（一条问题 = 一条记录）+ 标签 | 便于按主题聚合 |
| 触发时机 | 每次回答结束自动检查 | 不做手动标记，保持零成本 |
| 截图提醒上限 | 每日 3–5 次 | 超出静默，只在日志留占位 |
| 时间关联窗口 | 5 分钟内自动配对 | 超出的列为孤儿素材待认领 |

> 以上为建议默认值。跑通一段时间后可调整，改动只发生在全局核心文件。
