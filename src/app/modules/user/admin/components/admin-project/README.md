# Project Page

#### Application route: /user/admin/projects/project/:projectId/settings

All notable changes to the Project page will be documented in this file. 
Please always updates the roles / functionalities in this file. The Keys should be same in the back also.

### Functionalities

1. SETTINGS: 
<br><br>VIEW: 'Domain, Operator, Owner, Mission, Roadmap, Mission_Type, Main_Objective, Commercial, Description, Language, Targeting, Blacklist, Status, Project_Tags, Answers_Tags, Answers_Anonymous, Professional_Identified, Ab_Testing, Workflow_Emails, Workflow_Select, Launch_Auto_Batch, Insights_To_Validate, Public_Project, Published_Project, Go_To_Synthesis, Ending_Mail_Campaign, Project_Restitution, Client_Satisfaction, Mission_Feedback, Statistics', 
<br><br>EDIT: 'Domain, Operator, Owner, Mission, Roadmap, Mission_Type, Main_Objective, Commercial, Description, Language, Targeting, Blacklist, Status, Project_Tags, Answers_Tags, Answers_Anonymous, Professional_Identified, Ab_Testing, Workflow_Emails, Workflow_Select, Launch_Auto_Batch, Insights_To_Validate, Public_Project, Published_Project, Go_To_Synthesis, Ending_Mail_Campaign, Client_Satisfaction, Mission_Feedback, Statistics, Validate_Project, Project_Revision'.

2. ANSWER_TAGS: View, Edit, Add, Delete.

3. QUESTIONNAIRE: Import, View, Edit, 
<br><br>QUIZ: 'View, Generate'. 

4. CAMPAIGNS: Edit, Add, Update_Statistics, Delete, View.
 
5. SYNTHESIS: 
<br><br>EDIT: 'UMI_Word, Respondent_Profile, Views, Question_Tags'.

6. STORYBOARD: Create, View, Generate_Video, Generate_Pdf, Change_Language, Make_Visible_To_Client, Edit, Autofill. 

7. FOLLOW_UP:
<br><br>VIEW: 'Answer', 
<br><br>EDIT: 'Answer, Objective, Views',
<br><br>WORKFLOW: 'View, Edit, Test, Send',
<br><br>T_COLUMNS: 'Name, Country, Language, Job, Company, Objective'.  

Here SETTINGS, ANSWER_TAGS, QUESTIONNAIRE, CAMPAIGNS, SYNTHESIS, STORYBOARD, FOLLOW_UP represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Community

1. QUESTIONNAIRE: Edit,
<br><br>QUIZ: 'VIEW'. 

2. FOLLOW_UP: All 

#### Hotline:

1. SETTINGS:
<br><br>VIEW: 'Operator, Mission_Type, Main_Objective, Commercial, Blacklist, Statistics',
<br><br>EDIT: 'Blacklist, Statistics'.

2. CAMPAIGNS: View

3. FOLLOW_UP: All

#### Marketing:

1. SETTINGS:
<br><br>VIEW: 'Operator, Mission_Type, Main_Objective, Commercial, Public_Project, Published_Project'.

2. SYNTHESIS

#### Commercial:

1. SETTINGS:
<br><br>VIEW: 'Operator, Mission_Type, Main_Objective, Commercial, Public_Project, Published_Project'.

2. SYNTHESIS:
<br><br>EDIT: 'UMI_Word, Views'.

3. STORYBOARD: View.

#### SuperVisor:

1. STORYBOARD: Generate_Pdf, View.

2. SYNTHESIS:

3. CAMPAIGNS: View

4. SETTINGS:
<br><br>VIEW: 'Domain, Operator, Roadmap, Mission_Type, Main_Objective, Commercial, Description, Targeting, Blacklist, Answers_Anonymous, Public_Project, Published_Project, Statistics'

#### Market Test Manager:

1. SETTINGS:
<br><br>EDIT: 'Domain, Operator, Roadmap, Mission_Type, Main_Objective, Commercial, Description, Targeting, Blacklist, Project_Tags, Answers_Anonymous, Public_Project, Published_Project, Statistics, Validate_Project, Project_Revision'.

2. ANSWER_TAGS: Edit, Delete.

3. QUESTIONNAIRE: All

4. CAMPAIGNS: All

5. SYNTHESIS: All

6. STORYBOARD: All.

#### Market Test Manager UMI:

1. SETTINGS:
<br><br>EDIT: 'Domain, Operator, Roadmap, Mission_Type, Main_Objective, Commercial, Description, Targeting, Blacklist, Project_Tags, Answers_Anonymous, Public_Project, Published_Project, Statistics, Validate_Project, Project_Revision'.

2. ANSWER_TAGS: Edit, Delete.

3. QUESTIONNAIRE: All

4. CAMPAIGNS: All

5. SYNTHESIS: All

6. STORYBOARD: All.

#### Oper Supervisor:

1. SETTINGS:
<br><br>EDIT: 'Domain, Operator, Roadmap, Mission_Type, Main_Objective, Commercial, Description, Targeting, Blacklist, Project_Tags, Answers_Anonymous, Public_Project, Published_Project, Statistics, Validate_Project, Project_Revision'.

2. ANSWER_TAGS: Edit, Delete.

3. QUESTIONNAIRE: All

4. CAMPAIGNS: All

5. SYNTHESIS: All

6. STORYBOARD: All.

#### Tech:

1. SETTINGS:
<br><br>EDIT: 'Domain, Operator, Roadmap, Mission_Type, Main_Objective, Commercial, Description, Targeting, Blacklist, Project_Tags, Answers_Anonymous, Public_Project, Published_Project, Statistics, Validate_Project, Project_Revision'.

2. ANSWER_TAGS: Edit, Delete.

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
