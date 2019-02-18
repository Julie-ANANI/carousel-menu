#Facts about Me

The selector of this component is **"<app-modal>"**. It includes 3 input: a: showModal, b: widthMax and c: modalTitle.

## how to use it: 

In the html file of the parent component, add this 

<app-modal [(showModal)]="displayVariable" [modalTitle]="title" [widthMax]="width">
<br>**"Add your content here"** 
<br></app-modal>

1. displayVariable: this is to make modal active and inactive. This variable should have getter and setter.

2. title: this is to add the title to the modal. This is an optional value. If you provide this value it will add header class to the modal with the title and the close icon.

3. width: this is to increase the width of the modal container, if you provide the value it will make the modal of that width. By default the width of the modal is 640px.


## if you want

to add the action buttons at the footer of this modal than, add the **class="modal-footer"** to the **div** and inside that div **declare two buttons**, give **first button these class="btn btn-sm btn-cancel"** and **text** inside this button is **{{ 'COMMON.CANCEL' | translate }}**, and to the **second button** give **these class="btn btn-sm btn-primary"** and also add the **click listener** to it.  
