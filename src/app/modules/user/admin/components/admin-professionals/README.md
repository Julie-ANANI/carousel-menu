# Professionals Page

#### Application route: /user/admin/professionals

All notable changes to the Professionals page will be documented in this file. 
Please always updates the roles / functionalities in this file. 

### Functionalities

1. SEARCH_BY: Name, Email, Job, Country, Enterprise.
2. T_COLUMNS: Member, Name, Country, Job, Enterprise, Campaign, Contact.   
3. PROFILE: View, Edit, Delete. 

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Tech:

1. SEARCH_BY: All
2. T_COLUMNS: All
3. PROFILE: All

#### Hotline:

1. SEARCH_BY: All
2. T_COLUMNS: Member, Name, Country, Job, Enterprise.
3. PROFILE: All

#### Market Test Manager:

1. SEARCH_BY: All
2. T_COLUMNS: Member, Name, Country, Job, Enterprise.
3. PROFILE: All

### Example - Market Test Manager role

```
nav: { 
    professionals: { 
        searchBy: { 
            name: true, 
            email: true, 
            job: true, 
            country: true,
            enterprise: true
        }, 
        tableColumns: { 
            name: true, 
            job: true, 
            enterprise: true, 
            member: true, 
            country: true 
        }, 
        profile: { 
            view: true, 
            edit: true, 
            delete: true
        },
    } 
}

```
