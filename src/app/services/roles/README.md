# Header and Roles

All notable changes to the header and roles will be documented in this file. 
Please always updates the roles / routes in this file. 

### Roles

Root, Tech, Hotline, Marketing, Commercial, Market Test Manager, Community.

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

### Access of the routes based on the roles - by default Root will access all.

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
<br>'CAMPAIGN: 'SEARCH, HISTORY, PROS, WORKFLOWS, BATCH, ANSWERS'''.

#### Community:

1. ADMIN_SIDE: USERS 
<br><br>PROJECTS: 
<br>'PROJECT: 'QUESTIONNAIRE, FOLLOW_UP''.

### Example - Market Test Manager role

```
access: { 
    adminSide: {
        projects: { 
            searchBy: { 
                name: true, 
                innovationCard: true, 
                type: true, 
                company: true, 
                status: true, 
                operator: true, 
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
                    view: true
                },
                synthesis: {
                    edit : {
                        respondentComments: true,
                        statistics: true,
                        respondentProfile: true,
                        answersTags: true,
                        profilesTags: true,
                        questionTags: true,
                        prosTags: true,
                        umiWord: true
                    },
                    view : {
                        respondentComments: true,
                        statistics: true,
                        respondentProfile: true,
                        answersTags: true,
                        profilesTags: true,
                        questionTags: true,
                        prosTags: true,
                        umiWord: true
                    },
                    filter: true,
                    views: true
                },
                campaigns: {
                    updateStatistics: true,
                    add: true,
                    delete: true,
                    view: true,
                    edit: true,
                    campaign: {
                        batch: {
                            view: true,
                            edit: true,
                            pause: true,
                            launchAutoBatch: true
                        },
                        workflows: {
                            test: true,
                            changeLanguage: true,
                            editTemplate: true,
                            selectTemplate: true
                        },
                        history: {
                            cancel: {
                                search: true
                            },
                            stop: {
                                search: true
                            },
                            launch: {
                                module: true
                            },
                            add: {
                                searchInCampaign: true
                            },
                            view: {
                                search: true,
                                campaign: true,
                                searchFilles: true
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
                            putBackSearchInLine: true
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
                            searchBY: {
                                name: true,
                                country: true
                            },
                            filter: {
                                status: true
                            },
                            editResponse: true,
                            viewResponse: true,
                            import: true,
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
                            import: true,
                            add: true,
                            edit: true,
                            view: true
                        }
                    }        
                }, 
                questionnaire: {
                    quiz: {
                        generate: true,
                        save: true,
                        view: true
                    },
                    deleteTag: true,
                    addQuestionsTags: true,
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
            profile: { 
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
            profile: { 
                view: true, 
                edit: true, 
                impersonate: true
            },
        }
    }
}

```
