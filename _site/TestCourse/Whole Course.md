---


---

<h2 id="welcome">Welcome</h2>
<p>Welcome to the Advanced DFIR Wizard Master Class<br>
by Jonathan Glass</p>
<h2 id="scope-of-this-course">Scope of this Course</h2>
<p>In scope for this class:</p>
<ul>
<li>Hands on Tools, Tactics, and Techniques of DFIR
<ul>
<li>Computer Science for Incident Responders</li>
<li>Acquisition and Analysis of Windows artifacts</li>
<li>System Administration for Incident Responders</li>
</ul>
</li>
<li>Examples and Exercises</li>
<li>Python and PowerShell</li>
</ul>
<p>Out of scope for this class:</p>
<ul>
<li>The 4 Step Digital Forensics Process</li>
<li>Legal crap
<ul>
<li>Federal Rules of Evidence</li>
<li>Chain of custody</li>
<li>4th and 5th amendments</li>
<li>U.S. Statutory laws</li>
</ul>
</li>
<li>Still important but learn it somewhere else.</li>
</ul>
<h2 id="course-overview">Course Overview</h2>
<ol>
<li>Disclaimer</li>
<li>Windows Admin for Incident Responders</li>
<li>Remote Acquisition of Windows Artifacts</li>
<li>Computer Science for Incident Responders</li>
<li>The Value of Unstructured Analysis</li>
<li>Windows Disk Artifact Analysis</li>
<li>Windows Memory Analysis</li>
<li>Timelining for Fun and Profit</li>
</ol>
<h2 id="disclaimers">Disclaimers</h2>
<h3 id="you-have-to-dig">You have to dig</h3>
<p>As I built this course, I started realizing that perhaps the reader might not understand everything I am talking about. DFIR is not a field where everyone can know everything. It’s just too wide and too deep. Attempting to define every term and provide background on all material would bloat this project beyond scope and diminish the value. If I didn’t cover something, you might have to look it up. Searching for information is the crux of this job.</p>
<h3 id="i-tried-to-keep-it-cheap">I tried to keep it cheap</h3>
<p>In an effort to limit barriers to education, I tried to limit the examples in this course to native, open source, or readily available free tools. If for some reason I mention a commercial tool, it’s because it is worth documenting for completeness. You are going to need a Windows 7 or newer system to play with to put a lot of this to use.</p>
<h3 id="audience">Audience</h3>
<p>I think this course is written for two groups of people:</p>
<ol>
<li>System Admins/Computer Enthusiasts who are trying to get into the exciting world of Digital Forensics and Incident Response.</li>
<li>Folks that have been in Information Security in one capacity or another and are looking to get into more technical work.</li>
</ol>
<p>This should not be the first computer related course you attempt.</p>
<h3 id="omissions">Omissions</h3>
<p>There are two reasons I didn’t include something in this course:</p>
<ol>
<li>I didn’t know about it. <em>It happens. Often.</em></li>
<li>I thought you wouldn’t immediately benefit from know it.</li>
</ol>
<p>Either way, feel free to send me feedback and I will take a look.</p>
<h2 id="windows-admin-for-incident-responders">Windows Admin for Incident Responders</h2>
<p>Without a system administration background, many incident responders struggle with basic tasks. Inversely, Incident Responders with sysadmin experience are often faster and more effective. The more familiar you are with native Windows commands, the faster your can operate.</p>
<p>While this course cannot hope to supplant the experience gained by years at your average help desk, I will try to highlight some of the more helpful techniques that get me from A &gt; B.</p>
<h3 id="wmi">WMI</h3>
<p>Windows Management Instrumentation (WMI) is the infrastructure for management data and operations on Windows-based operating systems.<br>
WMI is accessible in a variety of flavors on modern Windows systems.  WMI Query Language (WQL) is a bastardized version of SQL used to administer WMI. This is a deep dark rabbit hole of COM objects that I refuse to try to document but the main statements you need to know are <strong>SELECT, FROM, and WHERE</strong>.</p>
<p>Example:<br>
To get a list of all powershell instances running on a workstation with process IDs, you could use something like this:</p>
<pre><code>SELECT processid,name FROM Win32_Process where name='powershell.exe'
</code></pre>
<p>WQL looks neat but where do I use it? Great question!<br>
You can leverage WQL with these handy native solutions:</p>
<ul>
<li>PowerShell</li>
</ul>
<p>$query = "SELECT processid,name FROM Win32_Process where name=‘powershell.exe’"<br>
Get-WmiObject -query $query</p>
<p><img src="https://lh3.googleusercontent.com/W2YwSbJPP5ZRd79J3mP9H_ZqiybcoQwrkN_x1mR_3ZS_swhaH8ri8_pvTNPVMZ27huGsNO2uA2pH" alt="enter image description here" title="PowerShell WMI"><br>
Reference: <a href="https://blogs.technet.microsoft.com/heyscriptingguy/2012/07/10/three-easy-ways-to-use-powershell-and-wql-to-get-wmi-data/">https://blogs.technet.microsoft.com/heyscriptingguy/2012/07/10/three-easy-ways-to-use-powershell-and-wql-to-get-wmi-data/</a></p>
<ul>
<li>
<p>WMIC</p>
<p>wmic process where (name = “cmd.exe”) get processid,name</p>
</li>
</ul>
<p><img src="https://lh3.googleusercontent.com/uyxzXKI-aGm7aV7z4dSCphLneWEmEWAILGnnJ5QNbFijiOEyAVtpDLWpse4bCuQw7b6sEuTR5iFv" alt="enter image description here" title="WMIC"></p>
<ul>
<li>
<p>Visual Basic Scripting (more or less deprecated)</p>
<p>strComputer = "."<br>
Set objWMIService = GetObject(“winmgmts:\” &amp; strComputer &amp; “\root\CIMV2”)<br>
Set colItems = objWMIService.ExecQuery( _“SELECT * FROM Win32_Process WHERE name=’cscript.exe’”,48)<br>
For Each objItem in colItems<br>
Wscript.Echo "Name: " &amp; <a href="http://objItem.Name">objItem.Name</a><br>
Wscript.Echo "ProcessId: " &amp; objItem.ProcessId<br>
Next</p>
</li>
</ul>
<p>Depending on what 3rd party tools you have in your environment you might be able to utilize these:<br>
Python<br>
BigFix Relevance</p>
<pre><code>(selects "processid,name from Win32_Process where name = 'explorer.exe'" of wmi)
</code></pre>
<p><img src="https://lh3.googleusercontent.com/WrEf_EacizTtvxfYBGPqP9Y3vuzrbgC88tEvFoc7_83-_LOIuIk8Vi8A8iym3lZWmhp6UQBZGeC1" alt="enter image description here" title="BigFix WMI Relevance"></p>

