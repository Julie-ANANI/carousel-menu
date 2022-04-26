export const ERROR = {
  400: {
    INVALID_ARGUMENT: 'The input is invalid. Please check the input and try again.',
    EMPTY_PARAM: 'The parameter of the request is missing. Please check and try again.',
    EMPTY_BODY: 'The data in the request is empty. Please check and try again.',
    ALREADY_EXISTS: 'The data already exists.'
  },

  401:{
    NO_AUTHORIZED: 'You are not authorized to perform this request.',
  },

  403: {
    PERMISSION_DENIED: 'You don\'t have permission to perform this request.'
  },

  404: {
    NOT_FOUND: 'Sorry, we can\'t find the data.'
  },

  500: {
    NOT_FOUND: 'Sorry, we can\'t find the data.',
    UNKNOWN_ERROR: 'There were some technical issues to carry out this request. Please try again.',
    DB_ERROR: 'We are having trouble while fetching the data in the database.',
    SAVE_ERROR: 'We are having trouble while saving the data in the database.'
  },

  504: {
    SERVER_ERROR: 'We are having trouble while connecting to the server.'
  },

  AUTH_400: {
    INVALID_USERID: 'The user id is invalid. Please check and try again.',
    MISSING_BODY_EMAIL: 'Please enter your email address in the provided field.',
    MISSING_BODY_PASSWORD: 'Please enter your password in the provided field.',
    LOGIN_FAILED: 'Sorry, login failed. Please check the email/password combination and try again.',
  },

  AUTH_404: {
    USER_NOT_FOUND: 'The user could not be found please check it and try again.',
  },

  AUTH_500: {
    ATTEMPTS_TOO_SOON: 'Sorry, the login is too frequent. Please catch a break and try again.',
    OUT_OF_ATTEMPTS: 'Sorry, you have run out of 5 attempts. Please contact UMI support service.',
    USER_STATUS_ANORMAL: 'Sorry, we detected that your account status is anormal. Please contact UMI support service.'
  },

  USER_200:{
    PASSWORD_UPDATED: 'The password has been updated successfully.'
  },

  USER_400: {
    ALREADY_EXISTS: 'The e-mail address is already registered in the system.',
    PASSWORD_NOT_MATCH: 'The new password and confirm password must be same.',
    WRONG_PASSWORD: 'Old password is incorrect.',
    MISSING_BODY_EMAIL: 'The email address is missing. Please check it and try again.',
    MISSING_BODY_FIRSTNAME: 'The firstname is  missing. Please check it and try again.',
    MISSING_BODY_LASTNAME: 'The lastname is missing. Please check it and try again.',
    MISSING_BODY_PASSWORD: 'The password is missing. Please check it and try again.',
    MISSING_BODY_COMPANY_NAME: 'The company name is missing. Please check it and try again.'
  },

  USER_404: {
    USER_NOT_FOUND: 'We can\'t find your information please check it and try again.',
  },

  INNOVATION_400:{
    MISSING_COLLABORATOR: 'The collaborator information is missing please check it and try again.'
  },

  INNOVATION_404:{
    CARD_NOT_FOUND: 'We can\'t find the innovation card please check it and try again.',
    MEDIA_NOT_FOUND: 'We can\'t find the innovation media please check it and try again.',
    EMPTY_SYNTHESIS: 'We can\'t find any synthesis please check it and try again.',
    NOT_SUBMITTED_MODE: 'The comments can only be added when the innovation status is Submitted.',
    INNOVATION_NOT_FOUND: 'We can\'t find the innovation please check it and try again.'
  },

  INNOVATION_500:{
    PUBLISH_COMMUNITY_FAILED: 'Sorry, we are having trouble to publish the project on Community.',
    UPDATE_OWNER_FAILED: 'Sorry, we are having trouble to update the owner.',
    UPDATE_MISSION_TYPE_FAILED: 'Sorry, we are having trouble to update mission type.',
    UPDATE_MISSION_TEAM_FAILED: 'Sorry, we are having trouble to update mission team.',
    UPDATE_MISSION_TEMPLATE_FAILED: 'Sorry, we are having trouble to update mission template',
    UPDATE_MISSION_RESULT_FAILED: 'Sorry, we are having trouble to update mission result',
    SAVE_INNOVATION_FAILED: 'Sorry, we are having trouble to save the innovation.',
    SAVE_MEDIA_FAILED: 'Sorry, we are having trouble to save the media.',
    DELETE_MEDIA_FAILED: 'Sorry, we are having trouble to delete the media.',
    DELETE_TAG_FAILED: 'Sorry, we are having trouble to delete the tag from the innovation.',
    SAVE_INNOVATION_CARD_FAILED: 'Sorry, we are having trouble to save the innovation card.',
    REMOVE_INNOVATION_CARD_FAILED: 'Sorry, we are having trouble to delete the innovation card.',
    REMOVE_INNOVATION_FAILED: 'Sorry, we are having trouble to delete the innovation.',
    IMPORT_ANSWER_FAILED: 'Sorry, we are having trouble to import the answers.',
    IMPORT_TAG_FAILED: 'Sorry, we are having trouble to import the tags.',
  },

  NOTIFICATION_400:{
    ALREADY_SENT: 'We have already sent this notification, this notification is sent just once.',
    AT_LEAST_3_ANSWERS:'We could not send this notification. It requires minimum 3 validated answers.',
    THIRD_ANSWER_OVERTIME: 'We could not send this notification because third answer is validated after 3 days of the first mail.',
    MISSING_USER_INFO: 'We could not found the user info so we can not proceed further.',
    MISSING_INNOVATION_INFO: 'We could not found the innovation info so we can not proceed further.',
    MISSING_RECIPIENTS_INFO: 'We could not found the recipients info so we can not proceed further.',
    MISSING_BATCH_INFO: 'We could not send this notification. We did not find any batches.',
    MISSING_TEMPLATE_INFO: 'We could not found the notification template content so we can not proceed further.',
    MISSING_DATE_INFO: 'We could not send this notification. We did not find first mail or answer updated date.',
    TRIGGER_NOT_FOUND: 'We could not found the notification for the trigger.',
    NOTIFICATION_CANNOT_SAVE: 'There was a problem while saving the notification job',
  },

  CVS_500:{
    CVS_PARSE_FAILED: 'Sorry, we are having trouble to parse the cvs file.'
  },

  BATCH_404:{
    BATCH_NOT_FOUND: 'Sorry, we can\'t find the batch.'
  },

  BATCH_500:{
    UPDATE_BATCH_FAILED: 'Sorry, we are having trouble to update the batch.'
  },

  CAMPAIGN_400:{
    MISSING_PARAM_CAMPAIGN_ID: 'Sorry, the campaign id is missing.'
  },

  CAMPAIGN_404:{
    CAMPAIGN_NOT_FOUND: 'Sorry, we can\'t find the campaign.'
  },

  CAMPAIGN_500:{
    SAVE_CAMPAIGN_FAILED: 'Sorry, we are having trouble to save the campaign.',
    UPDATE_CAMPAIGN_FAILED: 'Sorry, we are having trouble to update the campaign.',
    UPDATE_STATS_SEARCH_FAILED: 'Sorry, we are having trouble to update the search in stats.',
    UPDATE_STATS_PROS_FAILED: 'Sorry, we are having trouble to update the pros in stats.',
    UPDATE_STATS_FAILED: 'Sorry, we are having trouble to update the stats.',
    UPDATE_STATS_BATCH_FAILED: 'Sorry, we are having trouble to update the batch in stats.',
    SAVE_TARGET_PROS_FAILED: 'Sorry, we are having trouble to save the targeted pros.'
  },

  CLIENT_PROJECT_500:{
    CREATE_PROJECT_FAILED: 'Sorry, we are having trouble to create the project.',
    DELETE_PROJECT_FAILED: 'Sorry, we are having trouble to delete the project.'
  },

  DELIVERABLE_JOB_500:{
    SAVE_DELIVERABLE_JOB_FAILED: 'Sorry, we are having trouble to save the job.',
  },


  'ERROR': 'Oups...',

  'SUCCESS': 'Success',

  'CANNOT_REACH': 'We are having trouble while reaching to the server at the moment.',

  'FORM_ERROR': 'Form error',

  'OPERATION_ERROR': 'There were some technical issues to carry out this request. Please try again.',

  'PAGINATION': 'We are unable to fetch the results. Please change the value of \'Rows per page\'.',

  'FETCHING_ERROR': 'We are having trouble while fetching the data.',

  'SERVER_ERROR': 'We are having trouble while connecting to the server.',

  'RELOAD_PAGE': 'Please reload the page and try again.',

  'RELOADING_PAGE': 'The page is going to reload automatically in few seconds. Thank you for your patience.',

  'NO_CONNECTION': 'It seems that you are currently offline.',

  'INVALID_FORM': 'There are errors in your form please correct them and try again.',

  'INVALID_DOMAIN': 'You are not allowed to create a super-admin account in this instance.',

  'INVALID_FORM_DATA': 'The email/password combination is not valid.',

  'PAGE_NOT_FOUND': 'Page could not be found.',

  'ALREADY_EXIST': 'A user with this e-mail address is already registered in the system.',

  'CARD_NOT_FOUND': 'We could not find the innovation that you are looking for.',

  'URL_NOT_FOUND': 'The requested URL was not found on the server.',

  'NO_PERMISSION': 'You don\'t have permission to perform this request.',

  'NO_AUTHORIZED': 'You are not authorized to perform this request.',

  'NO_AUTHORIZED_ADMIN': 'Sorry, but you are not authorized to access this page. Please contact your team manager.',

  'NO_AUTHORIZED_PAGE': 'Sorry, but you are not authorized to access this page. Please contact your market test manager.',

  'FORM': {
    'PITCH_FORM': 'Please answer the fields of the pitch form.',
    'TARGETING_FORM': 'Please answer the fields of the targeting form.'
  },

  'LOGIN': {
    'WELCOME': 'Welcome back!',
    'LOGGED_IN': 'You have been logged in successfully.',
    'EMPTY_EMAIL': 'Email field empty',
    'EMAIL_PLEASE': 'Please enter your email address in the provided field.',
    'EMAIL_SENT': 'Email sent',
    'CHANGE_PASSWORD': 'To change your password, please click on the link we have just sent you by email.',
    'EMAIL_NOT_FOUND': 'The entered email could not be found please check it and try again.',
    'LOGOUT': 'Logout Success',
    'LOGOUT_TEXT': 'You have been logged out.',
  },


  'ACCOUNT': {
    'UPDATE': 'Successful update',
    'UPDATE_TEXT': 'Your profile has been updated successfully.',
    'DELETED': 'Account deleted',
    'DELETED_TEXT': 'The account has been deleted successfully.',
    'PASSWORD_UPDATED': 'Password updated.',
    'PASSWORD_UPDATED_TEXT': 'The password has been updated successfully.',
    'SAME_PASSWORD': 'The new password and confirm password must be same.',
    'OLD_PASSWORD': 'Old password is incorrect.',
    'PROFILE_UPDATE_TEXT': 'The profile has been updated successfully.',
    'PROFILE_DELETE_TEXT': 'The profile has been deleted successfully.',
    'ADDED': 'The profile has been added successfully.',
    'NOT_ADDED': 'The profile has not been added. It may belong to another campaign of the project, or be blacklisted.',
  },


  'PROJECT': {
    'NOT_FOUND': 'Not found',
    'UNFORBIDDEN': 'Unforbidden',
    'CANT_EDIT': 'You cannot edit this project.',
    'SAVED': 'Saved',
    'DELETED': 'Deleted',
    'DELETED_TEXT': 'Your project has been deleted successfully in the specified language.',
    'DELETED_PROJECT_TEXT': 'Your project has been deleted successfully.',
    'NOT_DELETED_TEXT': 'Your project can not be deleted at the moment because of some technical reasons. Please try again later!',
    'SAVED_TEXT': 'The project has been saved successfully.',
    'UPDATED_TEXT': 'The project has been updated successfully.',
    'REQUEST_PROOFREADING': 'The proofreading request has been sent.',
    'SAVE_ERROR': 'There are changes to be saved before proceeding.',
    'SUBMITTED': 'Submitted',
    'SUBMITTED_TEXT': 'The project has been sent to validate.',
    'NOT_ALLOWED': 'You are not allowed to perform this action.',
    'COMMENT_NOT_FOUND': 'We could not find the comment for the requested innovation.',
    'NOT_SUBMITTED_MODE': 'The comments can only be added when the innovation status is Submitted.',
    'LINKING': 'Linking',
    'LINKING_DONE': 'Your request for contact has been taken into account',
    'SEND_EMAILS': 'Sending the emails',
    'SEND_EMAILS_OK': 'The emails have been sent successfully.',
    'SEND_MESSAGE': 'The message has been sent successfully.',
    'COLLABORATORS_ADDED': 'The collaborators has been added to the project.',
    'COLLABORATOR_DELETED': 'The collaborator have been deleted successfully.',
    'UPDATED_COMPANY': 'The company has been updated successfully.'
  },


  'TAGS': {
    'UPDATE': 'Tag update',
    'ADDED': 'The tag has been added successfully.',
    'CREATED': 'The tag has been created successfully.',
    'UPDATED': 'The tag has been updated successfully.',
    'REMOVED': 'The tag has been removed successfully.',
    'ALREADY_ADDED': 'The tag has been already added.',
    'FETCHING_ERROR': 'We are having trouble while fetching the tags for this innovations from the server.',
    'TAG_FETCHING_ERROR': 'We are having trouble while fetching the data for this tag.',
    'IMPORTED': 'The tags have been imported successfully.',
  },


  'COUNTRY': {
    'ADDED': 'This country has been added.',
    'INCLUDED': 'This country has been included.',
    'ALREADY_ADDED': 'This country has been already added.',
    'EXCLUDED': 'This country has been excluded.',
    'ALREADY_EXCLUDED': 'This country has been already excluded.'
  },


  'PRESET': {
    'UPDATED': 'The questionnaire has been updated.',
    'LOADED': 'The template has been loaded successfully.'
  },


  'ANSWER': {
    'UPDATED': 'The answer has been updated successfully.',
    'IMPORTED': 'The answers have been imported successfully.',
    'REASSIGNED': 'The answer has been reassigned successfully.',
    'STATUS_UPDATE': 'The status has been updated successfully.'
  },


  'NOT_MODIFIED': {
    'USER_ANSWER': 'You are not allowed to make changes in the view mode.'
  },


  'QUIZ': {
    'CREATED': 'The quiz has been created successfully.',
    'GENERATED': 'The quiz has been generated successfully.',
  },


  'CAMPAIGN': {
    'ADDED': 'The campaign has been added successfully.',
    'UPDATED': 'The campaign has been updated successfully.',
    'DELETED': 'The campaign and its professionals have been deleted successfully.',
    'TEMPLATE_ERROR': 'We are having trouble while fetching the templates data. Please try to reload the page again!',
    'SIGNATURE_ERROR': 'We are having trouble while fetching the signatures data. Please try to reload the page again!',
    'WORKFLOW': {
      'ADDED': 'The workflow has been added successfully.',
      'DELETED': 'The workflow has been deleted successfully.',
      'UPDATED': 'The workflow has been updated successfully.',
      'SENT': 'The mail has been sent successfully.',
      'SENT_ERROR': 'We are having trouble while sending the mail.',
      'DEFAULT': 'The default template has been updated'
    },
    'BATCH': {
      'NUGGETS_ERROR': 'We are having trouble while activating/deactivating the nuggets. Please try to reload the page!',
      'BATCH_ERROR': 'We are having trouble while activating/deactivating the batch. Please try to reload the page!',
      'NUGGETS_ACTIVATED': 'The nuggets have been activated successfully.',
      'NUGGETS_DEACTIVATED': 'The nuggets have been deactivated successfully.',
      'NOT_CREATED': 'No batch is created.',
      'STARTED': 'The batch has been started successfully.',
      'CREATED': 'The batch has been created successfully.',
      'STOPPED': 'The batch has been stopped successfully.',
      'ALREADY_STARTED': 'The batch has been already launched. It can not be undone.',
      'DELETED': 'The batch has been deleted successfully.',
      'FREEZED': 'The batch has been frozen successfully.',
      'UPDATED': 'The batch has been updated successfully.',
      'AUTOBATCH_ON': 'The autobatch is on for this campaign. Batches will be created soon.',
      'AUTOBATCH_OFF': 'The autobatch is off for this campaign. No new batch will be created.',
    },
    'SEARCH': {
      'SETTINGS_UPDATED': 'The settings have been updated successfully.',
      'REQUEST_SAVED': 'The request has been saved successfully.',
      'NO_REQUEST': 'There is no request to save !'
    }
  },


  'IMPORT': {
    'CSV': 'The CSV has been imported successfully.',
    'PROJECT': 'The project has been imported successfully.'
  },


  'FILTER': {
    'ALREADY_EXIST': 'The view with this name already exists.',
    'ALREADY_ACTIVATED': 'The view is already activated.'
  },


  'ERRORS': {
    'PROFESSIONAL_ERROR': 'It could be because you are trying to access the professional that doesn\'t exist or server connection problem or check if the URL is good.',
    'PROJECT_ERROR': 'It could be because you are trying to access the project that doesn\'t exist or server connection problem or check if the URL is good.',
    'FETCHING': 'We are having trouble while fetching the data. It could be because of server connection problem.',
    'PROJECT_FETCHING_ERROR': 'It could be possible because of server connection problem or we could not find the project that you are looking for.',
    'HEADING_1': 'Oups. something went wrong...',
    'FETCHING_MESSAGE_1': 'There was an error while fetching the data from the server.',
    'SERVER_CONNECTION': 'It could be possible because of server connection problem.',
    'PATTERNS_DUPLICATED': 'Pattern duplicated!',
  },


  'AMBASSADOR': {
    'DELETED': 'The ambassador has been deleted successfully.',
  },


  'SIGNATURES': {
    'ADDED': 'The signature has been added successfully.',
    'UPDATED': 'The signature has been updated successfully.',
    'ALREADY_EXIST': 'The signature with the same name already exists.',
    'DELETED': 'The signature has been deleted successfully.',
  },

  'PROFESSIONAL': {
    'MERGE_ERROR': 'A professional with that e-mail already exists. Try to manually merge both professionals.<br>For more info, ask the tech team',
  },

  'JOB': {
    'VIDEO': 'The request for the video is registered. We will email you once it has been completed.'
  }

};
