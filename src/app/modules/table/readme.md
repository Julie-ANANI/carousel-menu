#Table Component

### Attributes / Properties:

1. <b>_selector*:</b> used for the pagination component.
2. <b>_title:</b> defines the title to show for the table. It is optional. By default the title is 'Result';
3. <b>_isSelectable:</b> set this value to true, if you want to select the total content that are visible and perform the mass action on them.  
4. <b>_isEditable:</b> set this value to true, if you want the row hover button to show label 'Edit'. By default the value is 'Show'.
5. <b>_isTitle</b> set this value to true, if you want to display the title.
6. <b>_isDeletable:</b> set this value to true, if you want to perform the 'Delete' action either on the single row or multiple row.  
7. <b>_isSearchable:</b> set this value to true, if you want user to perform the 'Search' operation on the table content.  
8. <b>_columns*:</b> defines the columns for the table.
9. <b>_editIndex:</b> defines on which column you want to show the 'Edit/Show' button.
10. <b>_isPaginable:</b> set this value to true, if you want to introduce the pagination for the table.
11. <b>_editButtonLabel:</b> defines the label for the edit button apart from 'Edit/Show'.
12. <b>_buttons:</b> defines the array of actions you want to perform apart from delete action on the single row or multiple row.
13. <b>_isLocal:</b> set this value to true, if you fetched all the contents at one time, and now you don't want to call the API to fetch the content for the table.
14. <b>_isNoMinHeight:</b> set this value to true, if you don't want the table min height to be set. By default the min height of the table is '500px'.
15. <b>_content*:</b> defines the row content.
16. <b>_total*:</b> defines the total result.


***Compulsory**

<hr>

####_buttons:  
1. <b>_icon:</b> set the icon.
2. <b>_label*:</b> set the label. 

***Compulsory**

<hr>

####_columns:  
