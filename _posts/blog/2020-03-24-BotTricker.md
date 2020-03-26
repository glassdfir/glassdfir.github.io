---
layout: post
title:  "BotTricker"
date:   2020-03-24 12:33:28 -0500
categories: blog
---

When I spent some time getting to know TrickBot, I found it was helpful to decrypt the modules it injects manually in Python instead of spending the time to debug each one.
The following is a rudimentary script designed to find custom base64 character sets inside of raw data. 
Overall steps:
## Finding b64 charsets:
    - Find potential base64 character sets by using Regex to look for all 64 character strings containing A-Za-z0-9+/
    - Take each match and sort the string to put the characters in order
    - Compare to a sorted list of standard b64 characters.
    - If there is a match, then we know the string has 1 of each character in the base64 character set, just in a different order.



```python
import base64
import re

std_base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

def append_padding(val):
    mod = len(val) % 3
    while (len(val) % 4) != 0:
        val += "="
    return val    

def findcustomb64keys(filedata):
    base64keys = []
    potentialbase64keys = re.findall(b"[A-Za-z0-9+/]{64}",filedata)
    sorteddict = ''.join(sorted(std_base64chars))
    for keystr in potentialbase64keys:
        attempt = keystr.decode('utf-8')
        sorted_attempt = ''.join(sorted(attempt))
        if sorted_attempt == sorteddict:
            base64keys += [attempt]
    return base64keys
    
with open('module2.bin','rb') as inputfile:
    rawdata = inputfile.read()
    
keys = findcustomb64keys(rawdata)
keys = list(set(keys))

print("Base64 character sets found in Raw Data:\n"+"\n".join(keys))

```

    Base64 character sets found in Raw Data:
    yocxm6hkRzWB70tqQLnvfaujIpN3F8Aw1/KUPS5deVEMD2G9O+ZCg4TYbJHsrXli
    HJIA/CB+FGKLNOP3RSlUVWXYZfbcdeaghi5kmn0pqrstuvwx89o12467MEDyzQjT


## Decoding potential B64 strings
    - RegEx rawdata for any string that contains b64 chars and is between 5 and 4000 bytes in length
    - For each key found:
        - Translate the characters in the string from the custom character set to the regular set
        - Base64 decode as usual.
        - To cutdown the noise, I am checking to see if the decoded data contains any any string from 5 - 6000 chars long.
            - Not prefect


```python
potentialbase64strings = re.findall(b"[A-Za-z0-9+/]{5,6000}",rawdata)
decodedstrings = []
for key in keys:
    if key != "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/":
        for encodedstring in potentialbase64strings:
            try:
                s = append_padding(encodedstring.decode('utf-8'))
                translation = str.maketrans(key, std_base64chars)
                translatedstr = s.translate(translation)
                data = base64.b64decode(translatedstr)
                
                #lets just look for ascii strings
                justascii = re.search(b"[\x00-\x7F]{5,6000}", data)
                if justascii:
                    try:
                        decodedstrings += [justascii.group(0).decode('utf-8')]
                    except:
                        decodedstrings += [justascii.group(0)]
            except:
                continue

```


```python
for decoded in decodedstrings[:30]:
    print(decoded)
```

    AA	
    checkip.amazonaws.com
    ipecho.net
    ipinfo.io
    api.ipify.org
    icanhazip.com
    myexternalip.com
    wtfismyip.com
    ip.anysrc.net
    api.ipify.org
    api.ip.sb
    ident.me
    www.myexternalip.com
    /plain
    /text
    /?format=text
    zen.spamhaus.org
    cbl.abuseat.org
    b.barracudacentral.org
    dnsbl-1.uceprotect.net
    spam.dnsbl.sorbs.net
    CSName
    Caption
    CSDVersion
    OSArchitecture
    ProductType
    BuildType
    WindowsDirectory
    SystemDirectory
    BootDevice


## Determining Which Module is Which

This is an example of how to categorize the decoded strings based on observation.



```python
signatures = {"[Main Bot]":"<ipconf>",
             "[UAC Bypass]":"Software\Classes\AppX82a6gwre4fdg3bt635tn5ctqjf8msdd2"}

for sig in signatures:
    if signatures[sig] in decodedstrings:
        print("**** This appears to be", sig, "****\n\n")


```

    **** This appears to be [Main Bot] ****
    
    

