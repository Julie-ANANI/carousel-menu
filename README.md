# umi-application client

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 1.0.1.

Il utilise Angular Universal pour calculer un pré-rendu qui sera restitué au client, favorisant le SEO.

## Développement

Lancer `ng serve` pour lancer le serveur web de développement. 

Se rendre sur `http://localhost:4200/`.

L'application va automatiquement se recharger si une modification est faite sur son code source.

## Génération de nouveaux composants avec Angular CLI

Lancer `ng generate <component|directive|pipe|service|class|module> <componentName>` pour générer un nouveau composant. 

## Build - Préparation pour mise en production

Lancer `npm build` pour *builder* le projet. Ajouter le paramètre  `-prod` pour *builder* la version de production.

La version *buildée* est stockée dans le dossier `dist/`.

### Pour builder l'application et la distribuer avec Angular Universal

*Remplace l'étape précédente..*

***https://medium.com/@evertonrobertoauler/angular-4-universal-app-with-angular-cli-db8b53bba07d***

Lancer `npm start`. Cette commande lance les tests *end-to-end* et *builde* le projet comme précédemment (en version de production compressée). Elle lance ensuite un serveur Node.js distribuant l'application avec **Angular Universal**. 

L'application est alors accessible à l'adresse `http://localhost:3080`.

## Lancement des tests unitaires

Lancer `ng test` pour exécuter les tests unitaires avec [Karma](https://karma-runner.github.io).

## Lancement des tests *end-to-end*

Lancer `ng e2e` pour exécuter les tests end-to-end avec [Protractor](http://www.protractortest.org/).
Avant de lancer les tests, ne pas oublier de servir l'application avec `ng serve`.
