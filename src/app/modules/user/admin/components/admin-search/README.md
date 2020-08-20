# Search Page

#### Application route: /user/admin/search/pros

All notable changes to the Search page will be documented in this file. 
Please always updates the roles / functionalities in this file. 

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

3. WAITING LINE: Put Back In Queue,
<br><br>LAUNCH:  Emails Search, 
<br><br>ADD:  To Campaign,
<br><br>STOP:  Requests, 
<br><br>CANCEL:  Requests 
<br><br>SEARCH BY:  Keywords, Innovation,
<br><br>VIEW:  Campaign, Request, Project, Results, Requests, 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield, Ambassador. 

Here PROFESSIONAL, HISTORY, WAITING LINE represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Market Test Manager:

1. HISTORY: Put Back In Queue
<br><br>SEARCH BY:  Keywords , 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield ,
<br><br>VIEW:  Campaign, Request, Results, Requests , 
<br><br>ADD:  To Campaign , 
<br><br>LAUNCH:  Google Requests, Emails Search , 
<br><br>STOP:  Requests , 
<br><br>CANCEL:  Requests .

2. WAITING LINE: All

#### Market Test Manager UMI:

1. HISTORY: Put Back In Queue
<br><br>SEARCH BY:  Keywords , 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield ,
<br><br>VIEW:  Campaign, Request, Results, Requests , 
<br><br>ADD:  To Campaign , 
<br><br>LAUNCH:  Google Requests, Emails Search , 
<br><br>STOP:  Requests , 
<br><br>CANCEL:  Requests .

2. WAITING LINE: All

#### Oper Supervisor:

1. HISTORY: Put Back In Queue
<br><br>SEARCH BY:  Keywords , 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield ,
<br><br>VIEW:  Campaign, Request, Results, Requests , 
<br><br>ADD:  To Campaign , 
<br><br>LAUNCH:  Google Requests, Emails Search , 
<br><br>STOP:  Requests , 
<br><br>CANCEL:  Requests .

2. WAITING LINE: All

#### Tech:

1. HISTORY: Put Back In Queue
<br><br>SEARCH BY:  Keywords , 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield ,
<br><br>VIEW:  Campaign, Request, Results, Requests , 
<br><br>ADD:  To Campaign , 
<br><br>LAUNCH:  Google Requests, Emails Search , 
<br><br>STOP:  Requests , 
<br><br>CANCEL:  Requests .

2. WAITING LINE: All

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
               keywords: true
           },
           putBackInQueue: true
        },
        waitingLine: {
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
            },
        }
    } 
}

```
