# Market Tests Page

Document link:
[a link](https://docs.google.com/document/d/1P083gvT8ObRR4v5uvOoBDRMttz4MKj3qXYozsu4PNx8/edit) 

#### Application route: /user/admin/projects

### Functionalities
1. SEARCH BY: Name, InnovationCard, Type, Company, Objective.
2. T COLUMNS: Name, InnovationCard, Owner, Company, Type, Objective, Last updated, Created, Status.   
3. IMPORT
4. BATCH
5. FILTER BY: Status, Operator


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
