# 首页改造设计（2026-11-15）

状态：设计已定稿，并已按此实现（2026-11-15）。

## 1. 目标与非目标

**目标**

1. 修复首页在移动端的视觉与横向溢出问题，覆盖 320–1150px。
2. 让 Projects 区块真实展示产品效果，而非只有 emoji 与文字。
3. 在首页展示作者本人照片，并与 `/about` 页、结构化数据保持一致。

**非目标**

- 不引入新的 UI 框架、CSS 框架、轮播库或图片优化服务（不装 Swiper / Embla / `@nuxt/image`）。
- 不制作或引入 GIF / 视频动效。
- 不改全站设计语言（配色、字体、pixel 风格保持不变）。
- 不重构与首页无关的博客、评论、后台等模块。
- 验证方式：实现阶段只做静态校验（lint、脚本语法、素材文件与引用校验），构建与真机多尺寸预览由用户在本地执行。

**已确认前提**：用户会提供全部项目截图与个人照片文件。代码仍须在素材未到位 / 加载失败时安全降级，用于开发期间的过渡与线上容错。

**范围补充（2026-11-15 追加）**：用户另追加 2 个浏览器插件与 1 个 Web 项目，首页项目总数由 5 变为 8；三者都并入现有 Projects 网格，不新增 section。详见 §4.7。

## 2. 现状与问题根因

| 证据 | 问题 |
| --- | --- |
| `pages/index.vue:150`、`:169`、`components/ProjectGrid.vue:128` | stats 4 列 / 文章 3 列 / 项目卡 2 列都只在 `480px` 才降为单列，481–860px 整段挤压 |
| `.claude/rules/design-system.md:70-74` | 规定只用 `860px` / `480px` 两个断点，不能靠新增断点硬解 |
| `layouts/default.vue:58` | `<main style="min-width:0;overflow:hidden">` 会裁掉轮播溢出、阴影与焦点框 |
| `layouts/default.vue:13-18` | 站点名 `white-space:nowrap` + `✦ Indie Log` 徽标，320–360px 横向溢出 |
| `layouts/default.vue:4-5` + `:208`、`:394`、`:401` | 双层内边距 20+24px，481–860px 段先吃掉 38px 可用宽度 |
| `pages/index.vue:7-9`、`:115` | hero 标题 24px 固定字号 + 硬 `<br/>`，窄屏断行不可控 |
| `components/ProjectGrid.vue:154`、`:191-192` | `min-height:230px` / `padding-right:70px` / `min-height:70px` 固定值，加图片后必然冲突 |
| `components/ProjectGrid.vue:70-121` | 项目数据硬编码在组件内，无图片字段 |
| `pages/index.vue:31`、`:42` | `5 projects` 与 `05 PROJECTS` 写死，与项目数据不同步 |
| `pages/about.vue:9-10`、`app.vue:44-52` | 作者头像是 emoji 占位，`definePerson` 无 `image` 字段 |
| `public/images/`、`package.json` | 首页没有任何 `<img>`；无项目截图、无肖像；已有 `photoswipe`、`Preview.vue`、`useImagePreview.ts` 可复用；无 GIF / 视频素材 |

## 3. 方案决策

### 3.1 Projects 视觉展示

| 方案 | 结论 |
| --- | --- |
| A. 单张静态截图 + 点击放大 | 不作为整体方案采用；作为单图项目的退化形态保留 |
| B. CSS `scroll-snap` 轮播 + 点击放大 | **采用** |
| C. GIF / 短视频循环 | 不采用：体积拖累 LCP（`.claude/docs/product.md:304` 要求 <2.5s）、无法暂停、与 `prefers-reduced-motion` 冲突、界面细节糊、制作成本高 |

采用 B 的理由：零新依赖；移动端由原生滚动提供手势，无需 JS 手势库；SSR 预渲染（`nuxt.config.ts:5` `/` prerender）友好；WebP 体积可控；大图直接用现成的 PhotoSwipe 画廊。

