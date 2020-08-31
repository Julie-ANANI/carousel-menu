# Settings Page

#### Application route: /user/admin/settings/blacklist

All notable changes to the Settings page will be documented in this file. 
Please always updates the roles / functionalities in this file. 

### Functionalities

1. BLACKLIST: View, Edit, Add,
<br><br>SEARCH BY:  Email Address, 
<br><br>SORT BY:  Reason, Type, 
<br><br>T COLUMNS:  Email Address, Created, Expires, Reason, Type.

2. COUNTRIES: Exclude, Delete, Edit, View 
<br><br>SEARCH BY:  Country, Acceptation,
<br><br>T COLUMNS: Country, Acceptation, Expiration

3. ENTERPRISES: Add, View, Edit, 
<br><br>SEARCH BY:  Name, 
<br><br>T COLUMNS:  Logo, Name, Domain, Patterns, Url, Subsidiary, Parent. 

Here BLACKLIST, COUNTRIES, ENTERPRISES represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Hotline:

1. BLACKLIST: All

### Example - Hotline role

```
access: { 
    settings: { 
        blacklist: { 
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
