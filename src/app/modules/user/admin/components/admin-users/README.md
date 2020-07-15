# Users Page

#### Application route: /user/admin/users

All notable changes to the Users will be documented in this file. 
Please always updates the roles / functionalities in this file. 

### Functionalities

1. SEARCH_BY: Name, Email, Job, Domain.
2. T_COLUMNS: Name, Job, Enterprise, Domain, Created.   
3. PROFILE: View, Edit, Impersonate, Affect as Admin. 

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Tech:

1. SEARCH_BY: All
2. T_COLUMNS: All
3. PROFILE: All

#### Commercial:

1. SEARCH_BY: Name, Email.
2. T_COLUMNS: Name, Job, Enterprise.
3. PROFILE: View

#### Market Test Manager:

1. SEARCH_BY: All
2. T_COLUMNS: All
3. PROFILE: View, Edit, Impersonate.

#### Community:

1. SEARCH_BY: All
2. T_COLUMNS: All
3. PROFILE: View, Edit, Impersonate.

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
            enterprise: true, 
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

```