**分层策略**（控制素材成本）：featured 项目 BulkPicTools 放 2–3 张轮播；JSON Toolbox Extension 复用仓库已有的 3 张商店截图做轮播；其余项目（含 BulkPicBridge）各 1 张封面图。某个项目只有 1 张时，`ProjectMedia` 不渲染箭头与圆点，退化成「单图 + 点击放大」。

现有 `.pf-visual`（glyph + 网格渐变 + `pfScan` 扫描线）**保留其视觉样式**，作为无素材 / 图片加载失败时的降级占位，不删除。

### 3.2 个人照片位置

采用「Hero 右侧作者卡」：把现有 `.terminal` 升级为「照片 + whoami 终端」组合卡。理由是右栏原本是纯装饰终端卡，加入照片不打扰标题排版，且桌面 / 移动都有明确落点。其它候选（badge 旁小头像、独立 About 条）会挤压标题或增加页面长度，不采用。

### 3.3 自动播放

不做轮播自动播放。手动切换 + 点击放大已足够表达「效果」，自动播放会带来动效疲劳、无障碍问题与不必要的重绘。

## 4. 详细设计

### 4.1 响应式基线

- **列数不再依赖断点**：`.stats` / `.writing-grid` / `.pgrid` 统一改为 `repeat(auto-fit, minmax(min(100%, Xpx), 1fr))`，阈值分别为 `140px` / `300px` / `480px`。由此得到：320px 时 stats 2 列 × 2 行、文章 1 列、项目卡 1 列；768px 时 stats 4 列、文章 2 列、项目卡 1 列；1150px 时 stats 4 列、文章 3 列、项目卡 2 列（featured 始终 `grid-column: 1 / -1` 跨满行）。桌面布局保持原有列数，481–860px 中间带自然收窄，且遵守「只用两档断点」的约定。
- `860px` / `480px` 断点只负责字号、内距、显隐、命中区，不再负责列数。
- `layouts/default.vue:58`：把 `overflow:hidden` 换成 `overflow-x:clip`。`clip` 不建立滚动容器，不影响 sticky 与绝对定位；因为这是全站共用 layout，编码时需在 `/blog`、文章详情、`/about` 抽查无横向溢出。
- 内边距：860px 以下 `12px + 16px`，480px 以下 `8px + 8px`（原 481–860px 为 `20px + 18px`）。
- Header：860px 以下隐藏 `✦ Indie Log` 徽标；站点名改 `clamp(13px, 4.2vw, 20px)`；保留 `white-space:nowrap`，通过移除徽标与缩字号消除溢出源。
- Hero 标题去掉硬 `<br/>`，改 `max-width` 自然换行；pixel 字号用 `clamp(14px, 2.2vw, 24px)`。badge、按钮、标签同步使用 `clamp` 做流体缩放。
- `.pcard` 结构改为：顶部 flex 行（`.idx` + `.status`，二者不再绝对定位）→ `.pcard-media` 图片槽 → `.name` → `.desc` → `.tagrow` → `.linkrow`。删除 `padding-right:70px` 与 `.desc min-height:70px`，`.desc` 用 `flex:1` 让链接行底部对齐。
- `.pf-visual`：删除 `min-height:230px`，高度由内部 `ProjectMedia` 的 `aspect-ratio:16/10` 决定；无素材时 glyph 占位也用同一比例撑起。
- 860px 以下所有可点元素（CTA、`.linkrow a`、轮播箭头、圆点、图片触发器）命中区 ≥ 44×44px。

### 4.2 Projects 媒体层

**新增组件 `components/ProjectMedia.vue`**

