# Header and Roles

All notable changes to the header and roles will be documented in this file. 
Please always updates the roles / routes in this file. 

### Roles defined in the order as in the Api (bootstrapRoles). 

Guest, User, Supervisor, Community, Commercial, Marketing, Hotline, Market Test Manager, 
Market Test Manager UMI, Oper-supervisor, Tech, Root.

### Routes

1. ADMIN_SIDE: USERS, COMMUNITY, PROFESSIONALS, 
<br><br>LIBRARIES: 'WORKFLOWS, EMAILS, QUESTIONNAIRE, SIGNATURES', 
<br><br>MONITORING: 'MAILGUN, GMAIL, SHIELD',
<br><br>SETTINGS: 'BLACKLIST, COUNTRIES, COMPANY', 
<br><br>SEARCH: 'PROFESSIONAL, HISTORY, WAITING_LINE',
<br><br>PROJECTS: 
<br>'PROJECT: 'SETTINGS, ANSWER_TAGS, QUESTIONNAIRE, SYNTHESIS, STORYBOARD, FOLLOW_UP', 
<br><br>CAMPAIGNS: 
<br>'CAMPAIGN: 'SEARCH, HISTORY, PROS, WORKFLOWS, BATCH, ANSWERS'''.

### Access of the routes based on the roles.

No definition of a Role means no access to that user.

#### Tech:

1. ADMIN_SIDE: All

#### Hotline:

1. ADMIN_SIDE: PROFESSIONALS,
<br><br>SETTINGS: 'BLACKLIST',
<br><br>PROJECTS: 
<br>'PROJECT: 'SETTINGS, FOLLOW_UP', 
<br><br>CAMPAIGNS: 
<br>'CAMPAIGN: 'PROS, ANSWERS'''.

#### Marketing:

1. ADMIN_SIDE: 
<br><br>PROJECTS: 
<br>'PROJECT: 'SETTINGS, SYNTHESIS''.

#### Commercial:

1. ADMIN_SIDE: USERS
<br><br>PROJECTS: 
<br>'PROJECT: 'SETTINGS, SYNTHESIS, STORYBOARD''.

#### Market Test Manager:

1. ADMIN_SIDE: USERS, PROFESSIONALS
<br><br>LIBRARIES: 'WORKFLOWS, QUESTIONNAIRE',
<br><br>SEARCH: 'HISTORY, WAITING_LINE',
<br><br>PROJECTS: 
<br>'PROJECT: 'SETTINGS, ANSWER_TAGS, QUESTIONNAIRE, SYNTHESIS, STORYBOARD', 
<br><br>CAMPAIGNS: 
<br>'CAMPAIGN: 'SEARCH, HISTORY, PROS, WORKFLOWS, BATCH, ANSWERS''.

#### Market Test Manager UMI:

1. ADMIN_SIDE: USERS, PROFESSIONALS
<br><br>LIBRARIES: 'WORKFLOWS, QUESTIONNAIRE',
<br><br>SEARCH: 'HISTORY, WAITING_LINE',
<br><br>PROJECTS: 
<br>'PROJECT: 'SETTINGS, ANSWER_TAGS, QUESTIONNAIRE, SYNTHESIS, STORYBOARD', 
<br><br>CAMPAIGNS: 
<br>'CAMPAIGN: 'SEARCH, HISTORY, PROS, WORKFLOWS, BATCH, ANSWERS''.

#### Community:

1. ADMIN_SIDE: USERS 
<br><br>PROJECTS: 
<br>'PROJECT: 'QUESTIONNAIRE, FOLLOW_UP''.

### Example - Market Test Manager role

```
access: { 
    adminSide: {
        libraries: { 
            workflows: { 
                add: true, 
                edit: true
            }, 
            questionnaire: { 
                add: true, 
                edit: true, 
                delete: true,
                clone: true, 
                searchBy: {
                    name: true
                } 
            }
        }, 
        projects: { 
            filterBy: {
                status: true, 
                operator: true
            }, 
            searchBy: { 
                name: true, 
                innovationCard: true, 
                type: true, 
                company: true,
                objective: true 
            }, 
            tableColumns: { 
                name: true, 
                innovationCard: true, 
                company: true, 
                type: true, 
                objective: true,
                lastUpdated: true,
                created: true,
                status: true,
                owner: true
            }, 
            batch: true,
            project: {
                storyboard: {
                    edit: true,
                    create: true,
                    makeVisibleToClient: true,
                    changeLang: true,
                    generateVideo: true,
                    view: true,
                    autofill: true,
                    generatePdf: true
                },
                synthesis: {
                    edit : {
                        respondentProfile: true,
                        questionTags: true,
                        umiWord: true,
                        views: true
                    }
                },
                campaigns: {
                    updateStatistics: true,
                    add: true,
                    delete: true,
                    edit: true,
                    view: true,
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
                            view: true,
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
                                edit: true,
                                view: true
                            }
                        }
                    }        
                }, 
                questionnaire: {
                    quiz: {
                        generate: true,
                        view: true
                    },
                    import: true,
                    view: true,
                    edit: true
                },
                answerTags: {
                    delete: true,
                    view: true,
                    edit: true
                },
                settings: {
                    edit: {
                        statistics: true,
                        publishedProject: true,
                        publicProject: true,
                        answersAnonymous: true,
                        projectTags: true,
                        domain: true,
                        operator: true,
                        roadmap: true,
                        missionType: true,
                        mainObjective: true,
                        commercial: true,
                        description: true,
                        targeting: true,
                        blacklist: true,
                        validateProject: true,
                        projectRevision: true
                    },
                    view: {
                        statistics: true,
                        publishedProject: true,
                        publicProject: true,
                        answersAnonymous: true,
                        projectTags: true,
                        domain: true,
                        operator: true,
                        roadmap: true,
                        missionType: true,
                        mainObjective: true,
                        commercial: true,
                        description: true,
                        targeting: true,
                        blacklist: true
                    }
                }
            }
        },
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
                    search: true,
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
        },
        libraries: { 
            workflows: { 
                add: true, 
                edit: true, 
                changeLanguage: true
            }, 
            questionnaire: { 
                add: true, 
                edit: true, 
                view: true, 
                delete: true, 
                searchBy: {
                    name: true
                } 
            }
        }, 
        professionals: { 
            searchBy: { 
                name: true, 
                email: true, 
                job: true, 
                country: true,
                company: true
            }, 
            tableColumns: { 
                name: true, 
                job: true, 
                company: true, 
                member: true, 
                country: true 
            }, 
            user: { 
                view: true, 
                edit: true, 
                delete: true
            },
        }, 
        users: { 
            searchBy: { 
                name: true, 
                email: true, 
                job: true, 
                domain: true
            }, 
            tableColumns: { 
                name: true, 
                job: true, 
                company: true, 
                domain: true, 
                created: true 
            }, 
            user: { 
                view: true, 
                edit: true, 
                impersonate: true
            },
        }
    }
}

```
