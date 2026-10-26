# 06 · WorkBuddy 环境设计

> 运行环境：**WorkBuddy**。这份文档定义目录、落点、资源索引。
> 配套的 `01-skill/core-rules.md` 描述的是"记录什么"，这份描述"东西放在哪、谁去读"。

---

## 一、落点总表

| 内容 | 位置 | 级别 | 说明 |
|---|---|---|---|
| `dev-log` skill | `~/.workbuddy/skills/dev-log/SKILL.md` | **用户级** | 采集端，所有项目共用 |
| `content-strategist` skill | `<本站>/.workbuddy/skills/` | 项目级 | 发布端，只服务本站 |
| `blog-post-producer` skill | `<本站>/.workbuddy/skills/` | 项目级 | 发布端，只服务本站 |
| 日志与截图数据 | `~/.dev-log/` | **用户级** | 全局汇聚，不随项目走 |
| 项目配置 | `<项目根>/.dev-log/config.md` | 项目级 | 唯一跟随项目的文件，可提交 git |

### 为什么这样分

- **采集端在用户级**：dev-log 要在多个项目里跑，放项目级只有本站能用。
- **发布端在项目级**：`blog-post-producer` 里硬编码了本站路径（`content/posts/`）和本站规则，放用户级会在别的项目里误触发。
- **数据不随项目走**：日志的消费者是博客，不是项目。项目归档/删除后素材必须还在。
- **配置随项目走**：`config.md` 是项目的一部分（描述这个项目记什么、不记什么），可以提交进 git。

---

## 二、全局数据目录

```
~/.dev-log/
├── projects/                        # 各项目采集区
│   ├── <project-name>/
│   │   ├── log.md                   # 日志（skill 写入，append-only）
│   │   ├── shots/                   # 截图（用户随手存）
│   │   └── outputs/                 # 自动捕获的终端输出
├── drafts/                          # 聚合生成的草稿，统一落这里
└── index.md                         # 项目清单，脚本自动维护
```

### 截图路径问题的解法：软链接

数据集中后，用户要存到 `~/.dev-log/projects/<project>/shots/`，路径变长。
而 `01-skill/screenshot.md` 明确说"随手截是最重要的一层，路径必须短到不能再短"。

**用软链接解决**——初始化脚本自动建：

```bash
<项目根>/.dev-log/shots  ->  ~/.dev-log/projects/<project>/shots
```

用户在项目里看到的仍是 `.dev-log/shots/`（短路径，与文档设计一致），
物理上写入全局。写路径短 + 物理集中，两者兼得。

### index.md 必须自动生成

原文档把"全局项目清单"标为可选、且手工维护。
**在本方案下它是必选项，且必须脚本生成**——凡是手工维护的东西都会断
（参考：`relatedPosts` 19 篇只填了 10 篇，GSC 三个月没拉）。

---

## 三、各项目需要做什么

每个接入 dev-log 的项目，只需两件事：

```bash
./init-devlog.sh <project-name>      # 建目录 + 软链接
# 然后编辑 .dev-log/config.md
```

```markdown
# .dev-log/config.md

project: <项目名>
desc: <一句话说明这个项目在做什么>        ← 会自动附加到每条日志
template_version: 1                   ← 记录基于哪个模板版本生成

tags: [<标签1>, <标签2>]
focus:
  - <这个项目特别值得记录的点>
ignore:
  - <明确不记的内容>
```

### config.md 是唯一需要手写的文件

日志、截图、草稿全部落在全局，项目里不留数据。
好处：项目可以随便归档、换机器、删掉，素材不受影响。

---

## 四、资源索引：skill 需要引用什么

### dev-log（采集端，用户级）

| 资源 | 路径 | 用途 |
|---|---|---|
| 项目配置 | `<项目根>/.dev-log/config.md` | 取 tags / focus / ignore / desc |
| 日志写入 | `~/.dev-log/projects/<project>/log.md` | 追加 |
| 项目清单 | `~/.dev-log/index.md` | 跨项目聚合时定位 |
| 记录格式 | 本目录 `01-skill/record-format.md` | 字段与标签规则 |
| 信号检测 | 本目录 `01-skill/signal-detection.md` | 什么值得记 |
| 脱敏规则 | 本目录 `01-skill/privacy-and-directory.md` | 写入前过滤 |

### blog-post-producer（发布端，项目级）

| 资源 | 路径 | 用途 |
|---|---|---|
| 日志汇聚 | `~/.dev-log/projects/*/log.md` | **新增**：Phase 0 前先读素材 |
| 文章原型 | 本目录 `07-article-archetypes.md` | **新增**：决定文章结构 |
| GSC 数据 | `content/.gsc-performance.json` | 已有 |
| 选题推荐 | `content/.content-ideas.json` | 已有 |
| 现有文章 | `content/posts/*.md` | 查重、找关联 |
| 设计基线 | `.claude/docs/*.html` | UI 真值 |

---

## 五、清洗：三个层次，做到第二层

写入前必须清洗（不是聚合时洗）。三个层次成本递增：

| 层次 | 做什么 | 产物 | 是否采用 |
|---|---|---|---|
| ① 脱敏 + 格式化 | 过滤密钥连接串、对齐记录格式 | 干净的原始日志 | ✅ 必须 |
| ② **补全上下文** | 附加项目背景，让单条日志自解释 | 可独立阅读的素材 | ✅ **必须（多项目场景）** |
| ③ 展开成可发布文本 | 扩写成段落 | L1 碎片 | ❌ 第一版不做 |

### 为什么必须做到 ②

单项目内，200 字的日志够用——三天后你还记得当时在做什么。

**跨项目就不成立了。** 在项目 A 记的"D1 事务不支持跨 HTTP 请求"，
两周后在博客项目里看到，你可能已经想不起项目 A 当时的场景。
**日志脱离原生语境就不自解释。**

规则：**把 `config.md` 的 `desc` 自动附加到每条日志**。
成本为零，改动只在模板里加一行。

### 为什么 ③ 第一版不做

`03-aggregation/l1-fragments.md` 第五节的模式 A（自动展开）会让每次回答
末尾都要产出成段文字，成本直接转嫁到编码时的等待感上。
维持模式 B（只列素材），等素材质量稳定了再说。

---

## 六、模板版本

模板分发到 N 个项目后会发生版本漂移：核心规则改了，各项目的 config 不同步。

- 模板文件头部记录 `template_version`
- 每个 `config.md` 记录它基于哪个版本生成
- 将来改核心时，能立刻知道哪些项目是旧版

---

## 七、初始化脚本

见 `scripts/init-devlog.sh`。用法：

```bash
cd <项目根>
~/.workbuddy/skills/dev-log/scripts/init-devlog.sh <project-name>
```

会做四件事：
1. 建 `~/.dev-log/projects/<project>/{log.md,shots/,outputs/}`
2. 建 `<项目根>/.dev-log/` 并从模板复制 `config.md`
3. 建截图软链接 `<项目根>/.dev-log/shots -> 全局目录`
4. 更新 `~/.dev-log/index.md`