- Props：`shots: ProjectShot[]`、`projectName: string`、`eager?: boolean`。
- 挂载位置：featured 卡的 `.pf-visual` 内；普通卡在新槽 `.pcard-media` 内。两处复用同一组件，只是 `eager` 与 `shots.length` 不同。
- 单张：渲染一个 `<picture>` + `<img>`，不渲染箭头与圆点，仍可点击放大。多张：外层 `overflow:hidden` 的 `scroll-snap-type:x mandatory` 轨道，每张 `scroll-snap-align:start`，容器 `aspect-ratio:16/10`，图片 `object-fit:cover; object-position:top`。
- 控件：每张图包在 `<button class="shot-trigger">` 内（保证 `Tab` 可聚焦、`Enter/Space` 可激活）；左右箭头按钮 + 圆点按钮 + `1 / 3` 计数器；点击后发出 `open` 事件，携带 `files: PreviewImage[]`（该项目全部 shots 按 `src / width / height / alt` 映射）与 `startIndex`（被点击图的序号）。
- 响应式图片：`srcMobile` **只在数据里显式声明时才输出 `<source media="(max-width: 859px)">`**，不做 `-m.webp` 自动推导，避免素材分批到位时指向 404 造成裂图（这点与 `ProseImg.vue:57-62` 的自动推导不同，是有意差异）。
- `ProjectShot.width` / `height` 填桌面原图真实像素（`1280` / `800`），供 PhotoSwipe 计算缩放，移动版尺寸不参与。
- 所有 `<img>` 显式 `width` / `height`，`decoding="async"`；featured 首图 `loading="eager" fetchpriority="high"`，其余 `loading="lazy"`。
- 加载失败：`onError` 记录失败的 src，把该图替换为 CSS glyph 占位；单图项目整槽回退，多图项目只回退失败的那一张。

**画廊复用**

在 `components/ProjectGrid.vue` 层维护一个 `activeGallery: { files, startIndex } | null`，所有 `ProjectMedia` 的 `open` 事件都写进它，父级只渲染**一个** `<ClientOnly><Preview :files="..." :start-index="..." @close="activeGallery = null" /></ClientOnly>`。理由：`Preview.vue:126-143` 每个实例自己 `useImagePreview()` 并挂载 PhotoSwipe，同时激活多个实例会冲突；`ProseImg.vue:69-79` 也是用模块级共享状态规避这一点。首页不用 `data-prose-img-src` 选择器收集图片，避免与文章图片画廊互相混入。

`PreviewImage` 类型直接复用 `composables/useImagePreview.ts:4-9`。

### 4.3 个人照片

**新增组件 `components/AuthorPhoto.vue`**

- 单一职责：渲染 `public/images/site/me.webp`；Props：`alt: string`、`size?: 'lg' | 'sm'`（`lg` = 120px、`sm` = 72px）。
- 像素风处理：`1.5px solid var(--accent-green)` 边框 + `3px` 硬阴影 + 极轻扫描线 `::after` 叠层；**不做重滤镜**，避免人像失真。所有颜色取 `main.css` 现有变量，不新增 token。
- 位置：`pages/index.vue` Hero 右侧，位于终端卡顶部、`.term-bar` 之上；与 `whoami` 文本共同构成作者卡。860px 以下用 `sm` 变体并与 badge 同行。
- 一致化：`pages/about.vue:9-10` 的 `🧑‍💻` 占位替换为同一组件；`app.vue` 的 `definePerson` 补 `image: 'https://kbmjj123.cc/images/site/me.webp'`。

### 4.4 数据与组件边界

新增 `data/projects.ts` 作为项目数据单一来源，导出：

```ts
export interface ProjectLink { label: string; url: string }
export interface ProjectArt { glyph: string; topLeft: string; bottomRight: string }

export interface ProjectShot {
  src: string
  srcMobile?: string
  alt: string
  width: number
  height: number
}

export interface Project {
  name: string
  desc: string
  tags: string[]
  links: ProjectLink[]
  status: 'live' | 'wip'
  featured?: boolean
  art?: ProjectArt
  shots?: ProjectShot[]
}
```

- `ProjectLink` / `ProjectArt` 从 `components/ProjectGrid.vue:57-58` 一并迁出，`ProjectGrid.vue` 只保留视图逻辑。
- `ProjectGrid.vue` 从 `data/projects.ts` 读取，删除组件内硬编码数组；`shots` 为可选字段。
- `pages/index.vue` 的 `5 projects`（`:31`）与 `05 PROJECTS`（`:42`）改为由 `projects.length` 派生（`pad(projects.length)`），当前应为 `8 projects` / `08 PROJECTS`。
- `ProjectMedia` 不直接依赖项目数据，只接收 `shots`，可独立测试；`ProjectGrid` 负责数据与画廊状态；`index.vue` 负责页面级布局。三者边界单一。
- 项目增至 8 个后，普通卡由 4 变 7；`ProjectGrid.vue:173-176` 的 `.delay-0` ~ `.delay-3` 需补齐 `.delay-4` / `.delay-5` / `.delay-6`，保持错峰入场动画不丢。

