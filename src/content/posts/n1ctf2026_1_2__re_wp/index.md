---
title: N1CTF Junior 2026 1/2 Reverse WriteUp
published: 2026-01-27
description: 'N1CTF Junior 2026 1/2 Reverse WriteUp'
image: ''
tags: ['Reverse']
category: 'CTF'
draft: true 
lang: ''
series: "CTF学习笔记"
---

记录逆向学习进程！
赛题质量很高，遇到了自己一直想做但是没做的项目，学到很多干货

# Maybe Android
附件为在Android设备上运行Python的小工具，观察题目描述知道flag是使脚本`flag_check.py`正确返回的参数
在jadx-gui中分析，得知UI是用Compose写的（~~Compose优雅捏~~）
而只有尊贵的VIP用户可以运行这个脚本，遂查找相关逻辑：
![](maybe_android/vip.png)

~~随后修改isVip的返回值为true继续下一步~~
注意到激活码使用AES加密与base64编码且值为32位
其中`key`为`8888888888888888`，密文为`"ZlZNZBpzLDK7C4yfjrQcGTlqAAr5EotPbAj+0eC9w0MHcOesjCs4nB/qgrcQFuxI"`,IV为0-15递增的数组
遂编写脚本解密：
```python
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

encrypted_base64 = "ZlZNZBpzLDK7C4yfjrQcGTlqAAr5EotPbAj+0eC9w0MHcOesjCs4nB/qgrcQFuxI"
key = b"8888888888888888"
iv = bytes([i for i in range(16)])

try:
    ciphertext = base64.b64decode(encrypted_base64)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted_bytes = unpad(cipher.decrypt(ciphertext), AES.block_size)
    activation_code = decrypted_bytes.decode('utf-8')
    print(f"{activation_code}")

except Exception as e:
    print(f"exception: {e}")
```
得到激活码为`F4E52DFB41CCC32F8FFFC340A3804383`
随后注意到`flag_check.py`脚本包含对文件`"😇"`的读取
翻assets没有找到`"😇"`，疑似是对python运行环境动了手脚
在`VipDecryptor`类中看到相关逻辑：
```java
package com.example.maybeandroid;

import android.content.Context;
import java.io.File;
import kotlin.Metadata;
import kotlin.io.FilesKt;
import kotlin.jvm.internal.Intrinsics;

public final class VipDecryptor {
    public static final int $stable = 8;
    private final Context context;

    private final native byte[] getDecryptedScript();

    public VipDecryptor(Context context) {
        Intrinsics.checkNotNullParameter(context, "context");
        this.context = context;
        System.loadLibrary("vipdecryptor");
    }

    public final void saveDecryptedScript() {
        byte[] decryptedScript = getDecryptedScript();
        File file = new File(this.context.getFilesDir(), "python/lib/python3.14/site-packages");
        if (!file.exists()) {
            file.mkdirs();
        }
        FilesKt.writeBytes(new File(file, "sitecustomize.py"), decryptedScript);
    }
}
```
给个参数运行一次，然后查找data目录，得到`sitecustomize.py`如下：
```python
import builtins

class Origin:
    def init(self):
        self.open = builtins.open

origin = Origin()

class CustomSum:
    def init(self):
        self.sum = 0

    def lshift(self, other):
        if other == "😢":
            self.sum += 1
            return self
        
    def eq(self, value):
        if value == "😃":
            return self.sum
        return False

class Keyget:
    def init(self):
        self.key = "y0u_@re_vip_Us3r"
        self.index = 0

    def lshift(self, other):
        if other == "😢":
            val = ord(self.key[self.index % len(self.key)])
            self.index += 1
            return val

class GetEnc:
    def init(self):
        self.enc_data = bytes.fromhex("738d9ea5a7c5824836d63c872324e36936c1dd7026b2df418268066a936256a7")
        self.index = 0
    def lshift(self, other):
        if other == "😢":
            val = self.enc_data[self.index % len(self.enc_data)]
            self.index += 1
            return val ^ 0x55

class oprate:
    def init(self,file,mode,*args,**kwargs):
        if file == "😇" and mode == "r":
            return
        try :
            origin.open(file = file, mode = mode, *args, **kwargs)
        except Exception as e:
            print(e)
  
    def xor(self, other):
        if other == "😋":
            return CustomSum()
        elif other == "🫨":
            return list(range(256))
        elif other == "😁":
            return Keyget()
        elif other == "😤":
            return GetEnc()
        return self

builtins.open = oprate

```
观察这个很复杂很复杂的代理逻辑，以及脚本：
```python
import sys
len(sys.argv) != 2 and (print("error arguments provided, exiting.") or exit(0))
f = sys.argv[1]
a = open("😇","r")
b = a ^ "😋"
for i in f: b << "😢"
if not (b == "😃") == (((a ^ "😋") << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢' << '😢') == "😃"):print("Length error");exit(0)
s = a ^ "🫨"
j = (((a ^ "😋")) == "😃")
c = (((a ^ "😋") << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢" << "😢") == "😃")
d = a ^ "😁"
for i in range(c): j = (j + s[i] + (d << "😢")) % c; s[i], s[j] = s[j], s[i]
r = []
i,j = (((a ^ "😋")) == "😃"),(((a ^ "😋")) == "😃")
e = a ^ "😤"
for _ in f: i = (i + 1) % c; j = (j + s[i]) % c; s[i], s[j] = s[j], s[i]; g = s[(s[i] + s[j]) % c]; v = ord(_) ^ g; r.append(v);v != (e << "😢") and (print("Wrong ):") or exit(0))
print("Success!")
print("Flag is flag{<your_input>}")
```
解密脚本如下：
```python
def rc4_keystream(key: bytes, length: int) -> bytes:
    # KSA
    S = list(range(256))
    j = 0
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) % 256
        S[i], S[j] = S[j], S[i]

    # PRGA
    i = 0
    j = 0
    stream = []
    for _ in range(length):
        i = (i + 1) % 256
        j = (j + S[i]) % 256
        S[i], S[j] = S[j], S[i]
        K = S[(S[i] + S[j]) % 256]
        stream.append(K)

    return bytes(stream)


def main():
    key = b"y0u_@re_vip_Us3r"
    enc_hex = (
        "738d9ea5a7c5824836d63c872324e369"
        "36c1dd7026b2df418268066a936256a7"
    )
    enc_data = bytes.fromhex(enc_hex)

    ks = rc4_keystream(key, len(enc_data))

    flag_bytes = bytes(
        ks[i] ^ enc_data[i] ^ 0x55
        for i in range(len(enc_data))
    )

    flag = flag_bytes.decode("utf-8")
    print("flag{" + flag + "}")


if __name__ == "__main__":
    main()
```

# Wizard Time
