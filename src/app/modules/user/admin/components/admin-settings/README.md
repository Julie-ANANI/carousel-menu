# Settings Page

Document link:
[a link](https://docs.google.com/document/d/1P083gvT8ObRR4v5uvOoBDRMttz4MKj3qXYozsu4PNx8/edit) 

#### Application route: /user/admin/settings/blacklist

### Functionalities

1. BLOCKLIST: View, Edit, Add,
<br><br>SEARCH BY:  Email Address, 
<br><br>SORT BY:  Reason, Type, 
<br><br>T COLUMNS:  Email Address, Created, Expires, Reason, Type.

2. COUNTRIES: Exclude, Delete, Edit, View 
<br><br>SEARCH BY:  Country, Acceptation,
<br><br>T COLUMNS: Country, Acceptation, Expiration

3. ENTERPRISES: Add, View, Edit, Delete 
<br><br>SEARCH BY:  Name, Parent
<br><br>T COLUMNS:  Logo, Name, Domain, Patterns, Url, Subsidiary, Parent. 


### Example - Hotline role

```
access: { 
    settings: { 
        blocklist: { 
            add: true, 
            edit: true, 
            searchBy: {
                emailAddress: true
            },
            sortBy: {
                reason: true,
                type: true
            },
            tableColumns: {
                emailAddress: true,
                created: true,
                expires: true,
                type: true,
                reason: true
            }
        }
    } 
}

```
