# Campaign Page

#### Application route: /user/admin/campaigns/campaign/:projectId/answers

All notable changes to the Campaign page will be documented in this file. 
Please always updates the roles / functionalities in this file. The Keys should be same in the back also.

### Functionalities

1. SEARCH: 
<br><br>LAUNCH:  Cat, Search, 
<br><br>VIEW:  Settings, 
<br><br>EDIT:  Settings, 
<br><br>IMPORT:  Pros.

2. HISTORY: Put Back In Queue
<br><br>SEARCH BY:  Keywords, Innovation, 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield, Ambassador,
<br><br>VIEW:  Campaign, Request, Project, Results, Requests, 
<br><br>ADD:  To Campaign , 
<br><br>LAUNCH:  Google Requests, Emails Search, 
<br><br>STOP:  Requests, 
<br><br>CANCEL:  Requests.

3. PROS: Import, Export,
<br><br>SEARCH BY:  Name, Email, Country, Job, Company, 
<br><br>T COLUMNS:  Member, Name, Country, Job, Company, Campaign, Contact 
<br><br>USER:  Add, View, Edit, Delete.

4. WORKFLOWS: Edit, View, Import, Test, Delete. 

5. BATCH: AutoBatch, Create, Pause, Edit, View, Delete.

6. ANSWERS: Import, Export, View, Edit, Quiz, Validate, Reject,
<br><br>FILTER BY:  Status, 
<br><br>SEARCH BY:  Name, Job, Country, Validation Score, 
<br><br>T Columns:  Name, Country, Job, Validation Score, Updated, Created, Status.

Here SEARCH, HISTORY, PROS, WORKFLOWS, BATCH, ANSWERS represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Supervisor

1. ANSWERS: View
<br><br>T Columns:  Name, Country, Job, Created, Status ,
<br><br>SEARCH BY:  Name, Country , 
<br><br>FILTER BY:  Status .

#### Hotline:

1. PROS: Export
<br><br>SEARCH BY:  Name, Email,
<br><br>T COLUMNS: Member, Name, Country, Job, Company.
<br><br>USER:  Edit, Add .

2. ANSWERS: Edit,
<br><br>FILTER BY:  Status , 
<br><br>SEARCH BY:  Name , 
<br><br>T Columns:  Name, Country, Job, Created, Status .

#### Market Test Manager:

1. SEARCH: LAUNCH:  Search , EDIT:  Settings , IMPORT:  Pros .

2. HISTORY: Put Back In Queue
<br><br>SEARCH BY:  Keywords , 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield ,
<br><br>VIEW:  Campaign, Request, Results, Requests , 
<br><br>ADD:  To Campaign , 
<br><br>LAUNCH:  Google Requests, Emails Search , 
<br><br>STOP:  Requests , 
<br><br>CANCEL:  Requests .

3. PROS:
<br><br>SEARCH BY:  Name, Email, Job, Company , 
<br><br>T COLUMNS:  Name, Country, Job, Company ,
<br><br>USER:  Edit .

4. WORKFLOWS: Edit, Test, Import. 

5. BATCH: AutoBatch, Pause, Edit.

6. ANSWERS: Import, Export, Edit, Quiz, Validate, Reject,
<br><br>FILTER BY:  Status , 
<br><br>SEARCH BY:  Name, Country , 
<br><br>T Columns:  Name, Country, Job, Validation Score, Created, Status .

#### Market Test Manager UMI:

1. SEARCH: LAUNCH:  Search , EDIT:  Settings , IMPORT:  Pros .

2. HISTORY: Put Back In Queue
<br><br>SEARCH BY:  Keywords , 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield ,
<br><br>VIEW:  Campaign, Request, Results, Requests , 
<br><br>ADD:  To Campaign , 
<br><br>LAUNCH:  Google Requests, Emails Search , 
<br><br>STOP:  Requests , 
<br><br>CANCEL:  Requests .

3. PROS:
<br><br>SEARCH BY:  Name, Email, Job, Company , 
<br><br>T COLUMNS:  Name, Country, Job, Company ,
<br><br>USER:  Edit .

4. WORKFLOWS: Edit, Test, Import. 

5. BATCH: AutoBatch, Pause, Edit.

6. ANSWERS: Import, Export, Edit, Quiz, Validate, Reject,
<br><br>FILTER BY:  Status , 
<br><br>SEARCH BY:  Name, Country , 
<br><br>T Columns:  Name, Country, Job, Validation Score, Created, Status .

#### Oper Supervisor:

1. SEARCH: LAUNCH:  Search , EDIT:  Settings , IMPORT:  Pros .

2. HISTORY: Put Back In Queue
<br><br>SEARCH BY:  Keywords , 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield ,
<br><br>VIEW:  Campaign, Request, Results, Requests , 
<br><br>ADD:  To Campaign , 
<br><br>LAUNCH:  Google Requests, Emails Search , 
<br><br>STOP:  Requests , 
<br><br>CANCEL:  Requests .

3. PROS:
<br><br>SEARCH BY:  Name, Email, Job, Company , 
<br><br>T COLUMNS:  Name, Country, Job, Company ,
<br><br>USER:  Edit .

4. WORKFLOWS: Edit, Test, Import. 

5. BATCH: AutoBatch, Pause, Edit.

6. ANSWERS: Import, Export, Edit, Quiz, Validate, Reject,
<br><br>FILTER BY:  Status , 
<br><br>SEARCH BY:  Name, Country , 
<br><br>T Columns:  Name, Country, Job, Validation Score, Created, Status .

#### Tech:

1. SEARCH: LAUNCH:  Search , EDIT:  Settings , IMPORT:  Pros .

2. HISTORY: Put Back In Queue
<br><br>SEARCH BY:  Keywords , 
<br><br>T COLUMNS:  Keywords, Pros, Targeting, Created, Status, Email Status, Under Shield ,
<br><br>VIEW:  Campaign, Request, Results, Requests , 
<br><br>ADD:  To Campaign , 
<br><br>LAUNCH:  Google Requests, Emails Search , 
<br><br>STOP:  Requests , 
<br><br>CANCEL:  Requests .

3. PROS:
<br><br>SEARCH BY:  Name, Email, Job, Company , 
<br><br>T COLUMNS:  Name, Country, Job, Company ,
<br><br>USER:  Edit .

4. WORKFLOWS: Edit, Test, Import. 

5. BATCH: AutoBatch, Pause, Edit.

6. ANSWERS: Import, Export, Edit, Quiz, Validate, Reject,
<br><br>FILTER BY:  Status , 
<br><br>SEARCH BY:  Name, Country , 
<br><br>T Columns:  Name, Country, Job, Validation Score, Created, Status .

### Example - Market Test Manager role

```
access: { 
    projects: { 
        project: {
                campaigns: {
                    campaign: {
                        batch: {
                            edit: true,
                            pause: true,
                            autoBatch: true
                        },
                        workflows: {
                            test: true,
                            edit: true,
                            import: true
                        },
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
                        search: {
                            import: {
                                pros: true
                            },
                            edit: {
                                settings: true
                            },
                            launch: {
                                search: true
                            }
                        },
                        answers: {
                            tableColumns: {
                                validationScore: true,
                                status: true,
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
                            import: true,
                            quiz: true,
                            validate: true,
                            reject: true,
                            export: true
                        },
                        pros: {
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
                            user: {
                                edit: true
                            }
                        }
                    }
                }
            }
        },
    } 
}

```
