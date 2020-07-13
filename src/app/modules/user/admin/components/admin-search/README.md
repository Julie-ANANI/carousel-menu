# Search Page

#### Application route: /user/admin/search/pros

All notable changes to the Search page will be documented in this file. 
Please always updates the roles / functionalities in this file. 

### Functionalities

1. PROFESSIONAL: Launch_CAT, Launch_Search, SETTINGS: 'View, Edit', Import_Pros.

2. HISTORY: View, View_Search, View_Campaign, View_Project, Launch_Module, Cancel_Search, Stop_Search, Add_Search_In_Campaign, Search_Emails, View_Search_Filles. Put_Back_Search_In_Line,
<br><br>SEARCH: 'Keywords, Innovation', 
<br><br>T_COLUMNS: 'Keywords, Pros, Targeting,Created, Status, Email_Status, Under_Shield, Ambassador'. 

3. WAITING_LINE: Launch_Module, Cancel_Search, Put_Back_Search_In_Line, Stop_Search, Add_Search_In_Campaign, Search_Emails,
<br><br>SEARCH: 'Keywords, Innovation' 

Here PROFESSIONAL, HISTORY, WAITING_LINE represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Tech:

1. PROFESSIONAL: All
2. HISTORY: All
3. WAITING_LINE: All 

#### Market Test Manager:

1. HISTORY: SEARCH: 'Keywords, Innovation', T_COLUMNS: 'Keywords, Pros, Targeting,Created, Status, Email_Status, Under_Shield', View, View_Search, View_Campaign, Launch_Module, Cancel_Search, Stop_Search, Add_Search_In_Campaign, Search_Emails, View_Search_Filles. Put_Back_Search_In_Line.

2. WAITING_LINE: All

### Example - Market Test Manager role

```
nav: { 
    search: { 
        history: { 
            viewSearch: true, 
            viewCamapign: true,
            launchModule: true,
            cancelSearch: true,
            stopSearch: true, 
            addSearchInCampaign: true,
            searchEmails: true,
            viewSearchFilles: true,
            putBackSearchInLine: true,
            view: true,
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
            search: {
                keywords: true,
                innovation: true
            },
        }
    } 
}

```
