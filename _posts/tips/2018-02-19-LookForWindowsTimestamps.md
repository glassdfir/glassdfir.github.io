---
layout: post
title:  Remotely Change BitLocker Protections
date:   2018-02-30 15:33:28 -0500
categories: tips
---

I did some reverse engineering of 3rd party software in a client environment and wrote this script to help  determine how they logged events.


{% highlight python %}
import struct, time, os, sys
def conv_time(l, h):
   d = 116444736000000000L 
   if l + h > 0:
       newTime = (((long(h) << 32) + long(l)) - d)/10000000  
   else:
       newTime = 0
   #if the datestamp happens between Jan 1 2000 and now.
   if newTime <= time.time() and newTime >= 946684800:
       return time.strftime("%Y/%m/%d %H:%M:%S", time.localtime(newTime))
   else:
       return 0
with open(sys.argv[1],'rb') as FileData:
   buffer = 1024 * 1024
   rawdata = " "
   offset = 0
   chunkoffset = 0
   while rawdata:
       rawdata = FileData.read(buffer) # Read the entire file into memory
       x = 0  # Count the number of timestamps
       
       chunkoffset += offset
       offset += len(rawdata)
       for i in range(len(rawdata)):
           possible_timestamp = rawdata[i:i+8]
           try: #Try to format these 8 bytes as a timestamp
               formatted_timestamp = conv_time(struct.unpack("<L",possible_timestamp[0:4])[0],
                                               struct.unpack("<L",possible_timestamp[4:8])[0])
               if formatted_timestamp:
                   print "Offset", int(chunkoffset + i), "Timestamp", x, formatted_timestamp
                   x += 1 # add one to the timestamp count
           except: # Something broke...
               continue # Try the next 8 bytes


{% endhighlight%}