### 4.5 状态、无障碍、性能

| 项 | 设计 |
| --- | --- |
| 空状态 | `shots` 缺失或为空 → 渲染统一的 CSS glyph 占位（沿用 `.pf-visual` 的网格渐变 + glyph 样式），featured 与普通卡共用 |
| 加载失败 | `img` 的 `onError` 按图回退到同一占位，不留裂图 |
| 加载中 | `aspect-ratio` 容器 + 显式宽高防 CLS；无骨架屏（WebP 小图，骨架收益低） |
| 动效降级 | `prefers-reduced-motion:reduce` 关闭 `pixelFadeUp`、`pfScan`、`pixelBlink`、平滑滚动 |
| 键盘 | 焦点位于轮播容器内时 `←/→` 切图；箭头、圆点、图片触发器均可 `Tab` 聚焦；`Enter/Space` 打开画廊；PhotoSwipe 自带 `Esc` 与方向键 |
| 语义 | 轨道 `role="region" aria-roledescription="carousel" aria-label="Screenshots of <project>"`；每张 `role="group" aria-roledescription="slide" aria-label="1 of 3"`；圆点 `:aria-current`；计数器 `aria-live="polite"`；`aria-hidden` 只用于装饰角标 |
| 焦点 | `:focus-visible { outline: 2px solid var(--accent-gold); outline-offset: 2px }` |
| 对比度 | 交互文字用 `--accent-green` / `--accent-gold`；`--text-muted` 仅用于装饰与角标，不承载关键信息 |
| 性能 | featured 首图 eager + `fetchpriority="high"`，其余 lazy；桌面图 <150KB、移动图 <60KB；LCP < 2.5s |
| SEO | `ProjectGrid.vue` 卡片在 `shots.length > 0` 时输出 `<meta itemprop="screenshot" :content="...">`，值为 `https://kbmjj123.cc` 拼接 `shots[0].src`；`app.vue` 的 `definePerson` 补 `image` |

### 4.6 素材交付规范

用户按以下路径与规格提供文件（`public/` 为根）：

| 路径 | 用途 | 尺寸 | 体积上限 |
| --- | --- | --- | --- |
| `images/site/me.webp` | 作者照片，正方形、主体居中、顶部留余量 | 320×320 | 60KB |
| `images/projects/bulkpictools/01.webp` | featured 主界面 | 1280×800 | 150KB |
| `images/projects/bulkpictools/02.webp` | featured 第二屏（批量处理 / 结果） | 1280×800 | 150KB |
| `images/projects/bulkpictools/03.webp` | featured 第三屏（可选） | 1280×800 | 150KB |
| `images/projects/aifindr-org/01.webp` | 封面 | 1280×800 | 150KB |
| `images/projects/umami-serve/01.webp` | 封面 | 1280×800 | 150KB |
| `images/projects/json-toolbox/01.webp` | 封面 | 1280×800 | 150KB |
| `images/projects/kbmjj123-cc/01.webp` | 封面 | 1280×800 | 150KB |
| `images/projects/json-toolbox-extension/01.webp` ~ `03.webp` | 插件轮播，来自仓库现成商店截图 | 1280×800 | 各 150KB |
| `images/projects/bulkpic-bridge/01.webp` | 悬浮按钮 / 一键送图场景，可用商店截图 | 1280×800 | 150KB |
| `images/projects/my9tools/01.webp` | 九宫格编辑器 / 成品页封面 | 1280×800 | 150KB |

移动版为**同比例低分辨率版**（640×400，<60KB），命名 `01-m.webp` 等，**不做裁切**，这样容器 `aspect-ratio:16/10` 在桌面与移动一致、无布局跳动。移动版可选：未提供时不写 `srcMobile`，组件不输出 `<source>`。

