# Settings Page

#### Application route: /user/admin/settings/blacklist

All notable changes to the Settings page will be documented in this file. 
Please always updates the roles / functionalities in this file. 

### Functionalities

1. BLACKLIST: View, Edit, Add,
<br><br>SEARCH_BY: 'Email_Address', 
<br><br>SORT_BY: 'Reason, Type', 
<br><br>T_COLUMNS: 'Email_Address, Created, Expires, Reason, Type'.

2. COUNTRIES: Exclude, 
<br><br>SEARCH_BY: 'Country'.

3. ENTERPRISES: Add, View, Edit, 
<br><br>SEARCH_BY: 'Name', 
<br><br>T_COLUMNS: 'Logo, Name, Domain, Patterns, Url, Subsidiary, Parent'. 

Here BLACKLIST, COUNTRIES, ENTERPRISES represent the sub tabs.

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Tech:

1. BLACKLIST: All
2. COUNTRIES: All
3. ENTERPRISES: All 

#### Hotline:

1. BLACKLIST: All

### Example - Hotline role

```
access: { 
    settings: { 
        blacklist: { 
            add: true, 
            edit: true, 
            view: true,
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
