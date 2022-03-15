---
layout: post
title:  "Microsoft 365 Security: Using the API for Live Response"
date:   2022-03-10 12:33:28 -0500
categories: blog
---

## Adding a file to the MDE Live Response Library and Running it on an Endpoint

Continuing to build on my previous posts...

One of my all time favorite user containment methods is to change the BitLocker keys and shut the system down.  

```powershell
#Delete existing protections
manage-bde.exe -protectors -delete c: -Type TPMAndPIN
manage-bde.exe -protectors -delete c: -Type RecoveryPassword
#Now that all of the previous Protectors are gone, let's add our own.
#Let's add a new password that only the security team will need to know.
manage-bde.exe -protectors -add c: -TPMandPIN SuperDuperPassword
#As a backup, let's also add a couple of recovery keys
manage-bde.exe -protectors -add c: -RecoveryPassword 111111-111111-111111-111111-111111-111111-111111-111111 
manage-bde.exe -protectors -add c: -RecoveryPassword 222222-222222-222222-222222-222222-222222-222222-222222 
manage-bde.exe -on c:
shutdown /f /s /t 0
```
## Making a function to Post Library Files

```python

def postFileToLiveResponseLibrary(fileObjToUpload, description, parameters="", override = False, token=result["access_token"]):
    headers = {'Authorization' : "Bearer " + token }
    url = "https://api.securitycenter.windows.com/api/libraryfiles"
    files={'file': fileObjToUpload}

    params={
          'Description': description,
          'ParametersDescription': parameters,
          'OverrideIfExists':override
    }
    response = requests.post(url, data=params,  files=files, headers=headers, verify=False)
    return response.json()
    
```

## Adding a Containment Script to Your Live Response Library


```python
from io import StringIO 
script = """
        #Delete existing protections
        manage-bde.exe -protectors -delete c: -Type TPMAndPIN
        manage-bde.exe -protectors -delete c: -Type RecoveryPassword
        #Now that all of the previous Protectors are gone, let's add our own.
        #Let's add a new password that only the security team will need to know.
        manage-bde.exe -protectors -add c: -TPMandPIN SuperDuperPassword
        #As a backup, let's also add a couple of recovery keys
        manage-bde.exe -protectors -add c: -RecoveryPassword 111111-111111-111111-111111-111111-111111-111111-111111 
        manage-bde.exe -protectors -add c: -RecoveryPassword 222222-222222-222222-222222-222222-222222-222222-222222 
        manage-bde.exe -on c:
        """

#StringIO is a fun module that lets you treat strings like file objects. 
fileobj = StringIO(script)
fileobj.filename = "contain.ps1"

postFileToLiveResponseLibrary(
    fileObjToUpload = fileobj,
    description = "BitLocker Containment Script",
    parameters = "Parameter Info Would Go Here",
    override = True
    )
```




    {'@odata.context': 'https://api.securitycenter.windows.com/api/$metadata#LibraryFiles/$entity',
     'fileName': 'file',
     'sha256': '8052835f7fcbca7b123e763b3e429f552cda4d6d3ddcf193d4b356ca01b9e7b4',
     'description': 'BitLocker Containment Script',
     'creationTime': '2022-03-10T13:35:27.841749Z',
     'lastUpdatedTime': '2022-03-10T13:35:27.841749Z',
     'createdBy': 'Jonathan Glass',
     'hasParameters': False,
     'parametersDescription': 'Parameter Info Would Go Here'}

Sweet! It worked!

## Running your newly uploaded script against an endpoint


```python
liveResponseCommands = {}
liveResponseCommands['Commands'] = []

command = {}
command['type'] = "RunScript"
command["params"] = [{"key":"ScriptName",
                      "value":"contain.ps1"}]

liveResponseCommands['Commands'].append(command)
liveResponseCommands['Comment'] = "Containing Endpoint via BitLocker"

liveResponseCommands

```




    {'Commands': [{'type': 'RunScript',
       'params': [{'key': 'ScriptName', 'value': 'contain.ps1'}]}],
     'Comment': 'Containing Endpoint via BitLocker'}




```python
machineID = "c6993a6c004946bf52d2d59237c18e6db4db7e5e"
MDErequest("machines/%s/runliveresponse" % (machineID),
           liveResponseCommands)
```




    {'@odata.context': 'https://api.securitycenter.windows.com/api/$metadata#MachineActions/$entity',
     'id': '9509426d-490c-4f2b-90b4-4703674be8cf',
     'type': 'LiveResponse',
     'title': None,
     'requestor': 'JonathanGlass@HalfFullofSecurity.onmicrosoft.com',
     'requestorComment': 'Containing Endpoint via BitLocker',
     'status': 'Pending',
     'machineId': 'c6993a62004946bf52d2d59237c18e6db4db7e5e',
     'computerDnsName': 'desktop-l3mnbj9',
     'creationDateTimeUtc': '2022-03-10T14:36:51.8759111Z',
     'lastUpdateDateTimeUtc': '2022-03-10T14:36:51.8759111Z',
     'cancellationRequestor': None,
     'cancellationComment': None,
     'cancellationDateTimeUtc': None,
     'errorHResult': 0,
     'scope': None,
     'externalId': None,
     'requestSource': 'PublicApi',
     'relatedFileInfo': None,
     'commands': [{'index': 0,
       'startTime': None,
       'endTime': None,
       'commandStatus': 'Created',
       'errors': [],
       'command': {'type': 'RunScript',
        'params': [{'key': 'ScriptName', 'value': 'contain.ps1'}]}}],
     'troubleshootInfo': None}



## Deleting a file from your Live Response Library


```python
def deleteFileFromLiveResponseLibrary(filename, token=result["access_token"]):
    headers = {'Authorization' : "Bearer " + token }
    url = "https://api.securitycenter.windows.com/api/libraryfiles/%s" % (filename)
    response = requests.delete(url, headers=headers, verify=False)
    return response

deleteFileFromLiveResponseLibrary("contain.ps1")

```


    <Response [204]> means it worked!
