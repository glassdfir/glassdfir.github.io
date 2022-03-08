---
layout: post
title:  "Microsoft 365 Security: Multifactor API Access"
date:   2022-03-06 12:33:28 -0500
categories: blog
---

I have decided to dust off the ol' blog to start documenting some of my more recent endeavors leveraging the Microsoft 365 Security suite to perform Incident Response. Since I prefer to talk to APIs more than people, this seemed like a good opportunity to explore the different components of the ecosystem through the language of Python. Generic instructions are being provided to get you started but there are a lot of nuances with the environment and I can't bring myself to document them all. 

## Getting Started
1. Go [here](https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/evaluate-mde?view=o365-worldwide) and get yourself a free 3 month license for Defender for Endpoint
2. Click next and agree until it stops asking. Literally have no clue what I agreed to.
3. Go to [Microsoft 365 Defender](https://security.microsoft.com/homepage).
4. Go to **Settings > Endpoints > Onboarding**, grab an onboarding script, and onboard a device to your environment. [Reference](https://docs.microsoft.com/en-us/microsoft-365/security/defender-endpoint/onboard-configure?view=o365-worldwide)
5. Reboot the device. You shouldn't have to but it makes every thing go faster.
6. Head to [Azure](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) and build yourself and App.
7. Go to **YOUR APP > Certificates & secrets** and make yourself a New client secret. Copy that down because you can only look at that once. We will need that later.
8. Go to **YOUR APP > API Permissions** and Click Add a Permission.
9. When the **Request API permissions** side screen pops up, click on **APIs my organization uses**. Type **"WindowsDefenderATP"** in the search box.
10. Click on **Application permissions** Select EVERYTHING. Go nuts. Hit **Update Permissions**
11. Now before you click away, Click **Grant admin consent to YOUR DOMAIN**. This should turn all orange "Not granted for"s into green "Granted for"s.
12. Go to the **YOUR APP > Overview** page and gather your **Application (client) ID** and **Directory (tenant) ID**. We will need the **Tenent ID**, **App ID**, and **Client Secret** to play with the API.
13. Go to **YOUR APP > Authentication** page and under Platform configurations:
    * Click **Add Platform** 
    * Click **Web**
    * Add https://portal.azure.com as a **Redirect URI** 
14. Navigate over to **[Conditional Access > Classic policies](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ConditionalAccessBlade/ClassicPolicies)** and disable that **\[Windows Defender ATP\] Device policy** or...you know, join your computer to this Domain. Your call.

Those are the rough strokes. Is it more complicated than that? Yes. I encourage everyone to RTFMs from Microsoft on spinning up a new M365. 

## Getting an Auth Token
To talk to the API, we will be leveraging the msal module to query Graph while changing the scope to Microsoft Defender for Endpoint's API. This is the product of a lot of trial and error BUT the benefit of this is to multifactor the API so we can leverage the API via Jupyter Notebooks without having secret keys laying around everywhere.


```python
import msal
import json
import requests
from datetime import datetime
from msal_extensions import *
import urllib3
urllib3.disable_warnings()

tenantID = '11111111-1111-1111-1111-111111111111'
clientID = '22222222-2222-2222-2222-222222222222'
authority = 'https://login.microsoftonline.com/' + tenantID
scope = ["https://api.securitycenter.microsoft.com/AdvancedQuery.Read"]
username = 'JonathanGlass@HalfFullofSecurity.onmicrosoft.com'
result = None
tokenExpiry = None

def msal_delegated_device_flow(clientID, scope, authority):
    print("Initiate Device Code Flow to get an AAD Access Token.")
    print("Open a browser window and paste in the URL below and then enter the Code. CTRL+C to cancel.")

    app = msal.PublicClientApplication(client_id=clientID, authority=authority)
    flow = app.initiate_device_flow(scopes=scope)

    if "user_code" not in flow:
        raise ValueError("Fail to create device flow. Err: %s" % json.dumps(flow, indent=4))

    print(flow["message"])
    result = app.acquire_token_by_device_flow(flow)
    return result

# Get a new Access Token using the Device Code Flow
result = msal_delegated_device_flow(clientID, scope, authority)

if result["access_token"]:
    print("We have a Token!")
    print(result["access_token"][:100]+"...")
```

    Initiate Device Code Flow to get an AAD Access Token.
    Open a browser window and paste in the URL below and then enter the Code. CTRL+C to cancel.
    To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code R8H6RUBCH to authenticate.
    We have a Token!
    eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyIsImtpZCI6ImpTMVhv...


### What is in this token?

This authentication request returns a [JSON Web Token](https://en.wikipedia.org/wiki/JSON_Web_Token).
A couple of JSON objects and some binary crap at the end. Decoded the main part looks like this
```json
{
    "aud": "https://api.securitycenter.microsoft.com",
    "iss": "https://sts.windows.net/11111111-1111-1111-1111-111111111111/",
    "iat": 1646594420,
    "nbf": 1646594420,
    "exp": 1646598320,
    "aio": "E2ZgYJgYsw2fBq9T2rVW7Xu8R/3NqgBQA=",
    "app_displayname": "API for MDE",
    "appid": "33333333-3333-3333-3333-333333333333",
    "appidacr": "1",
    "idp": "https://sts.windows.net/11111111-1111-1111-1111-111111111111/",
    "oid": "22222222-2222-2222-2222-222222222222",
    "rh": "0.AXYAFoxqAF6E29830mEYB5Wx20IBWUEePwwXINRAoMUwcCJHG5KZAAA.",
      "roles": [
        "Machine.Isolate",
        "Event.Write",
        "SecurityConfiguration.ReadWrite.All",
        "IntegrationConfiguration.ReadWrite",
        "Machine.Scan",
        "Url.Read.All",
        "Ip.Read.All",
        "Ti.ReadWrite",
        "Ti.Read.All",
        "User.Read.All",
        "Machine.ReadWrite.All",
        "Ti.ReadWrite.All",
        "Machine.LiveResponse",
        "SecurityRecommendation.Read.All",
        "Machine.RestrictExecution",
        "Machine.StopAndQuarantine",
        "Alert.Read.All",
        "Software.Read.All",
        "SecurityConfiguration.Read.All",
        "File.Read.All",
        "Machine.CollectForensics",
        "Machine.Offboard",
        "Vulnerability.Read.All",
        "Library.Manage",
        "Machine.Read.All",
        "Score.Read.All",
        "RemediationTasks.Read.All",
        "Alert.ReadWrite.All",
        "AdvancedQuery.Read.All"
      ],
    "sub": "22222222-2222-2222-2222-222222222222",
    "tenant_region_scope": "NA",
    "tid": "11111111-1111-1111-1111-111111111111",
    "uti": "0gf-Rhig10GmG2T1G7kyvAA",
    "ver": "1.0"
}
```

## Using the Token to Run Advanced Threat Hunting Queries


```python
query = """DeviceProcessEvents | where InitiatingProcessFileName =~ \"powershell.exe\"
           | project Timestamp, FileName, InitiatingProcessFileName 
           | order by Timestamp desc 
           | limit 2"""

url = "https://api.securitycenter.windows.com/api/advancedqueries/run"
headers = { 
    'Content-Type' : 'application/json',
    'Accept' : 'application/json',
    'Authorization' : "Bearer " + result["access_token"]
}
data = { 'Query' : query }

response = requests.post(url, json=data, headers=headers, verify=False)
jsonResponse = response.json()
jsonResponse
```


    {'Stats': {'ExecutionTime': 0.0157135,
      'resource_usage': {'cache': {'memory': {'hits': 50,
         'misses': 0,
         'total': 50},
        'disk': {'hits': 0, 'misses': 0, 'total': 0}},
       'cpu': {'user': '00:00:00.0625000',
        'kernel': '00:00:00',
        'total cpu': '00:00:00.0625000'},
       'memory': {'peak_per_node': 3670944}},
      'dataset_statistics': [{'table_row_count': 2, 'table_size': 94}]},
     'Schema': [{'Name': 'Timestamp', 'Type': 'DateTime'},
      {'Name': 'FileName', 'Type': 'String'},
      {'Name': 'InitiatingProcessFileName', 'Type': 'String'}],
     'Results': [{'Timestamp': '2022-03-07T21:34:30.1187436Z',
       'FileName': 'net.exe',
       'InitiatingProcessFileName': 'powershell.exe'},
      {'Timestamp': '2022-03-07T21:34:29.380998Z',
       'FileName': 'csc.exe',
       'InitiatingProcessFileName': 'powershell.exe'}]}



## Summary

If you have gotten this far, congratulations! You have Multifactor connectivity with the Microsoft Defender for Endpoint API. 
