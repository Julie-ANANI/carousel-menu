# Project Page

#### Application route: /user/admin/projects/project/:projectId/settings

All notable changes to the Project page will be documented in this file. 
Please always updates the roles / functionalities in this file. The Keys should be same in the back also.

### Functionalities

1. SETTINGS: 
<br><br>VIEW: 'Domain, Operator, Owner, Mission, Roadmap, Mission_Type, Main_Objective, Commercial, Description, Language, Targeting, Blacklist, Status, Project_Tags, Answers_Tags, Answers_Anonymous, Professional_Identified, Ab_Testing, Workflow_Emails, Workflow_Select, Launch_Auto_Batch, Insights_To_Validate, Public_Project, Published_Project, Go_To_Synthesis, Ending_Mail_Campaign, Project_Restitution, Client_Satisfaction, Mission_Feedback, Statistics', 
<br><br>EDIT: 'Domain, Operator, Owner, Mission, Roadmap, Mission_Type, Main_Objective, Commercial Description, Language, Targeting, Blacklist, Status, Project_Tags, Answers_Tags, Answers_Anonymous, Professional_Identified, Ab_Testing, Workflow_Emails, Workflow_Select, Launch_Auto_Batch, Insights_To_Validate, Public_Project, Published_Project, Go_To_Synthesis, Ending_Mail_Campaign, Client_Satisfaction, Mission_Feedback, Statistics, Validate_Project, Project_Revision'.

2. ANSWER_TAGS: View, Edit, Add, Delete.

3. QUESTIONNAIRE: Import, View, Edit, Add_Questions_Tags, Delete_Tag, 
<br><br>QUIZ: 'View, Generate'. 

4. CAMPAIGNS: Edit, Add, Update_Statistics, Delete, View.
 
5. SYNTHESIS: Filter, Views, 
<br><br>VIEW: 'UMI_Word, Pros_Tags, Questions_Tags, Profiles_Tags, Answers_Tags, Respondent_Profile, Statistics, Respondent_Comments', 
<br><br>EDIT: 'UMI_Word, Pros_Tags, Questions_Tags, Profiles_Tags, Answers_Tags, Respondent_Profile, Statistics, Respondent_Comments'.

6. STORYBOARD: Create, View, Generate_Video, Generate_Pdf, Change_Language, Make_Visible_To_Client, Edit, Autofill. 

7. FOLLOW_UP:
<br><br>VIEW: 'Answer', 
<br><br>EDIT: 'Answer, Objective, Views',
<br><br>WORKFLOW: 'View, Edit, Test, Send',
<br><br>T_COLUMNS: 'Name, Country, Language, Job, Company, Objective'.  

Here SETTINGS, ANSWER_TAGS, QUESTIONNAIRE, CAMPAIGNS, SYNTHESIS, STORYBOARD, FOLLOW_UP represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Tech:

1. SETTINGS: All
2. ANSWER_TAGS: All
3. QUESTIONNAIRE: All,
4. CAMPAIGNS: All,
5. SYNTHESIS: All,
6. STORYBOARD: All,
7. FOLLOW_UP: All

#### Hotline:

1. SETTINGS:
<br><br>VIEW: 'Operator, Mission_Type, Main_Objective, Commercial, Blacklist, Statistics',
<br><br>EDIT: 'Blacklist, Statistics'.

2. CAMPAIGNS: View

3. FOLLOW_UP: All

#### Marketing:

1. SETTINGS:
<br><br>VIEW: 'Operator, Mission_Type, Main_Objective, Commercial, Public_Project, Published_Project'.

2. SYNTHESIS: 
<br><br>VIEW: 'UMI_Word, Pros_Tags, Questions_Tags, Profiles_Tags, Answers_Tags, Respondent_Profile, Statistics, Respondent_Comments'

#### Commercial:

1. SETTINGS:
<br><br>VIEW: 'Operator, Mission_Type, Main_Objective, Commercial, Public_Project, Published_Project'.

2. SYNTHESIS: Filter, Views, 
<br><br>VIEW: 'UMI_Word, Pros_Tags, Questions_Tags, Profiles_Tags, Answers_Tags, Respondent_Profile, Statistics, Respondent_Comments', 
<br><br>EDIT: 'UMI_Word'.

3. STORYBOARD: View.

#### Market Test Manager:

1. SETTINGS:
<br><br>VIEW: 'Domain, Operator, Roadmap, Mission_Type, Main_Objective, Commercial, Description, Targeting, Blacklist, Project_Tags, Answers_Anonymous, Public_Project, Published_Project, Statistics',
<br><br>EDIT: 'Domain, Operator, Roadmap, Mission_Type, Main_Objective, Commercial, Description, Targeting, Blacklist, Project_Tags, Answers_Anonymous, Public_Project, Published_Project, Statistics, Validate_Project, Project_Revision'.

2. ANSWER_TAGS: View, Edit, Delete.

3. QUESTIONNAIRE: All

4. CAMPAIGNS: All

5. SYNTHESIS: All

6. STORYBOARD: All.

#### Community

1. QUESTIONNAIRE: View, Edit, Add_Questions_Tags, Delete_Tag, QUIZ: 'View, Save'. 

2. FOLLOW_UP: All 

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
                view: true,
                autofill: true,
                generatePdf: true
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
                edit: true,
                view: true
            }, 
            questionnaire: {
                quiz: {
                    generate: true,
                    view: true
                },
                deleteTag: true,
                addQuestionsTags: true,
                import: true,
                view: true,
                edit: true
            },
            answerTags: {
                delete: true
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
                }
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
    } 
}

```
