---
layout: post
title:  "Analysis of Fiesta EK"
date:   2018-12-26 15:33:28 -0500
categories: blog
---

For funsies, snagged a Traffic Analysis Exercise from Malware-Traffic-Analysis.net. If you want to follow along at home, here is the link:
[http://www.malware-traffic-analysis.net/2014/12/08/index.html](http://www.malware-traffic-analysis.net/2014/12/08/index.html)


A review of the network packet capture (PCAP) revealed that 192.168.204.137 was the source or destination for all of the network traffic. NetBIOS queries identify this host as "38NTRGDFQKR-PC".

Network artifacts within this PCAP are consistent with 5 stages of the Fiesta Exploit Kit:

![Fiesta EK Stages]({{ site.baseurl }}/images/fiestaEKchain.png)

### **Stage 1: Visiting Compromised Site**

Artifacts reflect the incident resulted from a user clicking a Google.de link that redirect the user to ExcelForum.com. ExcelForum, a Microsoft Excel user forum was running vBulletin 4.1.8 at the time of the attack and was vulnerable to several CVEs including CVE-2012-4328.

### **Stage 2: Gate Redirection**
![TCP Stream 2]({{ site.baseurl }}/images/fiestaEKtcp2.png)

In tcp.stream 2, analysis reveals the malicious JavaScript injected under the the script reference for the CKEditor in the HEAD section of the page. The JavaScript references a external site: hxxp://magggnitia.com/?Q2WP=p4VpeSdhe5ba&nw3=9n6MZfU9I_1Ydl8y&9M5to=_8w6t8o4W_abrev&GgiMa=8Hfr8Tlcgkd0sfV&t6Mry=I6n2. In WireShark, we can see this being delivered in tcp.stream 8. After extracting the payload, I chucked it into CyberChef to take a look at it. 
[(![Click to Open In CyberChef]({{ site.baseurl }}/images/fiestaEKgate.png)](https://gchq.github.io/CyberChef/#recipe=From_Hex('Auto')Gunzip()JavaScript_Beautify('%5C%5Ct','Auto',true,true)Find_/_Replace(%7B'option':'Regex','string':'%5C%5C%5C'%20%5C%5C%2B%20%5C%5C%5C''%7D,'',true,false,true,false)&input=MWY4YjA4MDAwMDAwMDAwMDAwMDM3NTU1NTk1M2RiM2ExNGZlMmI4NjA3NjQ0ZjA0YjE0MzkzMTQzNGJhNzc0YTA5ZDA4NWFkMGQyZDI1ZTMwN2Q5OTY2ZDA1NDdkZWU0MmM0ZGYzZGY3YmJjMjQwZTc3ZTYzZTQ5M2EzYWU3ZmJjZTJhNGQ0NTkwNjcxNDQ5MzYxNzAxNTM3MTg2ODgxYmM3ZjI5NDIyMmY3NjhiMTk5NzBhMTEyNTIyNTVkMDg1OTA1ZWJjMjA0OTE2N2JlZjY5MjU5YTU0OWEzNjUxNWNlNjQxMjM5YTk2NzAzNjk5YjM0YzViNDg2ZjZiMTRkYzNkY2Q1NDM2NzY0NzU3MTQ4NTRhMjVlN2E4ODNiYTVkNGYwNGIwOGEwNTc3MjRhYzZjYzY0ZjA0YWNiMjNiNzg1NWIwMjZhMmJmOGM0YmJkODdmOGU2MjdhYzVmYWY1ZjE2MTlhY2QzNjc3ZTdkMDllYmY1ZTljM2YxMjc1OGZiYTg2MjAzNzcyOTMwOWU2Y2RkMjYzNzhiNmNiNWNjMWY1ZjJlNjljYjRlZmM0MmJhNGFjNDUyY2JiOWZhMThjN2FmODJlYjEyODhmMTljNDUwNWM3N2M5OTg4OGNlN2M2MWE0MDRlZGNlYTlhOTZkNzFkNDQ1MTg3ZTcyZTRiYjg1ZTY5MWE5ZDQzYTIzNWRhZjRiMGQzZWM0ZTU0N2M3ZDNiZmVhZTMyMjEwM2JkNTI0OTk4MGE2OWY3OTA2NDVjMTU5OTI0OWIxZDdkZjA4NmRlNTg5NzExMzQ4NDQ4NDM5ZDk2YmY4YTJkZTcyYzczYzNlYTY2ZWI0ZTIzNTdjMDQ2NjUxMTQ1ZDUzOWY2N2QxMDY5NTQzM2FiMjM5NzVlYjUxN2JlYTZkNzY4MjcxMTk3ODEwYWI1N2YzNGQzZDBkNjNiZjVlNjEyNmFjNTk3ZjdiZTVlZDMxOTk1NWRhMzczNDBiNTYzYWIzNWU5ZDBjNmE3MDY5MGQ0NTRmZmMxNDEwNGUxYzZhNzFhYWNkMjZhOTBkZTU4MzQyODliM2EyMDkwOTc5NTJjNjQ5M2YyNDYyOTJmOWNiY2NlNmQ4ZDg5Y2IwMDBkODM2YzM2NzU3YTliNzRlYzY1NzkxYzNlM2Q1ZmFiMWY5ZjNlYTc0MjM3ZDZjMmQ3MGZkYWJjMWZiYWIzNmZkM2JiNTFmMTNkZjE2ZmQzZmI0M2EzYWVjMWI2YTY5MjJmYjQ0YmE2Yjg2ZTkwNmQ3MTAxN2QyYzY2NWNkZjllODNlNjZjNzRjYzY1YmYzN2U4YmJhNjY5OTBmY2ZmZjAzMTFhZjYzYzY2Nzk4ZTM1MThiYTE2MWIzODY3ODNlMWMwN2JlNzlkYmQzNzA3Y2NlMmJlNjlhMjVkZmIzNWVkYTJhOWFjZTAxYjFlZTU3Y2RkMDg3YzA2ODc0ZDFiZGZmNGY5Y2JhOGI4N2JiZGZjZmQ0MTlmMGViMzNhODJjNTE5ZjZmYjIxNjY3MzFjNTkyNGIyMjg4YTY1MTQzMzBmMTEzNmE3ODg3OWRlNjgwZWMzZjE1NWU0MzBiNDFjODYxZDc0NDFhYzE0NzNjM2VhMDY5MWM1MTk0NTk3ZjdiNzFmNjNhOTRhNGRiMGU1NjA1ZDhkZmQ4NGNkZWQ3Zjc3M2IxZGE4NGFkYWYzN2FjODI3MDA2NWViOTE1NWM5NWExZmQ1OGZmOWEzZjA5Y2ZiMmJiZGY2MmY1ZDkxNzQ0NTUxOTFmM2VjNDM1MDExNmVhMzJkNWY5MTQ5YmFiMmY3YTYyNGJlN2M4YzllYzJkYjg3NDI1Zjk5MTE5Njg5NTU2MzI0NDM5MjBjMjk1MjNjNmZjZDQxNjE5MjBjNmRiZDU0NmExMWFlMTJmN2Y5NjY3YWY3YzU3ZjY5ZThmZDk0ZjgyOWRkNzM2YTZiYmZjN2Q1ZmQyOWU0ZTAxZGU5MGFlY2E3YzY5ZjNmZmIzN2NiOWRiY2U1Nzg3ZTQ4YzVhZjBiNDdjZTFiMGEyNmIwYzM4OWMzYTlkZTFkNjdjMjgzMThiYmMyMjA0Y2JjNjFhZDlhYjEwNTc2Mzg2NjAyN2FiMDcxYzY3YzUzZjZhYTBmNWFiZWQ5ZDVhZjZmOWYyZjMyOTVjYTg2NzA5YTBlNzA2MTE2MzhlYWUxNTBlMjZjZThlMjU0MGRmMWNhYzI3MjM2YzczZWMzY2UxY2IzMDBiYjg1YzRiZjhiM2U0ZTUyNzAwZTdhMjE4OWYzZjJiOTJkMjFjZjE5NmM5YzNjOGU4YWYyZTFlNTI0ZTJiZTNhM2ZiNmZhNzBlODlkMjY0YjUyNGFlM2E0OTQ5Y2MyNmU5ODJjMTEwMTY4OGFmMmNjNDU2NDA1M2QyNmZjYWM3ZWMxMTEwMTQ3Mjg3MmYzN2M1YzIyMmRhMTNlNTE4ZjIyOTg5NTUxNTQwYWFhMGZhNTgzZjI4YmQ1OTgwNTc3NWIxYjcwOGQyMmE3N2NlY2JkMTUyMmUwM2M0NTBiZTFhOTEwZGE5M2MxODdjMTQ1MTAwMjEwMzgwZWFkOWEyNDMwZjUxZjQzMTE0MTUzODY2MGU2NjYxY2U2NzQxNGQ1ZDAwNGEyMDdiZmQ0MmEwMjU4MTY1MDY0OTlhOGNjZjU5Yjk3ZTBlODY4YWY2NDQ3NDcwN2ZiNGQ2MmFjMjE5Yjk0MDUwNDUyNDVlYjU2MGZhNWFkYWYyY2EzOTQ0Y2MwMzc5YjgyNDY3NWYwNTliYjA3NWU3YjAyYjFkYmQ0OTk1NzAyNDg5MDRkNzc3ZjUwMzMzZjUxY2ZkNjIxNTg2MzYyZGExMzA4YzdkNjQxZDNkODZjZjZlNmI4MmRhZTQxZmUwMjg5YTRmN2JhOWIwNzAwMDA)
Using CyberChef we can see the script from magggnitia.com has the following notable functionalities:
* Compressed data
* Light obfuscation
* Uses DOMContentLoaded event listener to begin execution when the initial HTML document has been completely loaded and parsed
* Checks for the following conditions before redirection
    * ThUXGtVIJqi() - Checks for the existence of the cmRjNEuSpfMqO cookie to prevent redundant infection. If the cookie does not exist, it will set it as a flag. 
    * XPqiYBbnv() - Checks for the Existence of Trident in the UA string meaning the next stage payloads depend on attacking Internet Explorer.
    * Reviews User Agent String for Browser and OS Version attempting to exclude 64-bit processes. This is most likely because the next stage only contains 32-bit payloads.
* Redirects to hxxp://digiwebname.in/6ktpi5xo/PoHWLGZwrjXeGDG3P-I5 payload

### **Stage 3: Fiesta EK Landing Page**

Starting with tcp.stream 29, we can see the Fiesta EK landing page from digiwebname.in has a large amount of moderately obfuscated JavaScript and presents a page with seemingly random words. 
![Landing Page]({{ site.baseurl }}/images/fiestaEKlandingpage.png) Most of the variables are encrypted and use the "boomp" function to decrypt. For me, it was easier to rewrite this in Python and use RegEx to deobfuscate the code at scale.
![Python]({{ site.baseurl }}/images/fiestaEKpython.png)

The following analysis is based on reverse engineering of the major functions within the landing page JavaScript: 

* **lege5b()**
    * Purpose: Deliver Shockwave Flash Exploit for Flash Player v11.2 from hxxp://digiwebname.in/6ktpi5xo/228759d200ad45b60a060c0c0702550b00010b0c015b540907060001060b560b
    * Applicable to 38NTRGDFQKR-PC: **No.**
    * This was not available in the packet capture.
* **swapy5()**
    * Purpose: Deliver Shockwave Flash Exploit for Flash Player v10.3 - 11.1 from hxxp://digiwebname.in/6ktpi5xo/69266c7425df8059030f0b0d0458060d040a010d0201070f030d0a000551050
    * Applicable to 38NTRGDFQKR-PC: **No.**
    * This was not available in the packet capture.
* **naveo()**
    * Purpose: Deliver Shockwave Flash Exploit for Flash Player 10.2 from hxxp://digiwebname.in/6ktpi5xo/3830948c194842760701040b0b0f095a010b000b0d560858060c0b060a060a5a
    * Applicable to 38NTRGDFQKR-PC: **Yes.** At the time of the incident, the network artifacts reflect the workstation was running Flash Player 10.2 and this exploit was executed.
    ![naveo]({{ site.baseurl }}/images/fiestaEKnaveo.png)
* **hags5()**
    * Purpose: Deliver Java FX exploit for Java v6.3-7.22 from hxxp://digiwebname.in/6ktpi5xo/1b9a9eecb34c4c045b0c555a0b5e545a03510a5a0d075558045601570a57575a
    * Applicable to 38NTRGDFQKR-PC: **No.**
    * This was not available in the packet capture.
* **glumw9()**
    * Purpose: Deliver malicious Java Applet exploit for Java >6 from hxxp://digiwebname.in/6ktpi5xo/55fdd7ebca026cab5447075f560c545b0706555f5055555900015e525705575b
    * Applicable to 38NTRGDFQKR-PC: **Yes.** At the time of the incident, the network artifacts reflect the workstation was running Java 1.6 and this exploit is targeted at anything below version 6.
    ![glumw9]({{ site.baseurl }}/images/fiestaEKglumw9.png)
* **chadvs()**
    * Purpose: Deliver malicious Silverlight exploit for Builds 4.0.50401.00 through 5.1.20125.0 from http://digiwebname.in/6ktpi5xo/39e112e34c7d1c884055130a0309540a010a560a05505508060d5d070200570a
    * Applicable to 38NTRGDFQKR-PC: **Yes.** At the time of the incident, the workstation was running 4.0.6053.1.
    ![chadvs]({{ site.baseurl }}/images/fiestaEKchadvs.png)
* **bugs5()**
    * Purpose: Deliver JavaScript based exploit for Internet Explorer versions 8 through 10 from hxxp://digiwebname.in/6ktpi5xo/4d0a65349d0e9f375d015c5a040e020d0657035a0257030f015008570507010d
    * Applicable to 38NTRGDFQKR-PC: **Yes.** User was running IE 8 at the time of the attack.
    ![bugs5]({{ site.baseurl }}/images/fiestaEKbugs5.png)
* **robst()**
    * Purpose: Deliver Adobe Acrobat AcroPDF ActiveX control exploit for version 8-8.21,9.3-10 from http://digiwebname.in/6ktpi5xo/7d0d7c94be7afa7a5b0d525f0558080d0557035f0301090f0250085204510b0d
    * Applicable to 38NTRGDFQKR-PC: **¯\\\_(ツ)\_/¯.** This one is a bit of a mystery. Despite the user not having the correct version of Adobe Acrobat AcroPDF, the exploit is still requested in TCP stream 32.
    ![PDF Mystery]({{ site.baseurl }}/images/fiestaEKmystery1.png)
    ![PDF Mystery]({{ site.baseurl }}/images/fiestaEKmystery2.png)
    Unless I screwed something up, which happens...often, 910 does not meet this logic criteria: (adobeVer >= 800 and adobeVer < 821) or (adobeVer >= 1000 and adobeVer < 931). 

### **Stage 4: Exploitation**

**hyepksam259.swf**

The first of the five leveraged exploits in the EK, hyepksam259.swf is a Shockwave Flash file that exploits [CVE-2014-0569](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-0569) Adobe Flash Player casi32 Integer Overflow Remote Code Execution Vulnerability.

TCP stream 30 shows the workstation requesting hxxp://digiwebname.in/6ktpi5xo/3830948c194842760701040b0b0f095a010b000b0d560858060c0b060a060a5a;118800;94 with the "18800;94" containing version information for Shockwave. The hyepksam259.swf md5:808bb909e98f93c38f54b6cfc9702520 is delivered to the endpoint. 
JPEXS was used to review the obfuscated and encrypted ActionScript. 
![PDF Mystery]({{ site.baseurl }}/images/fiestaEKswf.png)

* yakspi(): XORs two variables
* briols[]: Array of Encrypted Action Script
* girdq(): Loads Decrypted Action Script

The purpose of this SWF is to generate a second SWF that downloads (TCP stream 31) and executes an encrypted portable executable: [MD5 72c2c343ebea67767de167aaf254a91d].

**JavaScript**

The second of the five leveraged exploits in the EK, presents the user with a page full of obscure words. The JavaScript embedded on this page uses the exact same encryption as the previous one; using "I450S+bxX=9UjpAG7fNaq3sd2M61Ze8LkcJRhg" as the encryption key. The only difference being the function name was "viasw" instead of "boomp".
![JS Exploit]({{ site.baseurl }}/images/fiestaEKjsview.png)
I find that bit of trivia interesting because it speaks to how the kit was built and how much actual unique code I need to reverse. Also, I noticed many of the variable names in these scripts are 4 letter English words with 1 or 2 extra characters on the end...

The HTML document body contains two div elements "soiln" and “debtx”, each containing encoded objects. Chrome’s developer tools we used to deobfuscate the bulk of the code.
* soiln - decodes to contains 2907 bytes of base64ed data with Shannon entropy of 7.7 which is consistent with encrypted or compressed data.
* debtx - contains script and 2197 bytes of encoded data with a Shannon entropy of 5.8 which is consistent with encoded scripts.

This code is densely obfuscated and I could dig deeper on this later if I get really bored.

**buvyoem41.pdf**

The third package delivered is a PDF containing an exploit for CVE- 2010-0188, Unspecified vulnerability in Adobe Reader and Acrobat 8.x before 8.2.1 and 9.x before 9.3.1. In TCP stream 32 we can see the buvyoem41.pdf being delivered from the landing page request. 
![PDF Dumper]({{ site.baseurl }}/images/fiestaEKPDFDumper.png)
This PDF document presents with repeating nonsensical sentences and contains 3 notable objects:
* Object 9: Obfuscated JavaScript containing more Base64 encoded encrypted JavaScript that calls Object 10 via Object 6.
    * Interestingly enough, the JavaScript in the PDF uses the same "I450S+bxX=9UjpAG7fNaq3sd2M61Ze8LkcJRhg" for a key but using "polyu" as decrypt function.
* Object 10: Minisets of Base64 encoded shellcode.
When loaded, this PDF downloads (TCP stream 34) and executes an encrypted portable executable: [MD5 72c2c343ebea67767de167aaf254a91d].

**dszohrfb90.xap**

The forth package delivered is a Microsoft Silverlight file containing an exploit for CVE-2013-0074.A:  Double Dereference Vulnerability. Using 7zip to extract the contents, we can see the following files within:
* AppManifest.xaml
    * Windows markup file that references kagfhwyr720.dll
* kagfhwyr720.dll
    * .NET PE file that decrypts ward7w using an XOR key of 88 and then loads shellcode from the "gall" applet parameter from the landing page.
    ![IL Spy]({{ site.baseurl }}/images/fiestaEKILSpy.png)
* ward7w
    * .NET DLL titled "goat" with 5 sections: App, coed, dido, part, vote
    * Contains obfuscated code distributed across various functions and encoded in Base64

When injected into the landing page this Silverlight file downloads (TCP stream 36) and executes the same encrypted portable executable: [MD5 72c2c343ebea67767de167aaf254a91d]. 

**syvwkahx581.jar**

The final exploit delivered was a Java JAR file that exploits CVE-2012-0507, a vulnerability in the Java Runtime Environment related to Concurrency. I didn't spend time on this exploit because it was requested by the landing page in tcp.stream 41, after the host was already compromised, reflected by the POST request in tcp.stream 38.

### **Stage 5: Installation**

Each of the exploits in this kit delivers the same portable executable, Punto Switcher MD5: 72c2c343ebea67767de167aaf254a91d. Googling Puntu Switcher reveals it is a questionably legitimate Russian software used to switch keyboard layout between languages. Analysis of this sample suggests that this software was hollowed and used to host malicious code.

Notable characteristics:
* Persistence
    * Copied itself to %TEMP%
    * Established with HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run
* Exfiltration
    * Upon execution this malware retrieves the following information from the target system:
        * select * from win32_SystemEnclosure
        * select * from win32_ComputerSystem
        * select * from win32_BaseBoardF
        * select * from win32_PhysicalMedia
        * select * from win32_DiskDrive
        * select * from win32_CDROMDrive 
        * select * from win32_OnBoardDevice
        * select Name, ExecutablePath from win32_Process
        * select * from win32_OperatingSystem
        * select * from win32_Processor
        * select * from win32_BIOS
        * select * from win32_VideoController
        * select * from win32_DisplayConfiguration
    * This data is encrypted with a low entropy cipher and submitted as an HTTP POST request to 209.239.112.229:80.
        * Data is given human readable headers such as "\n== Processes [0] ==\n"
        * Due to time constraints, my analysis did not yield the exact encryption routine however I believe this traffic is decryptable with the artifacts provided for the following reasons:
            * the traffic always starts with 0x6846
            * low entropy of traffic
            * the large number of matching bytes across multiple instances of the traffic

#### Clean up
Luckily, the C2 site (209.239.112.229) was down at the time of the incident and the command and control channel was not established with 38NTRGDFQKR-PC. 