最小可上线集合为 **9 个文件**（8 个项目各 1 张截图 + 1 张照片）；按 §4.7 让 JSON 插件放 3 张轮播则为 **11 个文件**。完整集合为 **25 个文件**（12 张桌面图 + 12 张同名移动版 + 1 张照片）。每张截图在数据里配一句具体 `alt`（如 `BulkPicTools batch compress results panel`），不用 `screenshot`、`image` 这类空泛描述。

### 4.7 补充项目与浏览器插件（2026-11-15 追加）

用户追加 3 个项目：2 个浏览器插件 + 1 个 Web 项目。前两项给了 GitHub 链接，BulkPicBridge 给了本地目录 `/Users/zhenggl/Desktop/personal_upgrade/bulkpic/BulkPicBridge`。三者在本机均有完整源码，字段一律按源码 / 上架清单取值。项目总数 5 → 8，普通卡 4 → 7。

**组织方式（前提变更后重评）**：插件由 1 个增至 2 个，仍决定并入现有 Projects 网格，不新增 section、不引入 `kind` 分组字段。理由是两个插件各自是某个主站的配套扩展（`BulkPicBridge` ↔ `BulkPicTools`、`JSON Toolbox Extension` ↔ `JSON Toolbox`），让插件**紧跟对应主站**比按类型分组更有信息量；8 张卡单网格仍可承受；单独分组需新增 section、排序逻辑与筛选状态，属于不必要复杂度。区分靠 `#ChromeExtension` 标签与展示名后缀。

**排序**：`data/projects.ts` 的数组顺序即展示顺序。featured BulkPicTools 置顶，其后紧跟 `🌉 BulkPicBridge`；`🧰 JSON Toolbox` 后紧跟 `🧩 JSON Toolbox Extension`；`▦ My9Tools` 放在其余网站项目之后。`.idx` 编号由顺序自动派生。

**命名冲突**：现有 `🧰 JSON Toolbox` 是网站 `jsontoolbox.cc`，而插件官方名（`public/_locales/en/messages.json` 的 `extName`）同样是 `JSON Toolbox`。为避免首页出现两张同名卡，插件展示名定为 `🧩 JSON Toolbox Extension`，描述首句点明配套关系。

**写入 `data/projects.ts` 的数据**：

| 字段 | JSON Toolbox Extension | BulkPicBridge | My9Tools |
| --- | --- | --- | --- |
| name | `🧩 JSON Toolbox Extension` | `🌉 BulkPicBridge` | `▦ My9Tools` |
| desc | `Companion browser extension for jsontoolbox.cc. Auto-beautifies raw JSON pages into a searchable, editable tree and split editor — all locally, no account, no tracking. Chrome / Edge Manifest V3, built with WXT + Vue 3.` | `Companion browser extension for BulkPicTools. Hover any image on the web and send it straight to bulkpictools.com for compression, resizing or watermarking — no saving and re-uploading. Works on Midjourney, Doubao, Unsplash and more.` | `Pick nine tools and sites you love, export a 1500×1500 shareable image, or publish it as an updatable public toolbox page. Nuxt 4 + Cloudflare D1/KV/R2, with a curated tool directory and an explore feed.` |
| tags | `#ChromeExtension` `#MV3` `#WXT` `#Vue` `#PrivacyFirst` | `#ChromeExtension` `#MV3` `#WXT` `#Vue` `#BulkPicTools` | `#Nuxt` `#Cloudflare` `#D1` `#Canvas` `#Vue` |
| links | `Chrome Web Store → https://chromewebstore.google.com/detail/json-toolbox/iifmieidldhenocaekobhhinbhojlfoi`、`Website → https://jsontoolbox.cc`、`GitHub → https://github.com/kbmjj123/json-browser-plugins` | `Chrome Web Store → https://chromewebstore.google.com/detail/bulkpicbridge/hhkihajejdabchhejcaepccbifiheobc`、`Website → https://bulkpictools.com` | `Website → https://my9tools.app`、`GitHub → https://github.com/kbmjj123/my9tools-app` |
| status | `live`（用户确认已上架） | `live`（商店已上架） | `live`（正式域名已启用） |
| featured | 否 | 否 | 否 |
| shots | 3 张 | 1 张 | 1 张 |

