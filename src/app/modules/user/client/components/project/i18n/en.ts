import { EXPLORATION  } from '../components/exploration/i18n/en';
import { HISTORY } from '../components/history/i18n/en';
import { NEW_PROJECT } from '../../new-project/i18n/en';
import { PROJECTS_LIST } from '../../projects-list/i18n/en';
import { SETUP } from '../components/setup/i18n/en';

export const PROJECT_MODULE = {
  'ADD_COLLABORATORS': 'Add a collaborator email',
  'ADD_COLLABORATORS_PLACEHOLDER': 'Add collaborator email',

  'COLLABORATOR_ADDED': {
    'TITLE': 'Added',
    'CONTENT': 'The collaborator has been successfully added to the project.'
  },

  'COLLABORATOR_STATUS': {
    'A': 'ADDED',
    'B': 'INVITED'
  },

  'COLLABORATOR_MODAL_BUTTON': {
    'DELETE': 'Delete',
    'REINVITE': 'Reinvite'
  },

  'COLLABORATOR_ALREADY_ADDED': {
    'TITLE': 'Already added',
    'CONTENT': 'The collaborator has been already added to the project.'
  },

  'COLLABORATOR_DELETED': {
    'TITLE': 'Deleted',
    'CONTENT': 'The collaborator has been successfully deleted from the project.'
  },

  'COLLABORATORS': 'collaborators',

  'ADD_COLLABORATORS_MODAL': {
    'TITLE': 'Collaborators Management',
    'CONTENT': 'You can add here the e-mail addresses of the people you want to add as collaborators for your project.',
    'INFO': '',
    'NOTE': 'Info: people who are already users of the framework will be added at once, otherwise they will receive an e-mail with an invitation to sign up. ' +
    'Remember: to accept the invitation, new users need to register using the same registration address.',
    'USERS_ADDED': 'collaborator(s) has/have been added to the project',
    'TO_SEND_EMAIL': 'or more e-mail addresses do not correspond to any of the existing users. To add them as collaborators for this project, you need to send them an ' +
    'invitation clicking in the button below:',
    'TO_RESEND_EMAIL': 'or more e-mail addresses do not correspond to any of the existing users and they may have received already an invitation from you. To add ' +
    'them as collaborators for this project, you need to send them an invitation clicking in the button below:',
    'LABEL': 'Email Address',
    'BOT_MESSAGE': 'Don\'t have any collaborators? Add one by clicking on "Add" button.'
  },

  'SETUP_TAB': 'Project Setup',
  'EXPLORATION_TAB': 'Market Exploration',
  'SYNTHESIS_TAB': 'Synthesis',
  'HISTORY_TAB': 'History',

  'EXPLORATION': EXPLORATION,
  'HISTORY': HISTORY,
  'NEW_PROJECT': NEW_PROJECT,
  'PROJECTS_LIST': PROJECTS_LIST,
  'SETUP': SETUP

};
