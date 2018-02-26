
---
layout: page
title:  Advanced DFIR Wizard Master Class
date:   2018-02-20 15:33:28 -0500
categories: course
---


## Welcome

Welcome to the Advanced DFIR Wizard Master Class
by Jonathan Glass
## Scope of this Course

In scope for this class:
* Hands on Tools, Tactics, and Techniques of DFIR
	* Computer Science for Incident Responders
	* Acquisition and Analysis of Windows artifacts
	* System Administration for Incident Responders
* Examples and Exercises
* Python and PowerShell

Out of scope for this class:
* The 4 Step Digital Forensics Process
* Legal crap
	* Federal Rules of Evidence
	* Chain of custody
	* 4th and 5th amendments
	* U.S. Statutory laws 
* Still important but learn it somewhere else.

## Course Overview
 1. Disclaimer
 2. Windows Remote Admin for Incident Responders
 3. Remote Acquisition of Windows Artifacts
 4. Computer Science for Incident Responders
 5. The Value of Unstructured Analysis
 6. Windows Disk Artifact Analysis
 7. Windows Memory Analysis
 8. Network Analysis
 9. Timelining for Fun and Profit

## Disclaimers

### You have to dig
As I built this course, I started realizing that perhaps the reader might not understand everything I am talking about. DFIR is not a field where everyone can know everything. It's just too wide and too deep. Attempting to define every term and provide background on all material would bloat this project beyond scope and diminish the value. If I didn't cover something, you might have to look it up. Searching for information is the crux of this job.
### I tried to keep it cheap
In an effort to limit barriers to education, I tried to limit the examples in this course to native, open source, or readily available free tools. If for some reason I mention a commercial tool, it's because it is worth documenting for completeness. You are going to need a Windows 7 or newer system to play with to put a lot of this to use. 
### Audience
I think this course is written for two groups of people:
 1. System Admins/Computer Enthusiasts who are trying to get into the exciting world of Digital Forensics and Incident Response.
 2. Folks that have been in Information Security in one capacity or another and are looking to get into more technical work.

This should not be the first computer related course you attempt.
### Omissions
There are two reasons I didn't include something in this course:
1. I didn't know about it. *It happens. Often.*
2. I thought you wouldn't immediately benefit from knowing it. This career field is deep, wide, and almost any fact about how things work can be refuted with an exception. This course is not designed to be extremely comprehensive, just helpful.

Either way, feel free to send me feedback and I will take a look.


## Windows Remote Admin for Incident Responders
Without a system administration background, many incident responders struggle with basic tasks like remotely starting and stopping processes on target machines. Inversely, Incident Responders with sysadmin experience are often faster and more effective. The more familiar you are with native Windows commands, the faster your can operate.

While this course cannot hope to supplant the experience gained by years at your average help desk, I will try to highlight some of the more helpful techniques that get me from A to B.

### Topics

 - WMI
 - MMC
 - PsExec

### WMI
One of the most practical skills you can have as a Windows Admin is an understanding of WMI. Windows Management Instrumentation (WMI) is the infrastructure for management data and operations on Windows-based operating systems. 

#### WMI Terminology

The four big vocabulary terms we are going to use for the section are:

 - Namespaces: A hierarchical structure of WMI objects used to organize Classes
 - Classes: A WMI Object that contains fun stuff like Properties and Methods
 - Property: Information that can be retrieved.
 - Method: Actions that can be taken.
 
For a much better explanation, I recommend: 
https://www.darkoperator.com/blog/2013/1/31/introduction-to-wmi-basics-with-powershell-part-1-what-it-is.html

#### WMI Example 
To get a list of all processes running on a workstation that match a certain name with process IDs, you could use something like this:

    SELECT processid,name FROM Win32_Process where name='powershell.exe'

|Term  | Value  |
|--|--|
|Namespace  | Isn't defined so the default (root\CIMV2) is assumed|
|Class|Win32_Process|
|Properties| processid and name|
|Methods|Not used because we are just listing process info|

#### WQL

