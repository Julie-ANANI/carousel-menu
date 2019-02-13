# Facts about Me

The selector of this component id **<app-message-space>**. It includes 4 inputs.

1. messageA: give this when you want to add the continue message without any break in the messages. It is an optional value. 

2. messageB: give this when you want to add the second message that will appear after the break of the line. It is an optional value. 

3. srcImage: give this value to provide the source of the image. By default it's value is given, but you can add any image.

4. widthMax: this is to define the width of the message rectangle box that is appear above the image. It is an optional value. We give this because sometime we have long div so instead of taking the full space we make the box to take specific width. It is an optional value. 


## how to use 

<app-message-space [messageA]="'firstMessage'" [messageB]="'secondMessage'" [widthMax]="'width'" [srcImage]="'source''">
<br></app-message-space>
