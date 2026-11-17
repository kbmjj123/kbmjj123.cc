---
title: "BulkPicTools: Local-only batch image processing"
description: "Why image compression, conversion, cropping and resizing run entirely in the browser, the WebAssembly pipeline, and what privacy-first actually means in practice."
date: 2026-11-17
project: "BulkPicTools"
status: "ready"
value: "Privacy-first batch image processing in your browser — compress, convert, crop and resize locally, no upload required, with operations chained into a single pass."
screenshot: "/images/projects/bulkpictools/01.webp"
links:
  - label: "Live demo"
    url: "https://bulkpictools.com"
  - label: "GitHub"
    url: "https://github.com/kbmjj123/BulkPicTools"
  - label: "Bridge extension"
    url: "https://chromewebstore.google.com/detail/bulkpicbridge/hhkihajejdabchhejcaepccbifiheobc"
tags:
  - "#Vue"
  - "#PWA"
  - "#WebAssembly"
  - "#Canvas"
  - "#PrivacyFirst"
seo:
  title: "BulkPicTools — Privacy-first local image processing"
  description: "How BulkPicTools does compression, conversion and resizing fully in the browser, the WebAssembly pipeline, and the trade-offs of keeping files local."
  keywords:
    - "local image compression"
    - "browser image tools"
    - "privacy first image processing"
---

> **数据状态：** 本页结构已定稿，正文中的具体数字等待从项目 GitHub 仓库（README / CHANGELOG / Release / commit）提取真实数据后填写。标注 `[ 待填 ]` 的位置不要臆测；测量型数据须写明测试条件，无法复现则不写成结论。

## What it does

- 批量压缩、转换、裁剪与缩放图片
- 所有处理在本地浏览器完成，无需上传
- 多个操作可串成一次连续处理

## Why I built it

`[ 待填：来自仓库 README / commit 的真实问题与目标用户。例如：在线图片工具要求上传原图，隐私与速度都不理想。]`

## How it works

Vue + WebAssembly + Canvas 的客户端管线；文件不离开浏览器；配套 Bridge 扩展可把网页上的图片直接送入处理队列。

`[ 待填：具体架构、WASM 模块与隐私模型，以源码为准。]`

## Results

`[ 待填：以下指标从 GitHub 仓库真实数据填写，测量型须注明设备 / 浏览器 / 样本 / 工具 / 版本。]`

| 指标 | 数值 | 来源 |
| --- | --- | --- |
| 支持的操作 | `[ 待填 ]` | GitHub README |
| 客户端处理占比 | `[ 待填 ]` | 架构事实 |
| 压缩率 | `[ 待填 ]` | 实测（条件见下） |
| 单批图片上限 | `[ 待填 ]` | 源码 / 实测 |

## Technical decisions

- `[ 待填：为何坚持全客户端处理，以及放弃了什么。]`
- `[ 待填：WebAssembly 与 Canvas 的取舍。]`
- `[ 待填：下一步要改进什么。]`

## Related build logs

`[ 待填：链接到本站对应构建日志文章；发布后再填，不留空链。]`

## Try it

[Demo](https://bulkpictools.com) · [GitHub](https://github.com/kbmjj123/BulkPicTools) · [Bridge extension](https://chromewebstore.google.com/detail/bulkpicbridge/hhkihajejdabchhejcaepccbifiheobc)
