## Message Template 2

The selector of this component id is **<app-message-space>**. It includes 3 inputs.

1. **srcImage:** give this value to provide the source of the image. By default it's value is given, but you can add any image.

2. **widthMax:** this is to define the width of the message rectangle box that is appear above the image. It is an optional value. We give this because sometime we have long div so instead of taking the full space we make the box to take specific width. It is an optional value. 

3. **background:** this is to define the color of the background color of the box. It is an optional value. 

<hr>

### How to use 

`<app-message-template-2 [widthMax]="'width'" [srcImage]="'source''" [background]="'color'"> <ng-content></ng-content> </app-message-template-2>`
