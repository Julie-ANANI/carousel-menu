import { EXPLORATION } from '../components/exploration/i18n/fr';
import { HISTORY } from '../components/history/i18n/fr';
import { NEW_PROJECT } from '../components/new-project/i18n/fr';
import { PROJECTS_LIST } from '../components/projects-list/i18n/fr';
import { SETUP } from '../components/setup/i18n/fr';

export const PROJECT_MODULE = {
  'ADD_COLLABORATORS': 'Ajouter un e-mail de collaborateur',
  'ADD_COLLABORATORS_PLACEHOLDER': 'Ajouter un e-mail de collaborateur',
  'COLLABORATORS': 'collaborateurs',
  'COLLABORATOR_ADDED': {
    'TITLE': 'Collaborateur ajouté',
    'CONTENT': 'Le collaborateur a été ajouté avec succès au projet.'
  },

  'COLLABORATOR_ALREADY_ADDED': {
    'TITLE': 'Déjà ajouté',
    'CONTENT': 'Le collaborateur a déjà été ajouté au projet.'
  },
  'COLLABORATOR_DELETED': {
    'TITLE': 'Collaborateur supprimé',
    'CONTENT': 'Le collaborateur a été supprimé avec succès du projet.'
  },
  'ADD_COLLABORATORS_MODAL': {
    'TITLE': 'Conseil des collaborateurs',
    'CONTENT': 'Vous pouvez ajouter ici les adresses e-mail des personnes que vous souhaitez ajouter en tant que collaborateurs pour votre projet.',
    'NOTE': 'Info: les personnes déjà utilisateurs de la plateforme seront ajoutées immédiatement, sinon elles recevront un e-mail avec une invitation à s\'inscrire. ' +
    'N\'oubliez pas: pour accepter l\'invitation, les nouveaux utilisateurs doivent s\'inscrire en utilisant la même adresse d\'inscription.',
    'USERS_ADDED': 'collaborateur(s) a/ont été ajouté(s)',
    'TO_SEND_EMAIL': 'adresse(s) e-mail(s) ne correspond(ent) à aucun compte dans notre application. Pour les/l\'ajouter comme collabora-teur-trice-s à ce projet, ' +
    'vous devez leur/lui envoyer une invitation en cliquant sur le bouton ci-dessous :',
    'TO_RESEND_EMAIL': 'adresse(s) e-mail(s) ne correspond(ent) à aucun compte dans notre application et ont peut-être déjà reçu une invitation de vôtre part. Pour ' +
    'les/l\'ajouter comme collabora-teur-trice-s à ce projet, vous devez leur/lui envoyer une invitation en cliquant sur le bouton'
  },
  'SETUP_TAB': 'Projet d\'installation',
  'EXPLORATION_TAB': 'Exploration du marché',
  'SYNTHESIS_TAB': 'Synthèse',
  'HISTORY_TAB': 'Histoire',
  'EXPLORATION': EXPLORATION,
  'HISTORY': HISTORY,
  'NEW_PROJECT': NEW_PROJECT,
  'PROJECTS_LIST': PROJECTS_LIST,
  'SETUP': SETUP
};
