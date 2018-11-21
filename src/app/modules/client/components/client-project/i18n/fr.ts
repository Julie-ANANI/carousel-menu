import { EXPLORATION } from '../components/exploration/i18n/fr';
import { HISTORY } from '../components/history/i18n/fr';
import { NEW_PROJECT } from '../components/new-project/i18n/fr';
import { PROJECTS_LIST } from '../../../../user/client/components/projects-list/i18n/fr';
import { SETUP } from '../components/setup/i18n/fr';

export const PROJECT_MODULE = {
  'ADD_COLLABORATORS': 'Ajoutez l\'email d\'un collègue',
  'ADD_COLLABORATORS_PLACEHOLDER': 'Ajoutez l\'email d\'un collègue',

  'COLLABORATORS': 'collaborateur(s)',

  'COLLABORATOR_ADDED': {
    'TITLE': 'Ajouté',
    'CONTENT': 'Vous avez ajouté un collaborateur à votre projet.'
  },

  'COLLABORATOR_STATUS': {
    'A': 'AJOUTÉE',
    'B': 'INVITÉ'
  },

  'COLLABORATOR_MODAL_BUTTON': {
    'DELETE': 'Supprimer',
    'REINVITE': 'Renvoyer l\'invitation'
  },

  'COLLABORATOR_ALREADY_ADDED': {
    'TITLE': 'Déjà ajouté',
    'CONTENT': 'Ce collaborateur fait déjà parti du projet.'
  },

  'COLLABORATOR_DELETED': {
    'TITLE': 'Supprimé',
    'CONTENT': 'Vous avez supprimé ce collaborateur du projet.'
  },

  'ADD_COLLABORATORS_MODAL': {
    'TITLE': 'Mes collaborateurs',
    'CONTENT': 'Vous pouvez ajouter ici les adresses e-mail des personnes que vous souhaitez ajouter en tant que collaborateurs pour votre projet.',
    'NOTE': 'Info: les personnes déjà utilisateurs de la plateforme seront ajoutées immédiatement, sinon elles recevront un e-mail avec une invitation à s\'inscrire. ' +
    'N\'oubliez pas: pour accepter l\'invitation, les nouveaux utilisateurs doivent s\'inscrire en utilisant la même adresse d\'inscription.',
    'USERS_ADDED': 'collaborateur(s) a/ont été ajouté(s)',
    'TO_SEND_EMAIL': 'adresse(s) e-mail(s) ne correspond(ent) à aucun compte dans notre application. Pour les/l\'ajouter comme collabora-teur-trice-s à ce projet, ' +
    'vous devez leur/lui envoyer une invitation en cliquant sur le bouton ci-dessous :',
    'TO_RESEND_EMAIL': 'adresse(s) e-mail(s) ne correspond(ent) à aucun compte dans notre application et ont peut-être déjà reçu une invitation de vôtre part. Pour ' +
    'les/l\'ajouter comme collabora-teur-trice-s à ce projet, vous devez leur/lui envoyer une invitation en cliquant sur le bouton',
    'LABEL': 'Email d\'un(e) collègue',
    'BOT_MESSAGE': 'Partagez et éditez votre projet à plusieurs !'
  },

  'SETUP_TAB': 'Description du projet',
  'EXPLORATION_TAB': 'Exploration marché',
  'SYNTHESIS_TAB': 'Synthèse',
  'HISTORY_TAB': 'Historique',

  'EXPLORATION': EXPLORATION,
  'HISTORY': HISTORY,
  'NEW_PROJECT': NEW_PROJECT,
  'PROJECTS_LIST': PROJECTS_LIST,
  'SETUP': SETUP

};
