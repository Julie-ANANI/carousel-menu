# UMI Style Framework

It is the css framework for the UMI applications. 
The aim is to have the unified styles for all the 
applications:

- umi-application-front
- umi-community-front
- umi-quiz-application-front

### For debugging purpose, updating and testing:
always run this command in the terminal before you start making changes. It will generate the css file for the scss.

```
npm run watch
```

or

```
sass --watch scss/umi.scss:css/umi.css
```

### Installation
```
npm i @umius/umi-style-framework
```

### Import it in style.scss or angular.json under assets. 

Import path for the SCSS files:

```
@import "~@umius/umi-style-framework/scss/variables";
```

or 

```
node_modules/@umius/umi-style-framework/scss/umi.scss
```


### Updating the package
1. Always make changes in the scss files not in the css file.
2. Update package version in **package.json** and git tag and then publish it to the npm.

### To publish the package

run this cmd in terminal `npm run publish`.
