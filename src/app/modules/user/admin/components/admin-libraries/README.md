# Libraries Page

#### Application route: /user/admin/libraries/workflows

All notable changes to the Libraries page will be documented in this file. 
Please always updates the roles / functionalities in this file. 

### Functionalities

1. WORKFLOWS: Add, Edit, View, Change_Language, Import, Export, Delete.

2. EMAILS: Add, Modify, View, Change_Language, Delete.

3. QUESTIONNAIRE: Add, Edit, View, Delete, 
<br><br>SEARCH_BY: 'Name, Domain'. 

4. SIGNATURES: Add, View, Edit, Delete, 
<br><br>SEARCH_BY: 'Name, Author, Language, Email_Address'.

Here WORKFLOWS, EMAILS, QUESTIONNAIRE, SIGNATURES represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Tech:

1. WORKFLOWS: All
2. EMAILS: All
3. QUESTIONNAIRE: All 
4. SIGNATURES: All

#### Market Test Manager:

1. WORKFLOWS: Add, Edit, Change_Language.

2. QUESTIONNAIRE: Add, Edit, View, Delete, 
<br><br>SEARCH_BY: 'Name'.

### Example - Market Test Manager role

```
nav: { 
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
    } 
}

```
