# Search Page

Document link:
[a link](https://docs.google.com/document/d/1P083gvT8ObRR4v5uvOoBDRMttz4MKj3qXYozsu4PNx8/edit) 

#### Application route: /user/admin/search/pros

### Functionalities

1. PROS: Import,
<br><br>LAUNCH:  Cat, Search, 
<br><br>VIEW:  Settings, 
<br><br>EDIT:  Settings, 
<br><br>IMPORT:  Pros.

2. HISTORY: Put Back In Queue
<br><br>SEARCH BY:  Keywords, Innovation, 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield, Ambassador ,
<br><br>VIEW:  Campaign, Request, Project, Results, Requests, 
<br><br>ADD:  To Campaign, 
<br><br>LAUNCH:  Google Requests, Emails Search, 
<br><br>STOP:  Requests, 
<br><br>CANCEL:  Requests.

3. QUEUE: Put Back In Queue,
<br><br>LAUNCH:  Emails Search, 
<br><br>ADD:  To Campaign,
<br><br>STOP:  Requests, 
<br><br>CANCEL:  Requests 
<br><br>SEARCH BY:  Keywords, Innovation,
<br><br>VIEW:  Campaign, Request, Project, Results, Requests, 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield, Ambassador. 


### Example - Market Test Manager role

```
access: { 
    search: { 
        history: { 
           cancel: {
               requests: true
           },
           stop: {
               requests: true
           },
           launch: {
               googleRequests: true,
               emailsSearch: true
           },
           add: {
               toCampaign: true
           },
           view: {
               request: true,
               campaign: true,
               results: true,
               requests: true
           },
           tableColumns: {
               underShield: true,
               emailStatus: true,
               status: true,
               created: true,
               targeting: true,
               pros: true,
               keywords: true
           },
           searchBy: {
               keywords: true,
               innovation: true
           },
           putBackInQueue: true
        },
        queue: {
            cancel: {
                requests: true
            },
            stop: {
                requests: true
            },
            launch: {
                emailsSearch: true
            },
            add: {
                toCampaign: true
            },
            view: {
               request: true,
               campaign: true,
               results: true,
               requests: true
            },
            tableColumns: {
               underShield: true,
               emailStatus: true,
               status: true,
               created: true,
               targeting: true,
               pros: true,
               keywords: true
            },
            putBackInQueue: true,
            searchBy: {
                keywords: true,
                innovation: true
            }
        }
    } 
}

```
