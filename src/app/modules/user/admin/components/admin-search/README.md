# Search Page

#### Application route: /user/admin/search/pros

All notable changes to the Search page will be documented in this file. 
Please always updates the roles / functionalities in this file. 

### Functionalities

1. PROFESSIONAL: Import,
<br><br>LAUNCH: 'CAT, Search',
<br><br>SETTINGS: 'View, Edit'.

2. HISTORY: Put_Back_In_Queue
<br><br>SEARCH_BY: 'Keywords, Innovation', 
<br><br>T_COLUMNS: 'Keywords, Pros, Targeting, Created, Status, Email_Status, Under_Shield, Ambassador',
<br><br>VIEW: 'Campaign, Request, Project, Results, Requests', 
<br><br>ADD: 'To_Campaign', 
<br><br>LAUNCH: 'Google_Requests, Emails_Search', 
<br><br>STOP: 'Requests', 
<br><br>CANCEL: 'Requests'.

3. WAITING_LINE: Put_Back_In_Queue,
<br><br>LAUNCH: 'Emails_Search', 
<br><br>ADD: 'To_Campaign',
<br><br>STOP: 'Requests', 
<br><br>CANCEL: 'Requests'.
<br><br>SEARCH_BY: 'Keywords, Innovation' 

Here PROFESSIONAL, HISTORY, WAITING_LINE represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Market Test Manager:

1. HISTORY: Put_Back_In_Queue
<br><br>SEARCH_BY: 'Keywords', 
<br><br>T_COLUMNS: 'Keywords, Pros, Targeting, Created, Status, Email_Status, Under_Shield',
<br><br>VIEW: 'Campaign, Request, Results, Requests', 
<br><br>ADD: 'To_Campaign', 
<br><br>LAUNCH: 'Google_Requests, Emails_Search', 
<br><br>STOP: 'Requests', 
<br><br>CANCEL: 'Requests'.

2. WAITING_LINE: All

#### Market Test Manager UMI:

1. HISTORY: Put_Back_In_Queue
<br><br>SEARCH_BY: 'Keywords', 
<br><br>T_COLUMNS: 'Keywords, Pros, Targeting, Created, Status, Email_Status, Under_Shield',
<br><br>VIEW: 'Campaign, Request, Results, Requests', 
<br><br>ADD: 'To_Campaign', 
<br><br>LAUNCH: 'Google_Requests, Emails_Search', 
<br><br>STOP: 'Requests', 
<br><br>CANCEL: 'Requests'.

2. WAITING_LINE: All

#### Oper Supervisor:

1. HISTORY: Put_Back_In_Queue
<br><br>SEARCH_BY: 'Keywords', 
<br><br>T_COLUMNS: 'Keywords, Pros, Targeting, Created, Status, Email_Status, Under_Shield',
<br><br>VIEW: 'Campaign, Request, Results, Requests', 
<br><br>ADD: 'To_Campaign', 
<br><br>LAUNCH: 'Google_Requests, Emails_Search', 
<br><br>STOP: 'Requests', 
<br><br>CANCEL: 'Requests'.

2. WAITING_LINE: All

#### Tech:

1. HISTORY: Put_Back_In_Queue
<br><br>SEARCH_BY: 'Keywords', 
<br><br>T_COLUMNS: 'Keywords, Pros, Targeting, Created, Status, Email_Status, Under_Shield',
<br><br>VIEW: 'Campaign, Request, Results, Requests', 
<br><br>ADD: 'To_Campaign', 
<br><br>LAUNCH: 'Google_Requests, Emails_Search', 
<br><br>STOP: 'Requests', 
<br><br>CANCEL: 'Requests'.

2. WAITING_LINE: All

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
            }
            putBackInQueue: true,
            searchBy: {
                keywords: true,
                innovation: true
            },
        }
    } 
}

```
