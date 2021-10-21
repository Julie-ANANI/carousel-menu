# UMI Style Framework

It is the css framework for the UMI applications. 
The aim is to have the unified styles for all the 
applications:

- umi-application-front
- umi-community-front
- umi-quiz-application-front

### Installation
```
npm i @umius/umi-style-framework
```

Then, you can import it in style.scss or angular.json under assets. 

### Import path for the SCSS files
```
node_modules/@umius/umi-style-framework/scss/umi.scss
```

### Import path for the CSS files
```
node_modules/@umius/umi-style-framework/css/umi.css
```

### For debugging purpose and testing:
```
sass --watch scss/umi.scss:css/umi.css
```

### Updating
1. If someone changes this file please do forget to generate the css map file by running 
```
sass --watch scss/umi.scss:css/umi.css
``` 
2. Always do the update in the scss files not in the css files.<br>

#### Do not forget to update its version and tag and then publish the package to the npm.
