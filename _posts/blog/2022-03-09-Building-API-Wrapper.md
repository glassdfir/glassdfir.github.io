---
layout: post
title:  "Microsoft 365 Security: Building a quick API wrapper"
date:   2022-03-09 12:33:28 -0500
categories: [blog, M365]
---

## Building a Wrapper for MDE interactions

My goal here is to reduce the amount of redundant code needed to query Microsoft Defender for Endpoint. This is not fault tolerent or comprehensive. Just something quick to save keystrokes.
This is a continuation of the previous post. 


```python
def MDErequest(uri, data="", token=result["access_token"]):
    headers = { 
    'Content-Type' : 'application/json',
    'Accept' : 'application/json',
    'Authorization' : "Bearer " + token
    }
    url = "https://api.securitycenter.windows.com/api/%s" % (uri)

    if data:
        response = requests.post(url, json=data, headers=headers, verify=False)
    else:
        response = requests.get(url, headers=headers, verify=False)
    return response.json()
```
## Using the API to Review MDE Alerts


```python
queryResponse = MDErequest("alerts")
queryResponse['value']
```

    [{'id': 'da637821323029223838_-1136569686',
      'incidentId': 1,
      'investigationId': None,
      'assignedTo': None,
      'severity': 'Informational',
      'status': 'New',
      'classification': None,
      'determination': None,
      'investigationState': 'UnsupportedOs',
      'detectionSource': 'WindowsDefenderAtp',
      'detectorId': '22222222-2222-2222-2222-222222222222',
      'category': 'Execution',
      'threatFamilyName': None,
      'title': '[Test Alert] Suspicious Powershell commandline',
      'description': ' This is a test alert \nA suspicious Powershell commandline was found on the machine. This commandline might be used during installation, exploration, or in some cases with lateral movement activities which are used by attackers to invoke modules, download external payloads, and get more information about the system. Attackers usually use Powershell to bypass security protection mechanisms by executing their payload in memory without touching the disk and leaving any trace.',
      'alertCreationTime': '2022-03-06T02:58:22.9224109Z',
      'firstEventTime': '2022-03-06T02:40:56.1886556Z',
      'lastEventTime': '2022-03-06T02:40:56.1886556Z',
      'lastUpdateTime': '2022-03-06T02:58:24.0466667Z',
      'resolvedTime': None,
      'machineId': 'c6993a6c004246bf52d2d59237c18e6db4db7e5e',
      'computerDnsName': 'desktop-l3mnbj9',
      'rbacGroupName': None,
      'aadTenantId': '11111111-1111-1111-1111-111111111111',
      'threatName': None,
      'mitreTechniques': ['T1059.001'],
      'relatedUser': {'userName': 'Glass', 'domainName': 'DESKTOP-L3MNBJ9'},
      'loggedOnUsers': [{'accountName': 'Glass', 'domainName': 'DESKTOP-L3MNBJ9'}],
      'comments': [],
      'evidence': []}]

## Using the API to do Advanced Threat Hunting
```python
query = {'Query' :"""DeviceProcessEvents | where InitiatingProcessFileName =~ \"powershell.exe\"
           | project Timestamp, FileName, InitiatingProcessCommandLine 
           | order by Timestamp desc 
           | limit 1""" }
queryResponse = MDErequest("advancedqueries/run", query)
queryResponse['Results']
```

    [{'Timestamp': '2022-03-10T14:03:13.1151059Z',
      'FileName': 'WerFault.exe',
      'InitiatingProcessCommandLine': 'powershell.exe -ExecutionPolicy AllSigned -NoProfile -NonInteractive -Command "& {$OutputEncoding = [Console]::OutputEncoding =[System.Text.Encoding]::UTF8;$scriptFileStream = [System.IO.File]::Open(\'C:\\ProgramData\\Microsoft\\Windows Defender Advanced Threat Protection\\DataCollection\\8099.7011103.0.7008675-77a99c323dc18f055614eedeb6e307c388905ec9\\0e3d6d2d-06cc-486d-9465-9ef3bee75444.ps1\', [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::Read);$calculatedHash = Get-FileHash \'C:\\ProgramData\\Microsoft\\Windows Defender Advanced Threat Protection\\DataCollection\\8099.7011103.0.7008675-77a99c323dc18f055614eedeb6e307c388905ec9\\0e3d6d2d-06cc-486d-9465-9ef3bee75444.ps1\' -Algorithm SHA256;if (!($calculatedHash.Hash -eq \'29a688ce6549a06fb576fec79422f6f6882265e0f674ab3b4c3ceb8f83aec9d3\')) { exit 323;}; . \'C:\\ProgramData\\Microsoft\\Windows Defender Advanced Threat Protection\\DataCollection\\8099.7011103.0.7008675-77a99c323dc18f055614eedeb6e307c388905ec9\\0e3d6d2d-06cc-486d-9465-9ef3bee75444.ps1\' }"'}]

Easy Peasy.


