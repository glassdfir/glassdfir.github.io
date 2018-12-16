---
layout: post
title:  "Hacking BRBBot"
date:   2018-12-08 15:33:28 -0500
categories: blog
---

Recently, in a scramble to find a final exam for my malware course that wasn't multiple choice, I decided to revisit a sample from my youth: BRBBot.

This sample can be found here:
[https://www.reverse.it/sample/b9cfd5f89bd282452f82cc8d323f39c6932e55cab98065bb3c2cf97bb585dc2d?environmentId=1](https://www.reverse.it/sample/b9cfd5f89bd282452f82cc8d323f39c6932e55cab98065bb3c2cf97bb585dc2d?environmentId=1)

I enjoyed my initial analysis of this sample because there were a couple of victories to be found from decoding the encrypted config file dropped to disk which leads to decrypting the C2 traffic. The problem I had with using this with my students is that BRBBot has been blogged about several times in the six years since it first came out. So, naturally, the only thing left to do reverse engineer the sample a smidge further and make my own flavor.

### Config File

Hacking BRBBot largely boils down to hacking the embedding configuration file.
Upon execution, BRBBot looks in the current directory for an encrypted file called "brbconfig.tmp".  It looks like this:
![brbconfig.tmp]({{ site.baseurl }}/images/brbconfig.tmp.png)

If this file isn't present, BRBBot will drop it in the current directory. The encrypted data is found 112 bytes into the .rsrc portion of the exe.
![Embedded File]({{ site.baseurl }}/images/brbconfig.tmp.embedded.png)

This file is read early in the execution and during my initial analysis, I was able to review the plaintext content of the file by simply setting a breakpoint for the return of the advapi32.dll.CryptDecrypt function as seen below.
![CryptDecrypt]({{ site.baseurl }}/images/CryptDecryptBreakpoint.png)

This is all well and good but just knowing the cleartext content doesn't give me enough information to make my own file. To me this highlights the difference between Malware Analysis and Reverse Engineering. So find out more about how the encrypted file was made, I had to do a bit of digging into the advapi32.dll.CryptDecrypt function itself.

[Wincrypt.hCryptDecrypt function](https://docs.microsoft.com/en-us/windows/desktop/api/wincrypt/nf-wincrypt-cryptdecrypt)

This was a bit of a long journey into the bowels of Microsoft's wincrypt libraries. I will save you the entire saga and cut to the highlights.
So to decrypt the data read from the file, a handful of things need to be provided to the CryptDecrypt function:
*  hKey - A handle to the encryption key to use for the decryption. This key specifies the decryption algorithm to be used.
*  hHash - A handle to a hash object.
*  Other junk
*  pbData - A pointer to a buffer that contains the data to be decrypted. After the decryption has been performed, the plaintext is placed back into this same buffer.

So if I scroll back up the stack I can see a few of the other Crypt functions. The first one I notice is the CryptCreateHash function accompanied by a suspiciously helpful string "YnJiYm90".  
![CryptDecrypt]({{ site.baseurl }}/images/CryptCreateHash.png)

So after reading the [Wincrypt.hCryptCreateHash function](https://docs.microsoft.com/en-us/windows/desktop/api/wincrypt/nf-wincrypt-cryptdecrypt) and looking up the [ALG_ID](https://docs.microsoft.com/en-us/windows/desktop/SecCrypto/alg-id) up, I determined that this function is creating an MD5 hash object of the "YnJiYm90" string.

For those lost... this is how you could write this same functionality in Python:
```
import hashlib
m = hashlib.md5()
m.update("YnJiYm90")
```
Scrolling a bit further down we see the CryptDeriveKey function which generates cryptographic session keys derived from the base data value. So jumping back to the [ALG_ID](https://docs.microsoft.com/en-us/windows/desktop/SecCrypto/alg-id) table, I can see that 6801 translates to the RC4 stream encryption algorithm.
![rc4]({{ site.baseurl }}/images/RC4.png)

SO...LONG STORY SHORT...

This code creates an MD5 hash of the YnJiYm90 password and uses it as an RC4 decryption key. Proof you demand? Fine. I threw the encrypted file into CyberChef and used the MD5 hash of YnJiYm90 to decrypt the payload using the RC4 operation.

![CyberChef RC4]({{ site.baseurl }}/images/brbcyberchef.png)

Now that I knew this file was RC4ed with this specific password, I could create my own configuration for my students and embed it into the executable. Easy peasy.

![Custom Config]({{ site.baseurl }}/images/brbcyberchef2.png)

I had to do a hand full of other things to make this usable for my needs but I thought others might find value in this.
