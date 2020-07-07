# Changelog

All notable changes to this project will be documented in this file.

## 1.32.0 - 07 July 2020

### Added
<ul>
    <li>The new interface to do the pitch description.</li>
    <li>Show Questionnaire template in the pitch page.</li>
    <li>Admin/Client interactions and notifications.</li>
    <li>CanDeactivate guard.</li>
    <li>Sidebar to edit pitch description.</li>
    <li>Error message component to show fetching error message.</li>
    <li>Based on the objective create the campaign, questionnaire automatic</li>
    <li>Example button (to show the questionnaire) and preview button (to show the representation of the questionnaire) 
    based on the mission objective.</li>
    <li>Language button in the setup page to add the innovation card in the new language.</li>
    <li>Save button in the targeting page to save the project.</li>
</ul>

### Updated
<ul>
    <li>The visual of the not found page.</li>
    <li>Banner message for the project status.</li>
    <li>Discover page with the new innovation card model.</li>
    <li>Header component is more redefine and animation.</li>
    <li>The visual of the targeting page.</li>
    <li>Roadmap dates sort.</li>
</ul>

### Changed
<ul>
    <li>Use the angular routing for the project page instead of the switch.</li>
</ul>

### Bug fixed
<ul>
    <li>Every time make the changes in the Answer table it gets reload.</li>
    <li>Showing of the Roadmap functionality in every sidebar.</li>
    <li>Shared synthesis page not showing the innovation image.</li>
    <li>Modal is not scrollable.</li>
</ul>

## 1.31.0 - 16 June 2020

### Added
<ul>
  <li>The new interface to generate Project at the client side.</li>
  <li>The new tab Settings in the project page at the client side.</li>
  <li>Functionality to edit the Commercial, Type, Objective under the Settings tab of the project at the admin side.</li>
</ul>

### Updated
<ul>
  <li>Updating the owner of the project updates the Client in ClientProject and Mission also.</li>
</ul>

### Changed

<ul>
  <li>Projects tab to Market Tests tab at the admin side.</li>
  <li>Batch display under the Dashboard tab now under the Market Test tab.</li>
</ul>

## 1.30.0 - 28 February 2020 

### Added

<ul>
  <li>The new interface to generate the Executive Report in the admin side.</li>
  <li>The new tab Storyboard.</li>
  <li>Browser independent printing for executive report.</li>
</ul>

### Updated

<ul>
  <li>Improved the table component. Horizontal scroll only available for the devices screen less then 1440px. Header is fixed while scrolling vertically. Other little improvements.</li>
</ul>

## 1.26.0 - 10 October 2019

### Added

<ul>
  <li>Now operator can add comment and suggestion in the pitch section.</li>
</ul>

### Bug Fixed

<ul>
  <li>In map, now tooltip follows the mouse for the firefox browser.</li>
  <li>Colorized country (in map) when refresh page or visit first time.</li>
  <li>Make the filter icon of professional visible in the synthesis.</li>
  <li>Modal to make the synthesis invisible/end project/reset executive report to the client was not visible properly.</li>
</ul>

### Updated

<ul>
  <li>To disable icon in the css docs.</li>
</ul>

## 1.25.0 - 23 September 2019

### Added

<ul>
  <li>Put Russia in Europe</li>
  <li>Update project form (client-side) and remove 'status' & 'patent' questions</li>
  <li>Generate a quiz and get link from quiz tab</li>
  <li>Professional shield active for new batches</li>
  <li>Shielded professionals list: Admin->Monitoring->Shield</li>
  <li>Innovations can now be targeted by country.</li>
  <li>A universal targeting model.</li>
</ul>

### Bug Fixed

<ul>
  <li>The campaign is added to the webpage when creating a new campaign.</li>
  <li>Tags are updated in synthesis when operators add/remove a tag.</li>
  <li>Sidebar display questions with no filters available.</li>
  <li>Shared synthesis missed a provider (now added).</li>
</ul>

### Updated

<ul>
  <li>The interface of the autocomplete input.</li>
  <li>The world map is now only used to paint the countries that are being selected or targeted. No click event on the map.</li>
</ul>

## 1.24.0 - 11 September 2019

### Added

<ul>
  <li>Internet Explorer 9/10/11 support</li>
  <li>Client impersonation for super-admins</li>
  <li>Access Control List for demo tools. Experiment of modularization.</li>
  <li>The redirection to the last URL after login.</li>
  <li>Tabs, tooltips, sidebar, flexbox grid and responsive css classes in the application documentation.</li>
  <li>Message template 1 and 2 components in the application documentation.</li>
</ul>

### Bug Fixed

<ul>
  <li>The loading display in sign up form sidebar while creating account.</li>
  <li>Css problem in the submit project modal.</li>
  <li>Css scroll problem when defining the questionnaire for the multiple choice.</li>
</ul>

## 1.23.0 - 26 August 2019

### Added

<ul>
  <li>Import / export of the questionnaires library.</li>
  <li>Import / export of the tags library.</li>
  <li>Import / export of an innovation (with an option to make personal data anonymous).</li>
  <li>Import / export of campaigns of an innovation.</li>
  <li>Import / export of the workflow library.</li>
</ul>

### Bug Fixed

<ul>
  <li>Edit button in the user's sidebar response.</li>
  <li>Navigation menu options for mobile devices.</li>
  <li>Display of pitch and targeting in the sidebar on the admin side.</li>
</ul>

## 1.22.0 - 05 August 2019

### Added

<ul>
  <li>Be able to edit the advantages that are already added in the pitch.</li>
  <li>The help text for the client in the pitch to describe the innovation better.</li>
  <li>Display the tags of the respondents for the answers of the radio and checkbox in the synthesis</li>
</ul>

### Changed

<ul>
  <li>Change the button text of the edit collaborators to manage collaborators in the project page of client side.</li>
</ul>
