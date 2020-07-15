# Market Tests Page

#### Application route: /user/admin/projects

All notable changes to the Market Tests page will be documented in this file. 
Please always updates the roles / functionalities in this file.  

### Functionalities
1. SEARCH_BY: Name, InnovationCard, Type, Enterprise, Status, Operator, Objective.
2. T_COLUMNS: Name, InnovationCard, Owner, Enterprise, Type, Objective, Last updated,
Created, Status.   
3. IMPORT_PROJECT
4. BATCH

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Tech:

1. SEARCH_BY: All
2. T_COLUMNS: All
3. BATCH

#### Hotline: 

1. SEARCH_BY: All
2. T_COLUMNS: Name, InnovationCard, Enterprise, Type, Objective, Created, Status.
3. BATCH

#### Marketing:

1. SEARCH_BY: ALL
2. T_COLUMNS: Name, InnovationCard, Enterprise, Type, Objective, Created, Status.

#### Commercial:

1. SEARCH_BY: ALL
2. T_COLUMNS: Name, InnovationCard, Enterprise, Type, Objective, Created, Status.

#### Market Test Manager:

1. SEARCH_BY: All
2. T_COLUMNS: ALL
3. BATCH

### Example - Hotline role

```
nav: { 
    projects: { 
        searchBy: { 
            name: true, 
            innovationCard: true, 
            type: true, 
            enterprise: true, 
            status: true, 
            operator: true, 
            objective: true 
        }, 
        tableColumns: { 
            name: true, 
            innovationCard: true, 
            enterprise: true, 
            type: true, 
            objective: true 
        }, 
        batch: true
    } 
}

```
