# umi-application-front

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7.

## Development server

Lancer `ng serve -c=local [--prod]` pour lancer le serveur web de développement en local. 

Se rendre sur `http://localhost:4200/`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
From the command prompt, type `npm run build:ssr`  

The Angular CLI compiles and bundles the universal app into two different folders, browser and server. Webpack transpiles the server.ts file into Javascript.

## Serve
After building the application, start the server.  

`npm run serve:ssr`

Or build the server and run it by doing :
```
npm run universal
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
