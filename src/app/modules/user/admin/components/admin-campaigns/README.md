# Campaign Page

#### Application route: /user/admin/campaigns/campaign/:projectId/answers

All notable changes to the Campaign page will be documented in this file. 
Please always updates the roles / functionalities in this file. The Keys should be same in the back also.

### Functionalities

1. SEARCH: 
<br><br>LAUNCH: 'CAT, Search', 
<br><br>VIEW: 'Settings', 
<br><br>EDIT: 'Settings', 
<br><br>IMPORT: 'Pros'.

2. HISTORY: Put_Back_In_Queue
<br><br>SEARCH_BY: 'Keywords, Innovation', 
<br><br>T_COLUMNS: 'Keywords, Pros, Targeting, Created, Status, Email_Status, Under_Shield, Ambassador',
<br><br>VIEW: 'Campaign, Request, Project, Results, Requests', 
<br><br>ADD: 'To_Campaign', 
<br><br>LAUNCH: 'Module, Google_Requests, Emails_Search', 
<br><br>STOP: 'Requests', 
<br><br>CANCEL: 'Requests'.

3. PROS: Import, Export, Add,
<br><br>SEARCH_BY: 'Name, Email, Country, Job, Company', 
<br><br>T_COLUMNS: 'Member, Name, Country, Job, Company, Campaign, Contact'
<br><br>PROFILE: 'View, Edit, Delete'.

4. WORKFLOWS: Select, Edit, View, Import, Test, Delete. 

5. BATCH: AutoBatch, Create, Pause, Edit, View, Delete.

6. ANSWERS: Import, Export, View, Edit, Quiz, Validate, Reject,
<br><br>FILTER_BY: 'Status', 
<br><br>SEARCH_BY: 'Name, Job, Country, Validation_Score', 
<br><br>T_Columns: 'Name, Country, Job, Validation_Score, Updated, Created, Status'.


Here SEARCH, HISTORY, PROS, WORKFLOWS, BATCH, ANSWERS represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Tech:

1. SEARCH: All
2. HISTORY: All
3. PROS: All,
4. WORKFLOWS: All,
5. BATCH: All,
6. ANSWERS: All

#### Hotline:

1. PROS:
<br><br>SEARCH_BY: 'Name, Email,
<br><br>PROFILE: 'View, Edit, Add, Export'.

2. ANSWERS: View, Edit,
<br><br>FILTER_BY: 'Status', 
<br><br>SEARCH_BY: 'Name', 
<br><br>T_Columns: 'Name, Country, Job, Created, Status'.

#### Market Test Manager:

1. SEARCH: LAUNCH: 'Search', VIEW: 'Settings', EDIT: 'Settings', IMPORT: 'Pros'.

2. HISTORY: Put_Back_In_Queue
<br><br>SEARCH_BY: 'Keywords', 
<br><br>T_COLUMNS: 'Keywords, Pros, Targeting, Created, Status, Email_Status, Under_Shield',
<br><br>VIEW: 'Campaign, Request, Results, Requests', 
<br><br>ADD: 'To_Campaign', 
<br><br>LAUNCH: 'Module, Google_Requests, Emails_Search', 
<br><br>STOP: 'Requests', 
<br><br>CANCEL: 'Requests'.

3. PROS:
<br><br>SEARCH_BY: 'Name, Email, Job, Company', 
<br><br>T_COLUMNS: 'Name, Country, Job, Company',
<br><br>PROFILE: 'View, Edit'.

4. WORKFLOWS: Select, Edit, Test, Import. 

5. BATCH: AutoBatch, Pause, Edit, View.

6. ANSWERS: Import, Export, View, Edit, Quiz, Validate, Reject,
<br><br>FILTER_BY: 'Status', 
<br><br>SEARCH_BY: 'Name, Country', 
<br><br>T_Columns: 'Name, Country, Job, Validation_Score, Created, Status'.

### Example - Market Test Manager role

```
access: { 
    projects: { 
        project: {
                campaigns: {
                    campaign: {
                        batch: {
                            view: true,
                            edit: true,
                            pause: true,
                            autoBatch: true
                        },
                        workflows: {
                            test: true,
                            edit: true,
                            select: true
                        },
                        history: {
                            cancel: {
                                requests: true
                            },
                            stop: {
                                requests: true
                            },
                            launch: {
                                module: true,
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
                        search: {
                            import: {
                                pros: true
                            },
                            edit: {
                                settings: true
                            },
                            view: {
                                settings: true
                            },
                            launch: {
                                search: true
                            }
                        },
                        answers: {
                            tableColumns: {
                                validationScore: true,
                                status: true
                                created: true,
                                job: true,
                                name: true,
                                country: true
                            },
                            searchBy: {
                                name: true,
                                country: true
                            },
                            filterBy: {
                                status: true
                            },
                            edit: true,
                            view: true,
                            import: true,
                            quiz: true,
                            validate: true,
                            reject: true,
                            export: true
                        },
                        pros: {
                            add: true,
                            searchBy: {
                                company: true,
                                name: true,
                                job: true,
                                email: true
                            },
                            tableColumns: {
                                company: true,
                                job: true,
                                name: true,
                                country: true
                            },
                            profile: {
                                edit: true,
                                view: true
                            }
                        }
                    }
                }
            }
        },
    } 
}

```
