# Users Page

Document link:
[a link](https://docs.google.com/document/d/1P083gvT8ObRR4v5uvOoBDRMttz4MKj3qXYozsu4PNx8/edit) 

#### Application route: /user/admin/users

### Functionalities

1. SEARCH BY: Name, Email, Job, Domain.
2. T COLUMNS: Name, Job, Company, Domain, Created.   
3. USER: View, Edit, Impersonate, Affect as Admin, Delete. 

### Example - Market Test Manager role

```
access: { 
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
            edit: true, 
            impersonate: true
        },
    } 
}

```
