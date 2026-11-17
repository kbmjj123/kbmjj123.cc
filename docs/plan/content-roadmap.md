# Content Roadmap — Author & Case Study Center

> 本文档是**方向性规划**，不是一次性文章清单。它定义"写什么、为什么写、怎么写、怎么验证"的框架；具体文章按此框架逐篇产出。
>
> **独立性**：本规划不依托、不引用站内任何已有文章。所有选题均为全新候选，成文前需按本文规则核实数据与素材。
>
> 站点定位：**Indie developer building privacy-first, browser-based developer tools. I share the products, open-source components, technical decisions, and real performance data behind them.**

---

## 1. 内容层级模型

三层内容构成"作者与案例中心"，每篇内容都必须能归入其中并回链到上层：

```
L1 作者可信度层   /about, /now        —— 你是谁、专注什么、怎么联系
        ▲
        │ 回链
L2 项目案例层     /projects/<slug>    —— 每个项目一个可引用、可索引的落地页
        ▲
        │ 回链（relatedProject）
L3 构建日志层     /<post-slug>        —— 每篇讲一个真实问题与解决过程
        │
        └──▶ 外部证据：GitHub / Release / Demo / npm / Docs
```

规则：
- 每篇 L3 文章必须回链到它的 L2 案例页（frontmatter 加 `relatedProject: <slug>`）
- 每个 L2 案例页的 `Related build logs` 区块必须链接到对应 L3 文章（发布后才填，不留空链）
- 每条结论都要能顺着 L3 → GitHub/Demo 追溯到一手证据

---

## 2. 项目内容簇（三大支柱）

每个项目是一个独立内容簇。下表定义**写作方向**与**候选选题池**——候选只是方向，不是已确定的文章；成文前必须按第 4、5 节核实。

### 2.1 JSON Toolbox — 浏览器端 JSON 工具集

- **案例页**：`/projects/json-toolbox`
- **定位**：privacy-first、全客户端、31 个工具、大文件查看器
- **仓库**：`github.com/kbmjj123/jsontoolbox.cc`

| 候选选题（英文工作标题） | 核心问题 | 主要数据流 |
|---|---|---|
| How I made a large JSON file viewable in the browser | 大文件渲染卡死主线程 | 实测 + commit |
| What I learned shipping 31 JSON tools | 31 个工具如何组织、共享核心 | README / 源码 |
| Building an embeddable JSON viewer | iframe 嵌入 / 自托管 | 源码 / 文档 |
| How I handle malformed JSON and edge cases | 容错解析、错误定位 | commit / 测试用例 |
| How I measure performance before shipping a browser tool | 性能测量方法与门槛 | 实测 + 工具 |

### 2.2 BulkPicTools — 本地批量图片处理

- **案例页**：`/projects/bulkpictools`
- **定位**：privacy-first、客户端处理、WebAssembly + Canvas、操作链
- **仓库**：`github.com/kbmjj123/BulkPicTools`

| 候选选题（英文工作标题） | 核心问题 | 主要数据流 |
|---|---|---|
| Why I keep image processing fully client-side | 隐私模型、放弃服务端方案的取舍 | README / commit |
| The WebAssembly pipeline behind local image compression | WASM + Canvas 管线架构 | 源码 / 实测 |
| How I chained multiple image operations into one pass | 操作链设计与状态管理 | 源码 |
| Measuring compression ratio without uploading a single byte | 压缩率实测方法 | 实测 |
| Building a companion extension that sends any web image to the tool | Bridge 扩展的工作流 | 源码 / 商店页 |

### 2.3 aifindr — 开源 AI 工具目录

- **案例页**：`/projects/aifindr`
- **定位**：开源目录、500+ 工具、12 分类、社区提交
- **仓库**：`github.com/kbmjj123/aifindr.org`

| 候选选题（英文工作标题） | 核心问题 | 主要数据流 |
|---|---|---|
| Building an open-source AI tool directory with Nuxt and D1 | 数据驱动目录的架构 | README / 源码 |
| How I curate hundreds of AI tools without burning out | 目录质量与筛选流程 | Issues / PR |
| Designing a submission flow that keeps a directory clean | 提交与审核工作流 | 源码 / Issues |
| Why this directory is open source | 开源决策与取舍 | README / commit |

