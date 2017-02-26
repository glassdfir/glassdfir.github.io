---
layout: post
title:  "UnXORing a RAT"
date:   2016-02-05 14:52:28 -0500
categories: blog
#categories: Reversing RAT XOR
---
I was looking at a sample of malware and I wanted to highlight a very simple technique I used to remove a layer of encryption without knowing the key. This post is not going to impress the seasoned veterans but since I think it will probably help someone in the community; I will bang out a post on it.

I was in the middle of reverse engineering a sample of AdWind RAT. McAfee has a great post on it here. As I read their article, my sample seemed to be in line with Variant 2, which among numerous other layers of obfuscation, has an XORed config.ini file in that contains, another Malicious payload.

Looks like this:
![image-title-here]({{site.url}}/images/Screen-Shot-2016-02-05-at-10.26.16-PM.png){:class="img-responsive"}
Since McAfee article mentions this file is an XML document, I saw an opportunity for a cheap win. The article shows the first line of the file as:
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
{% endhighlight %}
One of the biggest weaknesses of using XOR as an encryption mechanism is that if you have enough plaintext, you can XOR the ciphertext with the plaintext to derive the key that was used to XOR. So with that being said…TO THE CODE!
{% highlight python %}
def xor(buf, key):
    buf = bytearray(buf)
    key = bytearray(key)
    key_len = len(key)
    for i, bufbyte in enumerate(buf):
        buf[i] = bufbyte ^ key[i % key_len]
    return str(buf)
#If we use a bit of plaintext to XOR the ciphertext
#this should yield the key that was used to XOR it.
key = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'

with open('config.ini','rb') as inputfile:
    with open('config-xored-with-cleartext.ini', 'wb') as outfile:
        outfile.write(xor(inputfile.read(),key))
{% endhighlight %}
Here is what we get:
![image-title-here]({{site.url}}/images/Screen-Shot-2016-02-05-at-10.32.38-PM.png){:class="img-responsive"}
With this cleartext document in hand I could continue with my analysis. Again, this isn’t breathtaking but it is worth sharing.
