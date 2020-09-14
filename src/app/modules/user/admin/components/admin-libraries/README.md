# Libraries Page

Document link:
[a link](https://docs.google.com/document/d/1P083gvT8ObRR4v5uvOoBDRMttz4MKj3qXYozsu4PNx8/edit) 

#### Application route: /user/admin/libraries/workflows

### Functionalities

1. WORKFLOWS: Add, Edit, View, Delete.

2. EMAILS: Add, Modify, View, Delete.

3. QUESTIONNAIRE: Add, Edit, View, Delete, Clone, 
<br><br>SEARCH BY:  Name, Domain. 

4. SIGNATURES: Add, View, Edit, Delete, 
<br><br>SEARCH BY:  Name, Author, Language, Email Address.


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
