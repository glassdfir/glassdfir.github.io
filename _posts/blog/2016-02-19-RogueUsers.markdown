---
layout: post
title:  "Dealing with users gone bad…"
date:   2017-02-03 14:52:28 -0500
categories: blog
---
We have all been there when someone that gets paid more than you do runs in and says “We need to remove User X from the network and lock them out of their PC to preserve evidence!!!”. If not, you will be.

So…aside from any 3rd party endpoint software you might have in that environment…what do you do? I have a list of steps, native Windows functions, that I have found helps eliminate avenues for User X’s continued use of ComputerX.

### 1. Disable User X’s Active Directory Account
This can be done in a number of ways but this post has a PowerShell tag so I recommend downloading Remote Server Administration Tools for your flavor of Windows if you don’t have it already. Then it is a simple matter of …
{% highlight powershell %} Disable-ADAccount -Identity "UserX" {% endhighlight %}
### 2. Delete All Cached Credentials
{% highlight powershell %}
$credential = Get-Credential -Credential "DOMAIN\adminacct"
Enter-PSSession -ComputerName ComputerX -Credential $credential
Set-ItemProperty -Path "HKLM:\Software\Microsoft\Windows NT\CurrentVersion\Winlogon" -Name CachedLogonsCount -Value 0
{% endhighlight %}
This will set the number of cached creds Windows is storing to 0 and erase the previous creds.
### 3. Change their BitLocker Key Remotely
{% highlight powershell %}
$BitLocker = Get-WmiObject -ComputerName ComputerX -Namespace "Root\cimv2\Security\MicrosoftVolumeEncryption" -Class "Win32_EncryptableVolume" -Filter "DriveLetter = 'C:'"
$VolumeKeyProtectorIDs = $BitLocker.GetKeyProtectors()|Select-Object VolumeKeyProtectorID
#Let's loop through all of the VolumeKeyProtectorIDs for the C Volume and delete them.
ForEach($ID in $VolumeKeyProtectorIDs){$BitLocker.DeleteKeyProtector($ID)}
#Now that all of the previous Protectors are gone, let's add our own.
#Let's add a new password that only the security team will need to know.
$BitLocker.ProtectKeyWithTPMAndPin("","","BrandNewPassword123")
#As a backup, let's also add a couple of recovery keys just in case noone can find the sticky note with the password.
$BitLocker.ProtectKeyWithNumericalPassword("Primary","555555-555555-555555-555555-555555-555555-555555-555555")
#Adding an additional optional recovery key might be helpful if you have more than one team that might need to gain access.
$BitLocker.ProtectKeyWithNumericalPassword("Secondary","050505-050505-050505-050505-050505-050505-050505-050505")
$BitLocker.EnableKeyProtectors()
{% endhighlight %}
This is a fun one. This will delete the user’s BitLocker key and save a new one that the user doesn’t know so they can’t unlock the drive after a reboot.
### 4. Shut down the remote system using any number of methods.
{% highlight powershell %}
#The nice way
Stop-Computer -computerName ComputerX -force
#Old school
shutdown -s -f -t 0 -m ComputerX
#The BSOD way
get-process -computername ComputerX| stop-process -force
{% endhighlight %}
This is not meant to be an exhaustive list but rather a collection of practical considerations. Lemme know if this helps or you have other suggestions.
