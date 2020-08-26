# Project Page

#### Application route: /user/admin/projects/project/:projectId/settings

All notable changes to the Project page will be documented in this file. 
Please always updates the roles / functionalities in this file. The Keys should be same in the back as well.

### Functionalities

1. SETTINGS: 
<br><br>VIEW: Domain, Operator, Owner, Mission, Roadmap, Mission Type, Main Objective, Commercial, Description, Language, Targeting, Blacklist, Status, Project Tags, Answers Tags, Answers Anonymous, Professional Identified, Ab Testing, Workflow Emails, Workflow Select, Launch Auto Batch, Insights To Validate, Public Project, Published Project, Go To Synthesis, Ending Mail Campaign, Project Restitution, Client Satisfaction, Mission Feedback, Statistics, 
<br><br>EDIT: Domain, Operator, Owner, Mission, Roadmap, Mission Type, Main Objective, Commercial, Description, Language, Targeting, Blacklist, Status, Project Tags, Answers Tags, Answers Anonymous, Professional Identified, Ab Testing, Workflow Emails, Workflow Select, Launch Auto Batch, Insights To Validate, Public Project, Published Project, Go To Synthesis, Ending Mail Campaign, Client Satisfaction, Mission Feedback, Statistics, Validate Project, Project Revision.

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

Here SETTINGS, ANSWER TAGS, QUESTIONNAIRE, CAMPAIGNS, SYNTHESIS, STORYBOARD, FOLLOW UP represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Community

1. QUESTIONNAIRE: Edit,
<br><br>QUIZ: 'VIEW'. 

2. FOLLOW UP: All 

#### Hotline:

1. SETTINGS:
<br><br>VIEW: 'Operator, Mission Type, Main Objective, Commercial, Blacklist, Statistics',
<br><br>EDIT: 'Blacklist, Statistics, Description, Project Tags'.

2. CAMPAIGNS: View

3. FOLLOW UP: All

4. QUESTIONNAIRE: Edit,
<br><br>QUIZ: 'VIEW'.

#### Marketing:

1. SETTINGS:
<br><br>VIEW: 'Operator, Mission Type, Main Objective, Commercial, Public Project, Published Project'.

2. SYNTHESIS: View

#### Commercial:

1. SETTINGS:
<br><br>VIEW: 'Operator, Mission Type, Main Objective, Commercial, Public Project, Published Project'.

2. SYNTHESIS:
<br><br>EDIT: 'UMI Word, Views'.

3. STORYBOARD: View.

#### SuperVisor:

1. STORYBOARD: Generate Pdf, View.

2. SYNTHESIS: View

3. CAMPAIGNS: View

4. SETTINGS:
<br><br>VIEW: 'Domain, Operator, Roadmap, Mission Type, Main Objective, Commercial, Description, Targeting, Blacklist, Answers Anonymous, Public Project, Published Project, Statistics'

#### Market Test Manager:

1. SETTINGS:
<br><br>EDIT: 'Domain, Operator, Roadmap, Mission Type, Main Objective, Commercial, Description, Targeting, Blacklist, Project Tags, Answers Anonymous, Public Project, Published Project, Statistics, Validate Project, Project Revision'.

2. ANSWER TAGS: Edit, Delete.

3. QUESTIONNAIRE: All

4. CAMPAIGNS: All

5. SYNTHESIS: All

6. STORYBOARD: All.

#### Market Test Manager UMI:

1. SETTINGS:
<br><br>EDIT: 'Domain, Operator, Roadmap, Mission Type, Main Objective, Commercial, Description, Targeting, Blacklist, Project Tags, Answers Anonymous, Public Project, Published Project, Statistics, Validate Project, Project Revision'.

2. ANSWER TAGS: Edit, Delete.

3. QUESTIONNAIRE: All

4. CAMPAIGNS: All

5. SYNTHESIS: All

6. STORYBOARD: All.

#### Oper Supervisor:

1. SETTINGS:
<br><br>EDIT: 'Domain, Operator, Roadmap, Mission Type, Main Objective, Commercial, Description, Targeting, Blacklist, Project Tags, Answers Anonymous, Public Project, Published Project, Statistics, Validate Project, Project Revision'.

2. ANSWER TAGS: Edit, Delete.

3. QUESTIONNAIRE: All

4. CAMPAIGNS: All

5. SYNTHESIS: All

6. STORYBOARD: All.

#### Tech:

1. SETTINGS:
<br><br>EDIT: 'Domain, Operator, Roadmap, Mission Type, Main Objective, Commercial, Description, Targeting, Blacklist, Project Tags, Answers Anonymous, Public Project, Published Project, Statistics, Validate Project, Project Revision'.

2. ANSWER TAGS: Edit, Delete.

3. QUESTIONNAIRE: All

4. CAMPAIGNS: All

5. SYNTHESIS: All

6. STORYBOARD: All.

### Example - Market Test Manager role

```
access: { 
    projects: { 
        project: {
            storyboard: {
                edit: true,
                create: true,
                makeVisibleToClient: true,
                changeLang: true,
                generateVideo: true,
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
                edit: true
            }, 
            questionnaire: {
                quiz: {
                    generate: true,
                    view: true
                },
                import: true,
                edit: true
            },
            answerTags: {
                delete: true,
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
                }
            }
        }
    } 
}

```
