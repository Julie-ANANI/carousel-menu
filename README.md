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

### Import it in style.scss or angular.json under assets. 

Import path for the SCSS files:
```
node_modules/@umius/umi-style-framework/scss/umi.scss
```

Import path for the CSS file:
```
node_modules/@umius/umi-style-framework/css/umi.css
```

### For debugging purpose, updating and testing:
always run this command in the terminal before you start making changes. It will generate the css file for the scss.
```
sass --watch scss/umi.scss:css/umi.css
```

### Updating the package
1. Do forget to generate the css file.
2. Always make changes in the scss files not in the css file.<br>
3. Update package version and tag and then publish it to the npm.
