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
If someone changes this file please do forget to generate the css map file by running the above command. <br>
Always do the update in the scss files not in the css files. 

### Please be careful not to change the files directly of this repository when added as a sub-project.

###To add this repository to another repository as a clone run the following commands from the root path:
- git remote add style-framework git@github.com:unitedmotionideas/umi-style-framework.git
- git subtree add --prefix style-framework style-framework main --squash

### To pull the changes:
- git subtree pull --prefix style-framework style-framework main --squash

### To use in other application:
add this **@import "style-framework/scss/umi"** in the style.scss file after the repo is added.
