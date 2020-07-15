# Search Page

#### Application route: /user/admin/search/pros

All notable changes to the Search page will be documented in this file. 
Please always updates the roles / functionalities in this file. 

### Functionalities

1. PROFESSIONAL: Import_Pros,
<br><br>LAUNCH: 'CAT, Search',
<br><br>SETTINGS: 'View, Edit'.

2. HISTORY: Put_Back_Search_In_Line
<br><br>SEARCH_BY: 'Keywords, Innovation', 
<br><br>T_COLUMNS: 'Keywords, Pros, Targeting, Created, Status, Email_Status, Under_Shield, Ambassador',
<br><br>VIEW: 'Search_Filles, Campaign, Search, Project', 
<br><br>ADD: 'Search_In_Campaign', 
<br><br>LAUNCH: 'Module', STOP: 'Search', CANCEL: 'Search'. 

3. WAITING_LINE: Launch_Module, Cancel_Search, Put_Back_Search_In_Line, Stop_Search, Add_Search_In_Campaign, Search_Emails,
<br><br>SEARCH_BY: 'Keywords, Innovation' 

Here PROFESSIONAL, HISTORY, WAITING_LINE represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Tech:

1. PROFESSIONAL: All
2. HISTORY: All
3. WAITING_LINE: All 

#### Market Test Manager:

1. HISTORY: Put_Back_Search_In_Line
<br><br>SEARCH_BY: 'Keywords, Innovation', 
<br><br>T_COLUMNS: 'Keywords, Pros, Targeting, Created, Status, Email_Status, Under_Shield',
<br><br>VIEW: 'Search_Filles, Campaign, Search', 
<br><br>ADD: 'Search_In_Campaign', 
<br><br>LAUNCH: 'Module', 
<br><br>STOP: 'Search', 
<br><br>CANCEL: 'Search'.

2. WAITING_LINE: All

### Example - Market Test Manager role

```
access: { 
    search: { 
        history: { 
            putBackSearchInLine: true,
            cancel: {
                search: true
            },
            stop: {
                module: true
            },
            launch: {
                search: true
            },
            add: {
                searchInCampaign: true
            },
            view: {
                search: true
                campaign: true,
                searchFilles: true,
            },
            search: {
                keywords: true,
                innovation: true
            },
            tableColumns: {
                keywords: true,
                pros: true,
                targeting: true,
                created: true,
                status: true,
                emailStatus: true,
                underShield: true
            }
        },
        waitingLine: {
            launchModule: true,
            cancelSearch: true,
            stopSearch: true, 
            addSearchInCampaign: true,
            searchEmails: true,
            putBackSearchInLine: true,
            searchBy: {
                keywords: true,
                innovation: true
            },
        }
    } 
}

```
