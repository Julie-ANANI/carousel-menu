# Market Tests Page

#### Application route: /user/admin/projects

All notable changes to the Market Tests page will be documented in this file. 
Please always updates the roles / functionalities in this file.  

### Functionalities
1. SEARCH BY: Name, InnovationCard, Type, Company, Objective.
2. T COLUMNS: Name, InnovationCard, Owner, Company, Type, Objective, Last updated,
Created, Status.   
3. IMPORT
4. BATCH
5. FILTER BY: Status, Operator

### Access of the functionalities based on the roles - by default Root will access all.

No definition of a Role means no access to that user.

#### Tech:

1. SEARCH BY: All
2. T COLUMNS: All
3. BATCH
4. FILTER BY: All

#### Hotline: 

1. SEARCH BY: All
2. T COLUMNS: Name, Innovation Card, Company, Type, Objective, Created, Status.
3. BATCH
4. FILTER BY: All

#### Marketing:

1. SEARCH BY: ALL
2. T COLUMNS: Name, Innovation Card, Company, Type, Objective, Created, Status.
4. FILTER BY: All

#### Commercial:

1. SEARCH BY: ALL
2. T COLUMNS: Name, Innovation Card, Company, Type, Objective, Created, Status.
4. FILTER BY: All

#### Supervisor:

1. SEARCH BY: ALL
2. T COLUMNS: Name, Innovation Card, Company, Type, Objective, Created, Status.
4. FILTER BY: All

#### Community

1. SEARCH BY: ALL
2. T COLUMNS: Name, Innovation Card, Company, Type, Objective, Created, Status.
4. FILTER BY: All

#### Market Test Manager:

1. SEARCH BY: All
2. T COLUMNS: ALL
3. BATCH
4. FILTER BY: All

#### Market Test Manager UMI:

1. SEARCH BY: All
2. T COLUMNS: ALL
3. BATCH
4. FILTER BY: All

#### Oper Supervisor:

1. SEARCH BY: All
2. T COLUMNS: ALL
3. BATCH
4. FILTER BY: All

#### Tech:

1. SEARCH BY: All
2. T COLUMNS: ALL
3. BATCH
4. FILTER BY: All

### Example - Hotline role

```
access: { 
    projects: {
        filterBy: {
            status: true, 
            operator: true
        }, 
        searchBy: { 
            name: true, 
            innovationCard: true, 
            type: true, 
            company: true,
            objective: true 
        }, 
        tableColumns: { 
            name: true, 
            innovationCard: true, 
            company: true, 
            type: true, 
            objective: true 
        }, 
        batch: true
    } 
}

```
