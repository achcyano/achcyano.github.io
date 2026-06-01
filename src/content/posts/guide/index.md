---
title: Fuwari 写作指南
published: 2024-04-01
description: "这篇文章整理了在本站发布文章时最常用的写法。"
image: "./cover.jpeg"
tags: ["Fuwari"]
category: Blog
draft: false
series: "Fuwari官方文档"
---

> 封面图片来源：[Source](https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg)

本站基于 [Astro](https://astro.build/) 和 Fuwari 模板搭建。日常写文章时，主要需要关心文章文件放在哪里、frontmatter 怎么写，以及图片和草稿如何处理。

## 文章放在哪里

所有文章都放在 `src/content/posts/` 目录下。可以直接放一个 Markdown 文件，也可以为一篇文章建一个单独文件夹，用来存放封面和正文中引用的图片。

```text
src/content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

推荐给图片较多的文章单独建文件夹，例如 `my-note/index.md` 搭配 `my-note/cover.png`、`my-note/example.png`。这样迁移文章时不容易丢资源。

## Frontmatter

每篇文章开头都需要一段 frontmatter，用 `---` 包起来。它决定文章标题、发布时间、封面、标签、分类等元信息。

```yaml
---
title: 我的第一篇文章
published: 2024-04-01
description: 这是一段会显示在文章列表里的简短介绍。
image: ./cover.jpg
tags: [Markdown, Fuwari]
category: Blog
draft: false
series: "Fuwari官方文档"
---
```

| 字段 | 作用 |
| --- | --- |
| `title` | 文章标题，会显示在文章页和文章列表中。 |
| `published` | 发布时间，推荐使用 `YYYY-MM-DD`。 |
| `updated` | 可选，更新时间。文章更新后可以加上这个字段。 |
| `description` | 文章简介，会显示在首页、归档或分享预览中。 |
| `image` | 文章封面。可以是网络图片、`public` 目录下的绝对路径，或相对当前 Markdown 文件的路径。 |
| `tags` | 标签列表，用来描述文章主题。 |
| `category` | 文章分类，通常写一个主分类即可。 |
| `draft` | 是否为草稿。设为 `true` 后不会在正式构建中显示。 |
| `series` | 可选，文章所属系列。相同系列的文章会被归到一起。 |

## 图片路径

`image` 和正文里的图片都支持几种写法。

```yaml
image: https://example.com/cover.jpg
image: /images/cover.jpg
image: ./cover.jpg
```

| 写法 | 含义 |
| --- | --- |
| `https://example.com/cover.jpg` | 使用网络图片。 |
| `/images/cover.jpg` | 使用 `public/images/cover.jpg`。 |
| `./cover.jpg` | 使用当前 Markdown 文件旁边的图片。 |

正文中引用本地图片时，也推荐使用相对路径。

```markdown
![示例图片](./example.png)
```

## 草稿

还没写完的文章可以把 `draft` 设为 `true`。

```yaml
draft: true
```

草稿不会出现在正式页面中，适合用来保存未完成的笔记。写完后改回 `false` 即可发布。

## 写作建议

标题层级从 `##` 开始写，正文里不要再写一个和文章标题重复的 `#`。

文章较长时，尽量使用清晰的小标题和短段落。代码示例、扩展组件、提示块等写法可以参考本系列的另外两篇文章：`Markdown 扩展用法` 和 `Expressive Code 用法`。
