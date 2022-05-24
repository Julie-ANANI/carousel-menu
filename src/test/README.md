# Syntax for unit test 

## Structure of ```/test```
Respect the same directory structure as ```/app``` in ```/test``` 
```angular2html
- /test
    - /service
        - /answer
            - answer-front.spec.ts
    - /directives
    - /guards
    - /interceptors
    - /modules
...
```
## describe/it
```describe```:
1. which component/service
2. which function

```typescript
describe('Service - AnswerFrontService', ()=>{

})

describe('Component - AdminProjectsComponent', ()=>{

})
```
```it or test```: test case

```typescript
it('input = empty list, output = empty list',()=>{})
```
