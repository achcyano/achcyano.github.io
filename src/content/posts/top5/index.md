---
title: TOP5
published: 2025-11-23
description: 'TOP5流行的加密算法'
image: './Still_040_001.png'
tags: ["Reverse"]
category: 'CTF'
draft: false 
lang: 'zh-cn'
series: 'CTF学习笔记'
---
> Cover image source: [Source](https://store.steampowered.com/app/3101040/)
# TOP5流行的加密算法

## TEA
### 需要提供的
- 128 位密钥（4 个 32 位无符号整数）
- 明文/密文
- 初始向量(IV)

### 示例代码
```python
import struct

def tea_encrypt(plaintext, key, rounds=32):
    v0, v1 = struct.unpack('>2I', plaintext)
    
    k0, k1, k2, k3 = struct.unpack('>4I', key)
    delta = 0x9E3779B9
    sum_val = 0
    mask = 0xFFFFFFFF
    for _ in range(rounds):
        sum_val = (sum_val + delta) & mask
        v0 = (v0 + (((v1 << 4) + k0) ^ (v1 + sum_val) ^ ((v1 >> 5) + k1))) & mask
        v1 = (v1 + (((v0 << 4) + k2) ^ (v0 + sum_val) ^ ((v0 >> 5) + k3))) & mask
    return struct.pack('>2I', v0, v1)


def tea_decrypt(ciphertext, key, rounds=32):
    v0, v1 = struct.unpack('>2I', ciphertext)
    k0, k1, k2, k3 = struct.unpack('>4I', key)
    
    delta = 0x9E3779B9
    sum_val = (delta * rounds) & 0xFFFFFFFF
    mask = 0xFFFFFFFF
    for _ in range(rounds):
        v1 = (v1 - (((v0 << 4) + k2) ^ (v0 + sum_val) ^ ((v0 >> 5) + k3))) & mask
        v0 = (v0 - (((v1 << 4) + k0) ^ (v1 + sum_val) ^ ((v1 >> 5) + k1))) & mask
        sum_val = (sum_val - delta) & mask
    return struct.pack('>2I', v0, v1)

if __name__ == "__main__":
    plaintext = b'Hello!!!'  # 8 字节明文
    key = b'0123456789ABCDEF'  # 16 字节密钥
    
    print(f"明文: {plaintext}")
    print(f"密钥: {key}")
    
    # 加密
    ciphertext = tea_encrypt(plaintext, key)
    print(f"密文 (hex): {ciphertext.hex()}")
    
    # 解密
    decrypted = tea_decrypt(ciphertext, key)
    print(f"解密: {decrypted}")
```

## RC4
### 需要提供的
- 明文/密文
- 密钥

### 示例代码
```python
def rc4(data, key):
    S = list(range(256))
    j = 0
    for i in range(256):
        j = (j + S[i] + key[i % len(key)]) % 256
        S[i], S[j] = S[j], S[i]
    
    i = 0
    j = 0
    out = bytearray()
    for b in data:
        i = (i + 1) % 256
        j = (j + S[i]) % 256
        S[i], S[j] = S[j], S[i]
        out.append(b ^ S[(S[i] + S[j]) % 256])
        
    return bytes(out)

if __name__ == "__main__":
    key = b"coka cola espuma"
    cipher = bytes.fromhex("91 A5 F9 17 24 64 9A A7 75 A7 51 84 8B")
    
    print(rc4(cipher, key).decode())
```

## Base64
### 需要提供的
- 明文/密文

### 示例代码
```python
import base64

def b64_encrypt(text):
    return base64.b64encode(text.encode()).decode()

def b64_decrypt(text):
    return base64.b64decode(text).decode()

# 用例
plain = "BV1UW4y1N79w"
cipher = b64_encrypt(plain)
print(f"Base64: {b64_decrypt(cipher) == plain}")
```



## XOR
### 需要提供的
- 密文
- 异或的字节

### 示例代码
```python
def xor_crypt(text, key_byte):
    return "".join(chr(ord(c) ^ key_byte) for c in text)

key = 0x2A
plain = "mamashengde"
cipher = xor_crypt(plain, key)
print(f"XOR: {xor_crypt(cipher, key) == plain}")
```

## XTEA
### 需要提供的
- 明文/密文
- 密钥
- 加密轮数

### 示例代码
```python
import struct

def xtea_encrypt(text, key, rounds=42):
    v0, v1 = struct.unpack("<II", text)
    k = struct.unpack("<IIII", key)
    delta = 0x9E3779B9
    sum_val = 0
    for _ in range(rounds):
        v0 = (v0 + ((((v1 << 4) & 0xFFFFFFFF) ^ (v1 >> 5)) + v1) ^ (sum_val + k[sum_val & 3])) & 0xFFFFFFFF
        sum_val = (sum_val + delta) & 0xFFFFFFFF
        v1 = (v1 + ((((v0 << 4) & 0xFFFFFFFF) ^ (v0 >> 5)) + v0) ^ (sum_val + k[(sum_val >> 11) & 3])) & 0xFFFFFFFF
    return struct.pack("<II", v0, v1)

def xtea_decrypt(text, key, rounds=42):
    v0, v1 = struct.unpack("<II", text)
    k = struct.unpack("<IIII", key)
    delta = 0x9E3779B9
    sum_val = (delta * rounds) & 0xFFFFFFFF
    for _ in range(rounds):
        v1 = (v1 - ((((v0 << 4) & 0xFFFFFFFF) ^ (v0 >> 5)) + v0) ^ (sum_val + k[(sum_val >> 11) & 3])) & 0xFFFFFFFF
        sum_val = (sum_val - delta) & 0xFFFFFFFF
        v0 = (v0 - ((((v1 << 4) & 0xFFFFFFFF) ^ (v1 >> 5)) + v1) ^ (sum_val + k[sum_val & 3])) & 0xFFFFFFFF
    return struct.pack("<II", v0, v1)

key = b"coka cola espuma"
plain = b"TOP5+enc"
cipher = xtea_encrypt(plain, key)
print(f"XTEA: {xtea_decrypt(cipher, key) == plain}")

```