依据：JSON 插件仓库 `README.md` / `package.json` / `wxt.config.ts` / `_locales/en/messages.json`；BulkPicBridge `README.md` / `CLAUDE.md` / `package.json` / `wxt.config.ts` / `BulkPicBridge浏览器插件资源/BulkPicBridge_Store_Listing.md`，商店 URL 来自 `zhihu/answers/` 中已解码的链接；My9Tools `README.md` / `nuxt.config.ts:19-22` / `wrangler.toml:33`。

**现成素材可复用**：

- JSON 插件仓库 `store-assets/` 已有 5 张 `1280×800` 英文商店截图（`screenshot-01-auto-beautify.png` ~ `05-lightbox.png`），与本设计规格完全一致。取 01 / 02 / 03 转 WebP 放进 `public/images/projects/json-toolbox-extension/`，无需重新截图；`store-assets/zh/` 中文版与 promo / marquee 图不使用。
- BulkPicBridge 本地目录只有 16–128px 图标 PNG 与上架清单文档，没有 `1280×800` 截图；但它已上架 Chrome Web Store，商店页必有符合规格的截图，取 1 张即可。`BulkPicBridge_Store_Listing.md:236-248` 列了 5 个截图场景（Midjourney 悬浮图标、豆包跳转、Unsplash、自动预加载、流程对比），可作选图参考。
- My9Tools `public/og/` 只有 OG 营销图与 logo，需补一张 `1280×800` 的编辑器或九宫格成品图。
- 项目已有 `sharp@0.35.2`，PNG → WebP 转换可一次性完成。

**采用的默认值**（用户可直接改）：

1. 两个插件都是 `live`；JSON 插件展示名带 `Extension` 后缀以区分同名网站。
2. 不新增 `kind` 分组字段；插件紧跟对应主站排序。
3. BulkPicBridge 不放 GitHub 链接（用户只给了本地目录，不臆测仓库 URL）；JSON 插件的 `Chrome Web Store` 链接由用户提供（`https://chromewebstore.google.com/detail/json-toolbox/iifmieidldhenocaekobhhinbhojlfoi`），与 Website / GitHub 一并保留，商店链接排在首位。
4. 两个插件都只放 Chrome Web Store 链接，不放 Edge Add-ons / Firefox Add-ons（本地无依据）。

## 5. 实施顺序

1. 响应式基线：`layouts/default.vue`、`pages/index.vue`、`components/ProjectGrid.vue` 的网格 / 内距 / 字号 / `overflow-x:clip`。
2. `data/projects.ts`（含 §4.7 三条新项目）+ 计数派生，保证无素材时页面与现状一致。
3. `ProjectMedia.vue` + `ProjectGrid.vue` 画廊状态接入；素材准备：从 `json/json-browser-plugins/store-assets/` 复制 01/02/03 三张 PNG 转 WebP 落到 `public/images/projects/json-toolbox-extension/`，BulkPicBridge 从商店页取 1 张落到 `public/images/projects/bulkpic-bridge/`，My9Tools 截图与作者照片待用户补；素材未到位时用占位验证降级路径。
4. `AuthorPhoto.vue` + `pages/about.vue` + `app.vue` 的 `definePerson`。
5. 静态校验：lint、`node --check`、素材文件存在性与格式 / 体积、引用路径无死链；320/375/390/768/1024/1150 六档人工检查。构建由用户本地执行。

## 6. 验收标准

- 320 / 375 / 390 / 768 / 1024 / 1150 六档下 `document.documentElement.scrollWidth <= innerWidth`，无横向滚动条、无内容裁切。
- 触控目标 ≥ 44×44px；纯键盘可完成轮播切换与画廊开关；焦点态清晰可见。
- 删除任一图片文件后页面不塌、不裂图、不报错，回退到 CSS 占位。
- 项目数量三处（终端卡、stats、卡片列表）始终一致，当前为 8。
- 首页 LCP < 2.5s；新增图片不引入 CLS。
- 配色、字体、动效时长遵循 `CLAUDE.md:80-91` 与 `.claude/rules/design-system.md`。

