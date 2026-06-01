---
title: Markdown 扩展用法
published: 2024-05-01
updated: 2024-11-29
description: "整理本站支持的 Markdown 扩展语法。"
image: ""
tags: [Markdown, Fuwari]
category: "Blog"
draft: false
series: "Fuwari官方文档"
---

除了标准 Markdown，本站还支持一些更适合博客写作的扩展语法，例如 GitHub 仓库卡片、Bilibili 视频、提示块和折叠文本。

## GitHub 仓库卡片

使用 `::github` 可以插入一个 GitHub 仓库卡片。页面加载时会从 GitHub API 读取仓库信息。

::github{repo="Fabrizz/MMM-OnSpotify"}

写法如下：

```markdown
::github{repo="saicaca/fuwari"}
```

`repo` 的格式是 `<owner>/<repo>`，例如 `saicaca/fuwari`。

## Bilibili 视频

使用 `::bilibili` 可以插入一个响应式 Bilibili 播放器。

最常用的是 BV 号写法：

```markdown
::bilibili{bvid="BV1xx411c7mD"}
```

如果只有 AV 号和 `cid`，也可以这样写：

```markdown
::bilibili{aid="123456" cid="654321"}
```

多 P 视频可以指定 `page`，也可以使用别名 `p`。

```markdown
::bilibili{bvid="BV1xx411c7mD" page="2"}
::bilibili{bvid="BV1xx411c7mD" p="2"}
```

还可以设置播放器标题、是否自动播放、是否开启弹幕。

```markdown
::bilibili{bvid="BV1xx411c7mD" title="视频标题" autoplay="0" danmaku="0"}
```

| 参数 | 说明 |
| --- | --- |
| `bvid` | Bilibili BV 号，例如 `BV1xx411c7mD`。 |
| `aid` | AV 号，不需要写 `av` 前缀。使用 `aid` 时必须同时提供 `cid`。 |
| `cid` | 视频分 P 对应的 cid。 |
| `page` / `p` | 分 P 页码，默认是 `1`。 |
| `title` | iframe 的标题，主要用于可访问性。 |
| `autoplay` | 是否自动播放，支持 `0`、`1`、`false`、`true`，默认 `0`。 |
| `danmaku` | 是否开启弹幕，支持 `0`、`1`、`false`、`true`，默认 `0`。 |

:::tip
默认关闭自动播放和弹幕，适合文章阅读场景。需要展示弹幕时再手动设为 `danmaku="1"`。
:::

## 提示块

提示块适合放补充说明、警告或重要信息。本站支持 `note`、`tip`、`important`、`warning`、`caution` 五种类型。

:::note
这是普通说明，适合放读者快速浏览时也应该注意的信息。
:::

:::tip
这是小提示，适合放可选但有帮助的内容。
:::

:::important
这是重要信息，适合放必须注意的前提或结论。
:::

:::warning
这是警告，适合放可能导致问题的操作。
:::

:::caution
这是谨慎提示，适合放会带来负面后果的操作。
:::

基础写法如下：

```markdown
:::note
这是普通说明。
:::

:::tip
这是小提示。
:::
```

## 自定义提示块标题

在类型后面加上 `[标题]` 就可以覆盖默认标题。

:::note[自定义标题]
这是一条带自定义标题的 note。
:::

```markdown
:::note[自定义标题]
这是一条带自定义标题的 note。
:::
```

## GitHub 风格提示块

也可以使用 GitHub 风格的提示块语法。

> [!TIP]
> 这种写法同样会被转换成提示块。

```markdown
> [!NOTE]
> 这是一条说明。

> [!TIP]
> 这是一条提示。
```

## Spoiler 折叠文本

`spoiler` 适合隐藏剧透、答案或不想直接展示的内容。被隐藏的内容仍然支持基础 Markdown。

这句话里有一段 :spoiler[被隐藏的 **Markdown** 内容]。

```markdown
这句话里有一段 :spoiler[被隐藏的 **Markdown** 内容]。
```
