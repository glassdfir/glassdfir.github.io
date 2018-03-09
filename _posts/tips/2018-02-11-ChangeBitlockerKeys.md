---
layout: post
title:  Remotely Change BitLocker Protections
date:   2018-02-20 15:33:28 -0500
categories: tips
---

{% highlight powershell %}
#Delete existing protections
manage-bde.exe -cn ComputerName -protectors -delete c: -Type TPMAndPIN
manage-bde.exe -cn ComputerName -protectors -delete c: -Type RecoveryPassword
#Now that all of the previous Protectors are gone, let's add our own.
#Let's add a new password that only the security team will need to know.
manage-bde.exe -cn ComputerName -protectors -add c: -TPMandPIN SuperDuperPassword
#As a backup, let's also add a couple of recovery keys just in case noone can find the sticky note with the password.
manage-bde.exe -cn ComputerName -protectors -add c: -RecoveryPassword 111111-111111-111111-111111-111111-111111-111111-111111 
manage-bde.exe -cn ComputerName -protectors -add c: -RecoveryPassword 222222-222222-222222-222222-222222-222222-222222-222222 
manage-bde.exe -cn ComputerName -on c:
{% endhighlight %}