---
title: Expressive Code 用法
published: 2024-04-10
description: 整理本站代码块、语法高亮、行号、标记和折叠写法。
tags: [Markdown, Fuwari]
category: Blog
draft: false
series: "Fuwari官方文档"
---

本站使用 [Expressive Code](https://expressive-code.com/) 渲染代码块。它会在普通 Markdown 代码块的基础上增加语法高亮、文件名、终端样式、行号、行标记、diff 标记和折叠区域。

## 基础代码块

在三个反引号后写语言名，就可以得到对应语言的语法高亮。

```js
console.log('This code is syntax highlighted!')
```

不知道该写什么语言时，可以先写 `text`。如果是命令行内容，优先使用 `bash`、`sh`、`powershell` 或 `shellsession`。

## 文件名和标题

在代码块开头加 `title` 可以显示文件名或标题。

```js title="src/main.js"
console.log('Title attribute example')
```

如果代码前几行是文件名注释，Expressive Code 也可以自动识别成标题。

```html
<!-- src/content/index.html -->
<div>File name comment example</div>
```

## 终端视图

命令行语言会自动使用终端样式。

```bash title="terminal"
pnpm install
pnpm dev
```

`shellsession` 适合展示带提示符的连续会话。

```shellsession
$ pnpm check
$ pnpm build
```

如果某个代码块不想显示编辑器或终端外框，可以设置 `frame="none"`。

```sh frame="none"
echo 'No frame for this block'
```

## 行号

需要明确显示行号时，添加 `showLineNumbers`。

```js showLineNumbers
console.log('Greetings from line 1!')
console.log('I am on line 2')
```

不想显示行号时，添加 `showLineNumbers=false`。

```js showLineNumbers=false
console.log('This block hides line numbers')
console.log('Useful for short examples')
```

也可以修改起始行号。

```js showLineNumbers startLineNumber=5
console.log('Greetings from line 5!')
console.log('I am on line 6')
```

## 标记整行

在代码块开头用 `{}` 指定行号或行范围，就可以高亮对应行。

```js {1,4,7-8}
// Line 1 - targeted by line number
// Line 2
// Line 3
// Line 4 - targeted by line number
// Line 5
// Line 6
// Line 7 - targeted by range "7-8"
// Line 8 - targeted by range "7-8"
```

可以用 `ins` 和 `del` 区分新增行与删除行；没有指定类型的 `{}` 会使用普通高亮。

```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log('this line is marked as deleted')
  // This line and the next one are marked as inserted
  console.log('this is the second inserted line')

  return 'this line uses the neutral default marker type'
}
```

## 标记行内文本

在开头写一段字符串，可以标记代码中匹配到的文本。也可以使用 `ins="..."` 和 `del="..."` 指定新增或删除样式。

```ts "userId" ins="accountId" del="legacyId"
const legacyId = 'old-id'
const accountId = 'new-id'
const userId = accountId
```

## Diff 代码块

使用 `diff` 语言时，以 `+` 开头的行会显示为新增，以 `-` 开头的行会显示为删除。

```diff
-const theme = 'light'
+const theme = 'dark'
 const mode = 'auto'
```

如果希望 diff 同时按某种语言高亮，可以加 `lang`。

```diff lang="ts"
export function getTheme() {
-  return 'light'
+  return 'dark'
}
```

## 自动换行

本站代码块默认适合在窄屏阅读。遇到必须保持横向滚动的长行，可以为单个代码块关闭换行。

```js wrap=false
const longText = 'This is a very long string that should stay on one line when wrap is disabled for this code block.'
```

## 折叠代码

较长示例可以用 `collapse` 折叠不重要的行。多个范围用逗号分隔。

```ts collapse={1-5,17-19}
import { createClient } from '@example/client'
import { readConfig } from '@example/config'
import { createLogger } from '@example/logger'

const config = readConfig()
const logger = createLogger(config.logLevel)
const client = createClient(config)

export async function main() {
  logger.info('start')
  const result = await client.fetch('/api/status')
  logger.info(result.status)
  return result
}

await main()

client.close()
logger.info('done')
```

## 常用组合

日常写文章时，最常用的是 `title`、`{1,3-5}`、`ins={}`、`del={}`、`showLineNumbers` 和 `collapse={}`。如果只是展示几行普通代码，保留最简单的语言标记即可，不需要给每个代码块都加额外配置。
