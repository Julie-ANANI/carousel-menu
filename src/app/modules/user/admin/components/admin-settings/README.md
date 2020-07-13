# Settings Page

#### Application route: /user/admin/settings/blacklist

All notable changes to the Settings page will be documented in this file. 
Please always updates the roles / functionalities in this file. 

### Functionalities

1. BLACKLIST: SEARCH: 'Email_Address', SORT: 'Reason, Type', T_COLUMNS: 'Email_Address,
Created, Expires, Reason, Type', View, Edit, Add.
2. COUNTRIES: Exclude, SEARCH: 'Country'.
3. ENTERPRISES: Add, View, Edit, SEARCH: 'Name', T_COLUMNS: 'Logo, Name, Domain, 
Patterns, Url, Subsidiary, Parent'. 

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
nav: { 
    settings: { 
        blacklist: { 
            add: true, 
            edit: true, 
            view: true,
            search: {
                emailAddress: true
            },
            sort: {
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