### 2.4 独立开发（贯穿性内容）

不定为项目簇，作为作者层（L1）的补充：产品发布、增长实验、开源运营、构建日志的幕后。每篇仍须回链到相关项目或 `/about`。

---

## 3. 构建日志标准模板（每篇必用）

方向文档定义的 6 段式，所有 L3 文章按此结构：

```markdown
# [具体技术问题，不用泛泛的"XX 教程"]

## The problem
[什么坏了、影响了谁、为什么重要。用真实场景。]

## What I tried
- [方案 A + 结果/失败原因]
- [方案 B + 取舍]

## What worked
[最终方案：代码、架构图、关键决策。]

## Results
[真实数字 + 测试条件 + 限制。没有可复现数字就写定性结论。]

## Try it
[Demo] [GitHub] [npm] [Release] —— 只放真实存在的链接。

## What's next
[具体 roadmap 项，让读者看到项目仍在演进。]
```

写作纪律：
- 标题必须具体到"一个问题"，避免"10 个技巧""5 个工具推荐"这类泛泛内容
- `The problem` 和 `What I tried` 是差异化核心——只有作者本人能写
- `Results` 不写无法复现的数字（见第 5 节）
- 每篇发布后，回填到对应案例页的 `Related build logs`

---

## 4. 数据真实性规则（Google E-E-A-T）

"真实数据"是区别于泛泛 AI 内容的关键。所有数据分两类处理：

**事实型数据** — 可直接取自 GitHub 仓库并标注来源与日期：
- 功能数量、技术栈、发布时间、Star / Issue 数、开源协议、功能列表
- 写法示例：`31 tools shipped (source: README, 2026-11-17)`

**测量型数据** — 必须写明可复现条件，否则不写成结论：
- 渲染时间、内存占用、包体积、压缩率、Lighthouse 分数
- 必须说明：设备、浏览器版本、样本文件/数据、测量工具、代码版本
- 写法示例：`First paint 1.8s — Chrome 140, 100 MB sample, 2026 MacBook Pro, local benchmark, v1.2.0`

**占位规则**：
- 数据未到位时写 `[ To fill ]` 或 `[ To measure ]`，绝不臆测具体数字
- 案例页正文的占位标记，成文时逐一替换或删除

---

## 5. 产出流程（从规划到发布）

每篇文章按以下流程推进，**每步都可单独评审**：

```
1. 选题确认     从 §2 候选池选一个，确认核心问题与数据流
2. 数据核实     按 §4 从 GitHub / 实测取真实数据，列出来源
3. 大纲评审     按 §3 模板写 6 段大纲，交作者确认
4. 正文写作     确认后写完整正文（英文）
5. 关联回填     frontmatter 加 relatedProject；案例页 Related build logs 回填链接
6. 结构化数据    BlogPosting + author.url → /about；GitHub Release 加 "Read the build log"
7. 发布与收录   sitemap / RSS 自动更新，提交推送
```

每篇的验收清单：
- [ ] 标题具体到单一问题
- [ ] 6 段结构完整
- [ ] 事实型数据有来源与日期
- [ ] 测量型数据有条件，无法复现的已改为定性
- [ ] 无 `[ To fill ]` 残留
- [ ] 回链案例页、Demo、GitHub 均为真实链接
- [ ] 英文单语

---

## 6. 节奏说明（方向，不排期）

- 不预设"每周几篇"的硬指标——每篇以数据核实完成为启动前提
- 建议首批每个项目各出 1 篇核心构建日志（见 §2.1 / §2.2 / §2.3 表格首行），验证方向后再扩展
- 候选池持续补充：新的真实问题出现时追加到对应项目簇，不必一次性写满

---

## 7. 本规划与站点的关系

- 本文件是**内部规划文档**，不参与站点构建，不影响 SEO 与预渲染
- 所有文章最终落在 `content/posts/*.md`，沿用现有 frontmatter 约定，并新增 `relatedProject` 字段
- 案例页在 `content/projects/*.md`，案例页与文章的双向链接按 §1 规则维护