WMI Query Language (WQL) is a bastardized version of SQL used to administer WMI. WQL is a deep dark rabbit hole of COM objects that I refuse to try to document but the main statements you need to know are **SELECT, FROM, and WHERE**. 

"WQL looks neat but where do I use it?" Great question!  WMI is accessible in a variety of flavors on modern Windows systems. You can leverage WQL with these handy native Windows solutions:
#### PowerShell

    $query = "SELECT processid,name FROM Win32_Process where name='powershell.exe'"
    Get-WmiObject -query $query

![enter image description here](https://lh3.googleusercontent.com/IIRGFU-WxaSc8t2x2vgiYOBehhRJ0OZOOO0i4bJHG2XzCbbIISqiGQooufJYFevt1vz53PZ-6aGk4hfefhKtVsS4q43W37TEGp7Iw1wwBTNrLcYYSvM_eA90YBi3QFYnFxHiOGkP1j56GZKfHRiAUiiJvYUzndCY2DrEVuho9g9Q_KJjkj_eS1JgqqoXdBhZabfVTy_H7_tweqEVnDYDsNuXQpQF7TlHmDcMwH-w_ANxgpJ--eYyDnNj5Mel_ugPeETBAwPF4SYXk0MDiMMDMbP6sOTAy7ypqZTFGg1aF777rnLZ4fN0apaExr16yzUnu5TtmcftvdeJ353T3vBuQxBWI6Y6T3Gi-09pqlxxLZyv4oSAwNYtHBRn2gdsT14_8CdRuTRWRhrI2yM0aAVcOnls3Lg8RytuqBAweKK_2uKohPtKn8rk6hkXtCr-LlO5HoPf7DA9NvP2OB0FDbbAuxEMgjvyxtDk-sS4__36CnP0xZ2wU3IokEd2eLdc2l3OqP6oPEuQQNZw2Y2iATrhBritOwTDW5RNPMFBuNy5dSZgzZbPm7VRBmBNv7oZQ3Jqi5prEfrvkrwDoCPlIwR3vsRquTgzRTP_oN9bDAo=w1370-h666-no "PowerShell WMI")
Reference: https://blogs.technet.microsoft.com/heyscriptingguy/2012/07/10/three-easy-ways-to-use-powershell-and-wql-to-get-wmi-data/
#### WMIC
The WMI command-line (WMIC) utility provides a command-line interface for WMI. WMIC is one of my favorite command line applications because it condenses a lot of the 

     wmic /node:computername process where (name = "cmd.exe") get processid,name

 ![WMIC Example](https://lh3.googleusercontent.com/PcQgG9vqn3LNRVLQ5E8-YbJlyeO_YJSKlrSUkrFrGJAJ22sghjxTBiLkWseUEjUhb64NQhI3JmZYfTAyzOb7YWJhg-Jkc9CMjvoI_YzFnWR7Vok-nQk6s9UF61gRtiDsOTmM-NcBSzKhBBVzmkni4CroEy0C99EgCbl9ImnnaztkAVpFu9mi-HPXT35ndIdyLH-sPci98TeGvK8kc-VfwV8qgnrHzIq9Eyxbkp5nz8y38cQdu7rmLlYbRGVX1F1L8FZlw1TzKjDUagAiC6edGw98yU0R_V5MalOuuGeJ40NWJRIQ4W3oY_TTDAuEWPFydHPnoJtzKfwVnBZQfmXmDSmpV06ruigv4M3HcECacwFazm-2nu29QXHyVgyoQv-vf2yq__NtDAGLV3bFDW0EPvtHh-tIK4w11v4iY_j7rka9qptRDCtGNNqUTbg576qChhyGnF5CdEQTq8Nz4IDG4PENDWvN3V7a03Jf_GmCL-Gb_UD0hKlR5LQg5tmMqKMwavjIV4mZn5mac1PBh50Okc_Pj0Dv7KQMamH7cVwxk-cogA7cuJMp-toAdCaqZWee6QUC4Yf297cv9lD7YI9dFhkQ28aoXhuNtPvzjhA=w1398-h470-no "WMIC")
References: 
https://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
http://jon.glass/blog/lists-some-wmic-commands/


#### Visual Basic Scripting Example (more or less deprecated)

    strComputer = "."
    Set objWMIService = GetObject("winmgmts:\\" & strComputer & "\root\CIMV2")
    Set colItems = objWMIService.ExecQuery( _"SELECT * FROM Win32_Process WHERE name=’cscript.exe’",,48)
    For Each objItem in colItems
        Wscript.Echo "Name: " & objItem.Name
        Wscript.Echo "ProcessId: " & objItem.ProcessId
    Next

While VBS is not my first choice, it is good to at least be aware of it because it is still very much in use by admins and attackers alike. 

Depending on what 3rd party tools you have in your environment you might be able to utilize these:
#### Python
The Python WMI module is a lightweight wrapper on top of the pywin32 extensions.

    import wmi
    c = wmi.WMI ()
    for s in c.Win32_Process ():
	    if s.Name == "python.exe":
		    print(s.Name, s.ProcessID)

#### BigFix Relevance

You might not have this in your environment but many companies have clients on endpoints that are designed for system administration or patching that can to utilized to perform incident response functions as well. This is especially true in SMBs where the security guy is also the patching and sysadmin team. 

    (selects "processid,name from Win32_Process where name = 'explorer.exe'" of wmi)

![enter image description here](https://lh3.googleusercontent.com/V08obkAb126reJMrLmqptWgKYIU0HpIcfYJdxdy4Indpl7g5GUhf80584brJNQmLbDMrIfd5CPGdDmqZyMZEgFBNa7r4mRjFtbOqzJw7Upi0XDUzi9bp02wmWaXeY724oWnjy9RcGQYixmqWSzcYE75yyN4r_Rx95Fnnarltu5Ejr3goSx_6YWasGywL-eMVW6ODCncJgfYvCJO9qCojaQB60gAqleTXnt0wD6LpGw-vkaxjILWBvhapK38s8G3wSJKMHC0QcngbHiBp4wrPMAhma4y9QCFLsUe97e_3K3VX__g1-Fi2F-z0stiF9K0rbeshhDxe-bV7pb8WtnugyHrKsUyng_P52HhRqI4jd5SkbBAEvdcgULOEpfGpVVacSbPjWdLj7lmtb-So0aKMjEaFTw5fAbVdYhEeQDdP1h5w4w2YL8DZqZwK8exc8djEv4gHYZZBCjWhTAme6doPr90nYIAr9_r1wXVWr0OJqRGmItCRFY6JGhtZO35scbrz2JBDuYtaep87eHgmRE1CkyJI0SBpiY7t5b_qSi3fpexye-Wjw8tBJQXfCw9BqJXUtLSOg7KeflkxgnbJBBgbq3OX9eUHI-yibHqX3yQ=w713-h369-no "BigFix WMI Relevance")

#### WMI classes of DFIR interest
 There is a lot of super geeky DFIR information you can pull out of WMI properties and methods that can give you wizard like powers over remote machines. Here are a few of my favorites :

| Class         | Properties         |Methods |
|---------------|-----------------|----|
| Win32_Process | CommandLine CreationDate Description ExecutablePath Name OSName ParentProcessId ProcessId SessionId |AttachDebugger Create GetOwner GetOwnerSid Terminate|
|Win32_Service|  Description DisplayName InstallDate Name PathName ProcessId ServiceType Started StartMode StartName State Status | Change ChangeStartMode Create Delete PauseService ResumeService StartService StopService |
|Win32_LogonSession |  AuthenticationPackage Description InstallDate LogonId LogonType Name StartTime Status|N/A |
|Win32_NetworkLoginProfile|AccountExpires BadPasswordCount Description FullName LastLogoff LastLogon LogonServer Name NumberOfLogons PasswordAge PasswordExpires PrimaryGroupId Privileges Profile UserId UserType |N/A|
|Win32_LogicalDisk|BlockSize Description DeviceID DriveType FileSystem FreeSpace MediaType Name Size VolumeName VolumeSerialNumber|Chkdsk Reset SetPowerState|
|Win32_StartupCommand|Caption Command Description Location Name SettingID User UserSID|N/A|
|Win32_OperatingSystem|BootDevice BuildNumber CurrentTimeZone InstallDate LastBootUpTime LocalDateTime Locale Manufacturer Name NumberOfProcesses NumberOfUsers Organization OSArchitecture OSType SerialNumber ServicePackMajorVersion ServicePackMinorVersion SystemDrive| Reboot SetDateTime Shutdown|

#### Putting It To Work

Scenario: Your detection team says a user on RemoteComputerName received a malicious Word document that downloads a Remote Access Trojan that your antivirus doesn't have a signature for. From your threat intelligence, this malicious Word document uses a macro to drop an EvilFile.exe in the users Temp directory.

Let's verify the alert..maybe the user didn't open the Word doc...(yeah right)

    wmic /node:RemoteComputerName process where (name like '%scchost.exe%') get executablepath,processid,parentprocessid /format:list
        ExecutablePath=C:\Users\Username\AppData\Local\Temp\Scchost.EXE
        ParentProcessId=1040
        ProcessId=3712

Crap. Looks like the user might have clicked on it. Let's verify that parent process just to be sure:

    wmic /node:RemoteComputerName process where (ProcessId = 1040) get executablepath /format:list
        ExecutablePath=C:\Program Files\Microsoft Office\Office16\WINWORD.EXE

Double crap. Looks like this is a confirmed compromise of a workstation. 
For fun and containment, let's kill that malicious process using a WMI method:

    wmic /node:RemoteComputerName process where (name ='Scchost.exe') CALL Terminate
    Executing (\\RemoteComputerName\ROOT\CIMV2:Win32_Process.Handle="3712")->Terminate()
    Method execution successful.
    Out Parameters:
    instance of __PARAMETERS
    {
            ReturnValue = 0;
    };

For even MORE fun, like copy that malicious file to an analysis share so we can get a better look at it:

    wmic /node:RemoteComputerName process call create "xcopy  /Y C:\Users\Username\AppData\Local\Temp\Scchost.EXE \\AnalysisShare\Scchost.exe.bin" 

For a lot less fun, let's call the User explain the situation, shut it down remotely, and go get the workstation to determine what this malware did :

    wmic /node:RemoteComputerName os call Shutdown
*Disclaimer: This scenario is largely BS. Malware isn't usually this easy to kill and as more work becomes remote, it is increasingly rare to physically walk over to the user's cube and take their workstation.*

### MMC
I imagine I scared some of off you with all that "coding" and "command line stuff". While there are GUIer options to accomplish Windows administration tasks, they aren't as efficient or sexy. If you are against coding all together, there is an X at the top right or left of your browser. We can part ways now and no one's feelings need to get hurt. For the sake of completeness, I will cover MMC which is a GUI and can do Windows admin tasks but it is not my "go to".
According to the big M, the Microsoft Management Console (MMC) is an extensible common presentation service for management applications.
![MMC](https://lh3.googleusercontent.com/NanubjKU20LumPPeCb6u6DjOVIGuCPbKk6JfZMIW83MBlv0GKKCfLgELQ_CzwY2V6J_1FPLSXx1CzkDIn4I1X-_ph_Tccf9xwRfQ1dVilCaIQMD9hk7JLFoekVDj_9ubwqyr0vaMZthJ2U7bE-MPPKLsDsDUJ_1ipSI6X-VDIWelsgWgqwoD9eGUG7hlbW-m3Oe0uIQs4GdRkhvwAZVWGEboSzGax6r5ElU_zPpXora44uC4uDusr1vb-ta_RDsnVt4fREUI82y0GH4D_aEUntSAYbzcJbZ_etRhjpsfX5nJyDrjzTTzo2u_KOT-Sp7KV_bRrwSwZC_TSGtB-OyPk0GtfJT9Se6tSP7EQsFcbS5uFjz_5VjNleTYk0IzKoFlEoinX5aOhY2D0yn0-iLLCMIz8UhkJkTZpOfo99sRDy8iw145qrh6NouhLkIyV1pAMqixLULH2MEWvT_a0J7dOMlUNFZh_J-Z39wIx3ems3L6BLxvmcT2TP2wAG9ALAO6FxLZrZKbPjmsYED7WqwbdklHglIMV9uQMuSH6ir_wRdzdz6Y-b1rNbHFa8XCSbxGhoHVeTVP9KNWhf4X-OelK1YJ4TgPs4gdiZ9FtU8=w2320-h1418-no "MMC")

This console gives you access to some a lot of administration tools.
 - Computer Management Snap-In
	 - System Tools
		 - Task Scheduler
			 - Good for running processes remotely, shutting down workstations, and whatnot
		 - Event Viewer
			 - Good for remotely viewing logs but not great
		 - Local Users and Groups
			 - Good for administering local user accounts
		 - Device Manager
			 - Handy when you need to see if a USB is plugged in
	 - Storage
		 - Disk Management
			 - Also handy for seeing if external media is plugged in
	 - Services and Applications
		 - Services
		 - Allows for administration of Windows services. (start, pause, stop)
		 
I don't use this much for IR but if you are in an environment where you don't have any other tools, this is a native GUI solution that might get you where you need to go.

### PsTools

Way way way back in 1996, Mark Russinovich and Bryce Cogswell created a little company called Winternals Software LP that created a bunch of software to help administer Windows 2000 boxes. Long story short...in 2006 Microsoft bought the company and all their tools now known as [Windows Sysinternals](https://docs.microsoft.com/en-us/sysinternals/). There is a cornucopia of awesome tools that I will mention throughout the duration of this course but for now we are going to focus on some of the PsTools Suite I find most handy. While you can accomplish all of these functions via WMI via PowerShell or WMIC, these tools are helpful for those who prefer tools with a dedicated tasks and help menus. While there is absolutely no shame in that, the more comfortable you become with WMI scripting, the less you will need this suite.

#### Windows Admin using PsTools Suite
|Tool|Purpose|
|--|--|
|[PsExec](https://docs.microsoft.com/en-us/sysinternals/downloads/psexec) | execute processes remotely|
|[PsKill](https://docs.microsoft.com/en-us/sysinternals/downloads/pskill)|kill processes by name or process ID|
|[PsList](https://docs.microsoft.com/en-us/sysinternals/downloads/pslist)|list detailed information about processes|
|[PsLoggedOn](https://docs.microsoft.com/en-us/sysinternals/downloads/psloggedon)|see who's logged on locally and via resource sharing (full source is included)|
|[PsService](https://docs.microsoft.com/en-us/sysinternals/downloads/psservice)|view and control services|
|[PsShutdown](https://docs.microsoft.com/en-us/sysinternals/downloads/psshutdown)|shuts down and optionally reboots a computer|

#### PsExec
From [Microsoft](https://docs.microsoft.com/en-us/sysinternals/downloads/psexec) 

> "PsExec is a light-weight application that lets you execute processes
> on other systems, complete with full interactivity for console
> applications, without having to manually install client software.
> PsExec's most powerful uses include launching interactive
> command-prompts on remote systems and remote-enabling tools like
> IpConfig that otherwise do not have the ability to show information
> about remote systems."

PsExec is to DFIR as a good blaster is to Han Solo.  I can't tell you how many times PsExec has saved my bacon. Not to mention how many times I have pulled off some nifty DFIRfu with it's various options. Everytime I read PsExec's Usage I learn something new that it does.



##### Example: Elevating to System Account:
One of my favorite tricks is to run remote processes as the System account and not a puny User account as seen below:
![PsExec As System](https://lh3.googleusercontent.com/4-ZH1TrrQnf95Lku4Nkxs1fyJ3N4ZztMg5jfmNHiGbMpCJn8hNj2mMSk3X8efsZ4m6N8_WRzsK8uneUtxdO76eTLQTKLz58vC-FY1wpVoGcVkTalEUngYDjZjoEy6yXshejM8rVmqkhsDHMISqAycVlM54BUNPUh5KGR4jjuqGiBiRLlXhJhF5zEvjGRErZjcV7mWL-B4nEyWaCCngUyawLFXZ0m5G_lXBIFJoxxL-RwxwgFjIPZKT89is13pXGBcQ0VwecPhelabM7oezdQhbQ2gBLkZ6wXDUD0Kh0Q4TqbFMOOwYPHyEdpu62bILZ5R5ffQASlVA2krJjS-PFArzREuKsWkl-RqBP3RoN6yZNltWfGXO2qqFctGMdkgA19Bq7tcrN7C1KEBgDez6EaxzeQoeMBD8PXNcavGmly5zPKWx-_TLPk-xDChRL_c2uztTg5hsq_bizOMA8TnLfJLHGL1LkWINdIcAFO8EstoTdUbUL5JdJeYnublDODahz7f_O8_PDYAFM9B-J7I3hD5MNTKCbBcJPhly_ZrdogRZMW3lEKVhKX9y4rMhSXHCwmZEtiapGwM5IaW7ra6aQrKZF2jtKxWJH-FHnRK_Q=w1838-h1166-no)
This grants a higher level of privileges and leaves less of a footprint on the remote machine. I rarely want to use my own account for anything on a remote machine unless I have to.

Pro Tip: If you are copying evidence from a remote machine to a collection share using PsExec to run as the system account, make sure the share is configured to grant Computer account of the target workstation write permission or you will get errors that will run you in circles. Doesn't matter if your admin account has rights if you are running as the Computer.
##### Example: Copying an Utility and then Executing it on a Remote System :
![enter image description here](https://lh3.googleusercontent.com/ZPd6AStp5u_lruM30KfgYdvGJ1Wp9Xt9FKVVjD7lFVxzjdI95J5VHxkyDm8nT8oK7QEmBMC1n8hA7Y_PdS0kXl1A5cHyISJu9TE0zXIGU_8UZnFwQRl3TRR5nb1AyHY8BYkSJ1vt1lkZ0drKnX_yOzfP4nHWH-8s172KGyXt7VBSjeUArt8ojLApFtv_GRTGOgFKoIHsgrMDqn7jkFxmG6ON7q6njCRJSQCkpN6MTAUDVC_fW5kqQ-ET5682L9kBo1FRWT0pmqOYHwR5Q-L5xMSHr5rqdzgIvZ2wIH6TSmAD91642EJK9RcIBx4BjnLZS0BVdhhQ7XAZ6h8gLgeXvx26dGVowG-Tg5DnqwnDfl9zNCpxyQxol3QjbrXKt-9scBl3qxIKgPk95Adg6JtMJd5LjU4K0BE3RJNeYo35R_0279mbjrC6SuJgD2JneRYAnQgn-vhJDFp80wWVgYSoLRIVXc1vzGq1I_SYfIVdNi3zt0OzaGv5VX5d32odlRTFOVvAgYWaxF9Zb7d1HWVplv83bJ-CSytt62qTu3ZYUs-ixoo_aHvflb_bTdjekUsCMpWdjfBezwyJfSk-qDUn6BytQVVZF7CYO2u-PtI=w2068-h1020-no)

    PsExec.exe \\192.168.164.130 -c RawCopy.exe /FileNamePath:C:0 /OutputPath:\\ForensicServer\dropbox\ /OutputName:$MFT

There is a lot going on in this example so let's break it down...

 - I am using PsExec to remotely execute RawCopy on a remote host with an IP of 192.168.164.130. 
 - Since the remote host probably doesn't have RawCopy, a third party tool, laying around, I used the **-c** flag to copy the program over to the remote system. The **-f** flag is used just in case it was already there so we can overwrite it.
 - RawCopy's options are fairly straightforward. I am copying the Master File Table (record 0) from C:\\$MFT on the remote machine to  my \\\ForensicServer\\dropbox share for analysis
 - After RawCopy finished, I check my dropbox folder to confirm the $MFT landed safely.

##### Example: Interacting with the User:
Pro Tip: PsExec runs a console session by default but can be configured to interact with the logged on user's session using the -i option. This is helpful in those rare instances where you need to user to see something you are doing. 99% of the time the user is going to be logged in under the second session or session 1. It's not often but I have used this a couple times over the years.

<!--stackedit_data:
eyJoaXN0b3J5IjpbNzcwOTk1MjY5XX0=
-->