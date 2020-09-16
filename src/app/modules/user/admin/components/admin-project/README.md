# Project Page

Document link:
[a link](https://docs.google.com/document/d/1P083gvT8ObRR4v5uvOoBDRMttz4MKj3qXYozsu4PNx8/edit)

#### Application route: /user/admin/projects/project/:projectId/settings

### Functionalities

1. SETTINGS: 

<br><br>VIEW: Domain, Operator, Owner, Mission, Roadmap, Mission Type, Main Objective, Commercial, Description, Language, Targeting, Blocklist, Status, Project Tags, Answers Tags, Answers Anonymous, Professional Identified, Ab Testing, Workflow Emails, Workflow Select, Launch Auto Batch, Insights To Validate, Public Project, Published Project, Go To Synthesis, Ending Mail Campaign, Project Restitution, Client Satisfaction, Mission Feedback, Statistics, 

<br><br>EDIT: Domain, Operator, Owner, Mission, Roadmap, Mission Type, Main Objective, Commercial, Description, Language, Targeting, Blocklist, Status, Project Tags, Answers Tags, Answers Anonymous, Professional Identified, Ab Testing, Workflow Emails, Workflow Select, Launch Auto Batch, Insights To Validate, Public Project, Published Project, Go To Synthesis, Ending Mail Campaign, Client Satisfaction, Mission Feedback, Statistics, Validate Project, Project Revision.

2. ANSWER TAGS: View, Edit, Add, Delete.

3. QUESTIONNAIRE: Import, View, Edit, 
<br><br>QUIZ: 'View, Generate'. 

4. CAMPAIGNS: Edit, Add, Update Statistics, Delete, View.
 
5. SYNTHESIS: View
<br><br>EDIT: UMI Word, Respondent Profile, Views, Question Tags.

6. STORYBOARD: Create, View, Generate Video, Generate Pdf, Change Language, Make Visible To Client, Edit, Autofill. 

7. FOLLOW UP:
<br><br>VIEW: Answer, 
<br><br>EDIT: Answer, Objective, Views,
<br><br>WORKFLOW: View, Edit, Test, Send,
<br><br>T COLUMNS: Name, Country, Language, Job, Company, Objective.  

8. ANSWERS: Import, Export, View, Edit, Quiz, Validate, Reject,
<br><br>FILTER BY:  Status, 
<br><br>SEARCH BY:  Name, Job, Country, Validation Score, 
<br><br>T Columns:  Name, Country, Job, Validation Score, Updated, Created, Status.


### Example - Market Test Manager role

```
access: { 
    projects: { 
        project: {
            tabs: {
                settings: true,
                preparation: true,
                collection: true,
                analysis: true
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
            answerTags: {
                edit: true
            },
            questionnaire: {
                quiz: {
                    view: true
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
            synthesis: {
                edit : {
                    respondentProfile: true,
                    questionTags: true,
                    umiWord: true,
                    views: true
                }
            },
        }
    } 
}

```
