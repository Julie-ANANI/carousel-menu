# UMI Style Framework

It is the css framework for the UMI applications i.e. build on Sass. 
The aim is to have the unified styles for all the 
applications:

- umi-application-front
- umi-community-front
- umi-quiz-application-front

### Please be careful not to change the files directly of this repository when added as a sub-project.

###To add this repository to another repository as a clone run the following commands from the root path:
- git remote add style-framework git@github.com:unitedmotionideas/umi-style-framework.git
- git subtree add --prefix style-framework style-framework main --squash

### To pull the changes:
- git subtree pull --prefix style-framework style-framework main --squash

### To use in other application:
add this **@import "style-framework/scss/umi"** in the style.scss file after the repo is added.

### For debugging purpose and testing:
sass --watch scss/umi.scss:css/umi.css
