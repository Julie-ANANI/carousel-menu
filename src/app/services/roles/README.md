# Header and Roles

All notable changes to the header and roles will be documented in 
[a link](https://docs.google.com/document/d/1P083gvT8ObRR4v5uvOoBDRMttz4MKj3qXYozsu4PNx8/edit) 
file. 

Please always updates the roles / routes in that file.   
  
Below is the example of the access object.
  
  
### Example - Market Test Manager role

```
accessDefinition: {
    access: {
        adminSide: {
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
                    edit: true
                },
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
                project: {
                    tabs: {
                        settings: true,
                        preparation: true,
                        collection: true,
                        analysis: true
                    },
                    synthesis: {
                        edit : {
                            respondentProfile: true,
                            questionTags: true,
                            umiWord: true,
                            views: true
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
                    questionnaire: {
                        quiz: {
                            view: true
                        },
                    },
                    answerTags: {
                        edit: true
                    },
                    settings: {
                        edit: {
                            statistics: true,
                            publishedProject: true,
                            answersAnonymous: true,
                            projectTags: true,
                            roadmap: true,
                            mission: true,
                            missionType: true,
                            mainObjective: true,
                            description: true,
                            targeting: true,
                            blocklist: true,
                            validateProject: true,
                            projectRevision: true
                        }
                    },
                    campaigns: {
                        updateStatistics: true,
                        campaign: {
                            batch: {
                                pause: true,
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
                                export: true,
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
}
```
