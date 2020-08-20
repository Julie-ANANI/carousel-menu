# Users Page

#### Application route: /user/admin/users

All notable changes to the Users will be documented in this file. 
Please always updates the roles / functionalities in this file. 

### Functionalities

1. SEARCH BY: Name, Email, Job, Domain.
2. T COLUMNS: Name, Job, Company, Domain, Created.   
3. USER: View, Edit, Impersonate, Affect as Admin, Delete. 

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Community:

1. SEARCH BY: All
2. T COLUMNS: All
3. USER: Edit, Impersonate.

#### Commercial:

1. SEARCH BY: Name, Email.
2. T COLUMNS: Name, Job, Company.
3. USER: View

#### Supervisor:

1. SEARCH BY: Name, Email.
2. T COLUMNS: Name, Job, Company.
3. USER: View

#### Market Test Manager:

1. SEARCH BY: All
2. T COLUMNS: All
3. USER: Edit, Impersonate.

#### Market Test Manager UMI:

1. SEARCH BY: All
2. T COLUMNS: All
3. USER: Edit, Impersonate.

#### Oper Supervisor:

1. SEARCH BY: All
2. T COLUMNS: All
3. USER: Edit, Impersonate.

#### Tech:

1. SEARCH BY: All
2. T COLUMNS: All
3. USER: Edit, Impersonate.

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
