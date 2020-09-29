# Campaign Page

Document link:
[a link](https://docs.google.com/document/d/1P083gvT8ObRR4v5uvOoBDRMttz4MKj3qXYozsu4PNx8/edit) 

#### Application route: /user/admin/campaigns/campaign/:projectId/answers

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

5. BATCH: AutoBatch, Create, Pause, Edit, View, Delete, Quiz.


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
                            autoBatch: true,
                            quiz: true
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
