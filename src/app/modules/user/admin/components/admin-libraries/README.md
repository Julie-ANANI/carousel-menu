# Libraries Page

#### Application route: /user/admin/libraries/workflows

All notable changes to the Libraries page will be documented in this file. 
Please always updates the roles / functionalities in this file. 

### Functionalities

1. WORKFLOWS: Add, Edit, View, Delete.

2. EMAILS: Add, Modify, View, Delete.

3. QUESTIONNAIRE: Add, Edit, View, Delete, Clone, 
<br><br>SEARCH BY:  Name, Domain. 

4. SIGNATURES: Add, View, Edit, Delete, 
<br><br>SEARCH BY:  Name, Author, Language, Email Address.

Here WORKFLOWS, EMAILS, QUESTIONNAIRE, SIGNATURES represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Market Test Manager:

1. WORKFLOWS: Add, Edit.

2. QUESTIONNAIRE: Add, Edit, Delete, Clone, 
<br><br>SEARCH BY:  Name.

#### Market Test Manager UMI:

1. WORKFLOWS: Add, Edit.

2. QUESTIONNAIRE: Add, Edit, Delete, Clone,
<br><br>SEARCH BY:  Name.

#### Oper Supervisor:

1. WORKFLOWS: Add, Edit.

2. QUESTIONNAIRE: Add, Edit, Delete, Clone,
<br><br>SEARCH BY:  Name.

#### Tech:

1. WORKFLOWS: Add, Edit.

2. QUESTIONNAIRE: Add, Edit, Delete, Clone,
<br><br>SEARCH BY:  Name.

### Example - Market Test Manager role

```
access: { 
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
    } 
}

```
