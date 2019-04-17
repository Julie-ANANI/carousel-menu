#Facts about Me

The selector of this component is **"<app-modal-media>"**. It includes 2 input: a: showModal, b: mediaSrc.

## how to use it: 

In the html file of the parent component, add this 

<app-modal [(showModal)]="displayVariable" [widthMax]="width">
<br>**"Add your content here"** 
<br></app-modal>

1. displayVariable: this is to make modal active and inactive. This variable should have getter and setter.

2. mediaSrc: in this just pass the src.

