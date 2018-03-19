---
layout: post
title:  Twas the Grep before Christmas
date:   2016-12-27 15:33:28 -0500
categories: blog
---

Sometimes when it rains, it pours. It was 3pm on Christmas Eve and I was mentally out the door and half way home already when proxy alerts came in for a known malicious file (for the sake of this blog will be referred to as “malicious.exe”) hitting a handful of endpoints. Here are a couple of tricks I used to get out of the door by 4:15pm.

I use a tool that pulls back a targeted logical disk image from remote machines for my triage effort. So as you read this it is probably easier to think in terms of forensic disk analysis rather than incident response.

I saw numerous requests for malicious.exe from each machine in the proxy logs. From the surrounding traffic it was more consistent with drive by redirect to a watering hole than anything a user clicked on.

So I mounted the disk images from the 4 machines to C:\Cases and here is how I quickly triaged the extent of compromise:
**C:\Cases> strings -s | grep malicious.exe** 
Here is what I got back:
## Machine One
```
C:\Cases\Machine1\C\Users\User1\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine1\C\Users\User1\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: malicious.exe
C:\Cases\Machine1\C\Users\User1\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine1\C\Users\User1\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: malicious.exe
C:\Cases\Machine1\C\Users\User1\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
```

So for this first machine the only mention of malicious.exe was found in the Internet Explorer 11 history. Upon further investigation, it turns out that the user cancelled all of the download attempts and the malware never hit the filesystem. NEXT!

## Machine 2
```
C:\Cases\Machine2\C\$MFT: malicious.exe
C:\Cases\Machine2\C\$MFT: http://static.evilsite.com/malicious.exe');
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.3l98fuk.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.3l98fuk.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.3l98fuk.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.3l98fuk.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.3l98fuk.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.3l98fuk.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.3l98fuk.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.3l98fuk.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.3l98fuk.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.3l98fuk.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.sx2afu8.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.sx2afu8.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.sx2afu8.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.sx2afu8.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.sx2afu8.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.sx2afu8.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.sx2afu8.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.sx2afu8.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.sx2afu8.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.trtsnvz.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.trtsnvz.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.trtsnvz.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.trtsnvz.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.trtsnvz.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.trtsnvz.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.trtsnvz.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.trtsnvz.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: N<malicious.exe.trtsnvz.partial
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\$Extend\$UsnJrnl-$J: .<malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: C:\Users\User2\AppData\Local\Microsoft\Windows\Temporary Internet Files\Content.IE5\LV4JKIUX\malicious.exe.3l98fuk.partial
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: C:\Users\User2\AppData\Local\Microsoft\Windows\Temporary Internet Files\Content.IE5\LV4JKIUX\malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: C:\Users\User2\AppData\Local\Microsoft\Windows\Temporary Internet Files\Content.IE5\B5LEVBSY\malicious.exe.sx2afu8.partial
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: C:\Users\User2\AppData\Local\Microsoft\Windows\Temporary Internet Files\Content.IE5\B5LEVBSY\malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: C:\Users\User2\AppData\Local\Microsoft\Windows\Temporary Internet Files\Content.IE5\LV4JKIUX\malicious.exe.trtsnvz.partial
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: C:\Users\User2\AppData\Local\Microsoft\Windows\Temporary Internet Files\Content.IE5\LV4JKIUX\malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine2\C\Users\User2\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
```

Looks like Machine2 was not so lucky. My 30 second analysis on this data tells me:
1. There is an $MFT record for malicious.exe. This means it successfully downloaded and found a home in the FS. Also it looks like there is a small file in the $MFT that contains that filename. Looking at the tail end of the string it looks like javascript. This makes for a great IOC.
2. I see numerous records in the $UsnJrnl-$J that can most likely be attributed to Internet Explorer attempting to download the malware 3 times before the user said “Ok” and allowed the download. IE creates a “filename.randomstring.partial” file for downloading files. Once the download is complete and everything checks out it renames the file to filename.exe. Here I see malicious.exe.3l98fuk.partial, malicious.exe.sx2afu8.partial, malicious.exe.trtsnvz.partial. There are also a number of USNJrnl-$J records for just malicious.exe. While most of these could be associated with the changes in file size during download and/or the file rename, it is enough of a red flag to pull this box from the network and move on.
3. While I pulled the box off the network, it was mostly to err on the side of caution. I really only see the malicious.exe in the IE WebhistoryV01.dat but no files that screams “execution”. No prefetch, no user or system registry hits, no shortcut files, and no hits in event logs. Again, this is my 30 second analysis (I still had presents to wrap).
4. This machine validated what my findings from the first machine. This exhibits signs of hitting the file system; Machine1 did not.
NEXT!

## Machine 3

```
C:\Cases\Machine3\C\$MFT: http://static.evilsite.com/malicious.exe');
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B3.log: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat: http://static.evilsite.com/malicious.exe
```

Much like Machine1, Machine3 shows very little filesystem activity. The only files that contain the “malicious.exe” file name are:
- C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\V01001B0.log
- C:\Cases\Machine3\C\Users\User3\AppData\Local\Microsoft\Windows\WebCache\WebCacheV01.dat

NEXT!

## Machine 4
```
C:\Cases\Machine4\C\Users\User4\AppData\Roaming\Google\Chrome\User Data\Default\History: malicious.exe
C:\Cases\Machine4\C\Users\User4\AppData\Roaming\Google\Chrome\User Data\Default\History: malicious.exe
C:\Cases\Machine4\C\Users\User4\AppData\Roaming\Google\Chrome\User Data\Default\History: malicious.exe
C:\Cases\Machine4\C\Users\User4\AppData\Roaming\Google\Chrome\User Data\Default\History: malicious.exe
```

This user had Chrome setup as the default browser and the only place in the collected evidence that we see the malware’s filename is in the Chrome History file. I decided to crack it open and get some better definition on what happened.

![Chome Error Code](http://jon.glass/images/Screen-Shot-2016-01-02-at-7.01.48-PM-1024x165.png)

1. First things first…Chrome didn’t log current or target path for the malware. This means the download wasn’t written to disk. Great but how?
2. The interrupt_reason is populated with code 40. A quick look at a copy of the Chromium source code reveals what happened:
```
// The user canceled the download.
// "Canceled".
INTERRUPT_REASON(USER_CANCELED, 40)
```
3. No end time for the download because the user cancelled it.
4. Finally, the malware wasn’t opened because because the user cancelled it.

Now before I catch a lot of flack for not being thorough enough, this malware has well established behavior patterns that are easy to check for. Using the SysInternals version of strings checks for unicode and ascii strings at the same time which offers the best avenue of finding evidence of the filename on disk. Even from this small sample of workstations, we can quickly see how far a malicious file has penetrated a file system and determine the extent of compromise.

Does this technique work for all malware? No but it is a great start.