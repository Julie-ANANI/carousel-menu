# Professionals Page

Document link:
[a link](https://docs.google.com/document/d/1P083gvT8ObRR4v5uvOoBDRMttz4MKj3qXYozsu4PNx8/edit) 

#### Application route: /user/admin/professionals

### Functionalities

1. SEARCH BY: Name, Email, Job, Country, Company.
2. T COLUMNS: Member, Name, Country, Job, Company, Campaign, Contact.   
3. USER: View, Edit, Delete. 


### Example - Market Test Manager role

```
access: { 
    professionals: { 
        searchBy: { 
            name: true, 
            email: true, 
            job: true, 
            country: true,
            company: true
        }, 
        tableColumns: { 
            name: true, 
            job: true, 
            company: true, 
            member: true, 
            country: true 
        }, 
        user: { 
            edit: true, 
            delete: true
        },
    } 
}

```
