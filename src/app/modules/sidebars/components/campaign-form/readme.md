# Facts about Me

The selector is **<app-campaign-form>**. It includes 2 inputs and 1 output. This component is only used when we want to update the innovation campaign information's.   

## Input - campaign

It is to receive the innovation campaign of the parent component.

## Input - type

It is to tell this component which template the parent component is requesting and what it wants to do. Based on that value we call the function loadTypes that will activate the different variables, templates. Right now, we have 

1. editName: it will activate the template to edit the name of the campaign.

## Output - campaignOutput

After updating the value in this component we output the value using the event emitter and perform the action. 

## how to use

Include this in the parent component html file, 

<app-sidebar [(template)]="sidebarValue">
<br><app-campaign-form [sidebarState]="sidebarValue.animate_state" [type]="sidebarValue.type" [campaign]="selectCampaign" (campaignOutput)="updateCampaign($event)">
<br></app-campaign-form>
<br></app-sidebar>

## Can be used for

1. edit the name of the campaign.