## 7. 风险与缓解

| 风险 | 缓解 |
| --- | --- |
| `layouts/default.vue` 是全站共用，改 `overflow` 可能影响其它页面 | 用 `overflow-x:clip`（不建立滚动容器），并在编码时抽查 `/blog`、文章详情、`/about` |
| `CLAUDE.md:57` 要求匹配 `.claude/docs/*.html`，但该目录实际只有 `product.md` | 以现有 pixel 视觉与 `design-system.md` token 为准，不引入新配色 / 字体 |
| 多实例 PhotoSwipe 冲突 | 由 `ProjectGrid` 单一 `activeGallery` 渲染一个 `Preview` |
| 素材分批到位导致 `<source>` 404 | `srcMobile` 显式声明才输出 `<source>`，并提供 `onError` 回退 |
| 普通卡加图后高度不齐 | 媒体槽统一 `aspect-ratio:16/10`，`.desc` 用 `flex:1` 让链接行底部对齐 |
| 两个 JSON Toolbox 同名易混淆 | 插件展示名加 `Extension` 后缀，描述首句点明配套关系，链接区分 Website / GitHub |
| 项目由 5 增至 8，首页可能过长 | 保持 2 列网格、图片统一 16:10、`.desc` 用 `flex:1` 底部对齐；暂不引入折叠 / 筛选（YAGNI），实测过长再评估 |
| pixel 字体配合 `clamp` 在极窄屏过密 | 480px 以下保持 `line-height:1.75`、`letter-spacing` 不压缩，必要时隐藏 badge 副文案 |

## 8. 后续变更记录（2026-11-15 当日追加）

以下变更发生在设计定稿之后；前文 §1 / §4.4 / §4.6 / §4.7 / §6 / §7 中的数量描述以本节为准。

- 新增项目 `📄 MinoPDF`（`https://minopdf.com`、`https://github.com/kbmjj123/minopdf`），排在 My9Tools 之后、`kbmjj123.cc` 之前。项目总数 8 → **9**，普通卡 7 → **8**，桌面截图 12 → **13**（新增 `public/images/projects/minopdf/01.webp`，由线上首页截图转换），`.delay-7` 已补齐。首页计数由 `projects.length` 派生，自动显示 `09 PROJECTS`。
- 素材状态：13/13 截图与 `public/images/site/me.webp` 全部就位。照片为圆形裁切，`AuthorPhoto.vue` 改为圆形描边（透明底 + `border-radius: 50%`）。
- 卡片入场动画改为默认可见的位移效果（`cardRise`），移除 `opacity: 0` 起步，保证 9 个项目从首帧起全部展示。
- 仅对首页收紧顶部 / 底部间距（`grid margin 40→16`、`hero margin 36→0`、footer 与容器留白减半）。
- 新增 `data/social.ts` 作为 6 个社交档案的单一来源，供 footer、`/about` 与 `Person.sameAs` 共用。
- Hero 改为纯个人档案导向（Display Name / Job Title / 社交通用版 Bio / Tech Stack / Location / Website），移除首页 `PostList` 与 Latest Writing 区块，替换为 `About Me` 区块（英文 About Me 全文 + Location / Website / Tech Stack / Topics 事实卡 + 6 个社交档案 + `Read the Blog` 入口）。首页 SEO description 同步为新人设；中文版简介因全站英文单语未使用。
- 12 张项目截图的最终来源：BulkPicTools 三张来自 `localbatch.net/public/promo/`，My9Tools 来自 `public/og/work.png`，JSON Toolbox 来自其博客编辑器截图，umami-serve 为 `umami.bulkpictools.com` 已登录状态下的统计页，BulkPicBridge 为 Chrome Web Store 官方 1280×800 截图，aifindr.org / kbmjj123.cc / MinoPDF / JSON 插件为浏览器或商店截图。
