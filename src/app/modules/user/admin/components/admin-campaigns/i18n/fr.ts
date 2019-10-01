export const CAMPAIGNS = {
  'CAMPAIGN-NAME': 'Nom de la campagne',

  'QUIZ': 'Quiz',

  'HISTORY': 'Historique',

  'SEARCH': 'Recherche',

  'PROS': 'Pros',

  'MAILS': 'Emails',

  'BATCH': 'Batch',

  'WORKFLOWS': 'Workflows',

  'ANSWERS': 'Réponses',

  'EXPORT_ANSWERS': 'Exporter',

  'IMPORT_ANSWERS': 'Importer des réponses',

  'EMAIL_CONFIDENCE': 'Indice de confiance',

  'ACTIONS': 'Actions',

  'VALIDATED': 'Réponses validées',

  'SUBMITTED': 'Réponses en attente de validation',

  'TO_COMPLETE': 'Réponses à compléter',

  'DRAFTS': 'Brouillons',

  'REJECTED': 'Réponses rejetées',

  'REJECTED_GMAIL': 'Réponses rejetées par mail',

  'REJECTED_UMIBOT': 'Réponses rejetées auto',

  'VALIDATED_UMIBOT': 'Réponses validées auto',

  'DELETE_MODAL': {
    'TITLE': 'Êtes-vous sûr(e) ?',
    'CONTENT': 'Êtes-vous sûr(e) de vouloir définitivement supprimer cette campagne ? Elle peut contenir  des professionnels qui seront supprimés de l\'innovation !'
  },

  'SELECT_DEFAULT': {
    'TITLE': 'Êtes-vous sûr(e) ?',
    'CONTENT' : ` Certains batchs peuvent être en cours d'envoi, êtes vous certains de vouloir modifier le template de mails par défaut ?`
  },

  'STARTAB' : {
    'TITLE' : 'Êtes-vous sûr(e) ?',
    'CONTENT' : ` Le lancement de l'A/B testing n'est pas réversible, vous ne pourrez plus revenir en arrière.
     L'équipe technique et la direction déclinent toute responsabilité en cas d'accident.  ;)`
  },

  'ADD_BUTTON': 'Ajouter une campagne',

  'BOT_TEXT': {
    'A': 'Vous n\'avez pas de campagne ?',
    'B': 'Créez la campagne en cliquant sur le bouton "Ajouter une campagne".'
  },

  'PROFESSIONAL': 'Professionnel',

  'STATUS': 'statut',

  'UPDATE_BUTTON': 'Mettre les stats à jour',

  'CLONE_BUTTON': 'Clone',

  'DELETE_BUTTON': 'Supprimer',

  'EDIT_BUTTON': 'modifier',

  'STATS': {
    'HEADING': {
      'INSIGHTS': 'Insights',
      'PROFILE': 'Profil',
      'QUALITY': 'Qualité',
      'PROFESSIONALS': 'Professionnels',
      'EMAILS': 'Emails',
      'COST': 'Cost',
      'RECEPTION': 'Réception',
      'INTERACTION': 'Interaction',
      'DISPLAY': 'Affichages'
    },
    'TITLE': {
      'LOOK': 'À valider',
      'VALIDATED': 'Validée',
      'VALIDATED_WITHOUT': 'Validée sans email',
      'REJECTED': 'Rejetée',
      'STANDARD': 'Standard',
      'TOP': 'Top',
      'FILL_RATE': 'Taux de remplissage',
      'TIME': 'Heure',
      'FIND': 'Trouver',
      'NOT_REACHED': 'Non atteint',
      'STARS': 'Étoiles',
      'DUPLICATE': 'Doublons',
      'GOOD': 'Bon',
      'UNSURE': 'Incertain',
      'BAD': 'Mauvais',
      'REQUEST': 'Demande',
      'EMAILS': 'Emails',
      'GOOD_EMAILS': 'Bons emails',
      'RECEIVED': 'Reçu',
      'SPAM': 'Spam',
      'BOUNCES': 'Rebonds',
      'OPENED': 'Ouvert',
      'CLICKED': 'Cliqué',
      'EMAIL': 'Email',
      'QUESTIONNAIRE': 'Questionnaire'
    },

    'ADDED': 'Ajouté',
    'TO_CONTACT': 'A contacter',
    'CONTACTED': 'Contacté',
    'OPENED': 'Ouvert',
    'CLICKED': 'Clics',
    'STARTED': 'Démarré',
    'SENT': 'Envoyé',
    'VALIDATED': 'Validé',
  },

  'QUIZ_PAGE': {
    'HEADING': 'Visitez ce lien pour voir le questionnaire :',
    'BOT': 'Aucun quiz n\'a été généré pour cette campagne.'
  },

  'PROS_PAGE': {
    'BUTTON': {
      'IMPORT': 'Import',
      'EXPORT': 'Exporter',
      'ADD': 'Ajouter'
    },
    'MODAL': {
      'IMPORT': {
        'PLACEHOLDER': 'Entrez le nom de la campagne',
      }
    }
  },

  'WORKFLOW_PAGE': {
    'BUTTON': {
      'IMPORT': 'Importer',
      'TEST_WORKFLOW': 'Test Workflow'
    },
    'BOT': {
      'MESSAGE_A': 'Vous n\'avez pas de workflows ?',
      'MESSAGE_B': 'Essayez d\'en ajouter en cliquant sur le bouton "Importer".'
    },
    'MODAL': {
      'CONTENT_A': 'Ce workflow est déjà importé. Si vous l\'importez à nouveau, il remplacera le premier. Voulez-vous vraiment importer ce modèle ?',
      'CONTENT_B': 'Vous ajoutez un nouveau workflow à la campagne, vous pourrez lancer un A/B testing !'
    },
    'NOTE': 'Note : Il vous est conseillé de modifier les modèles/emails importés avant de lancer le lot.',
  },

  'BATCH_PAGE': {
    'NOTE': 'Note : Il n\'est pas possible de lancer le lot pour cette campagne pour le moment pour la ou les raisons suivantes :',
    'QUIZ': 'Quiz',
    'INNOVATION': 'Validation du projet',
    'EMAILS': 'Aucun email n\'est défini. ',
    'WORKFLOW': 'Workflow',
    'BOT': 'Lancer auto-batch et prendre des vacances :)',
    'AUTO_BATCH_LABEL': 'Démarrage auto-batch',
    'NUGGETS': 'Nuggets',
    'TITLE': 'Batch de',
    'MODAL_DELETE_CONTENT': 'Voulez-vous vraiment supprimer ce batch ?',
    'ERROR': 'Il y a eu une erreur lors de l\'envoi de ce batch !'
  },

  'ERROR_MESSAGE': {
    'FETCHING': 'Nous avons de la difficulté à trouver les réponses pour cette campagne. C\'est peut-être parce que nous ne pouvions pas avoir les réponses.',
    'FETCHING_PROFESSIONALS': 'Nous avons de la difficulté à trouver les professionnels pour cette campagne. Cela peut être dû à un problème de connexion au serveur ou à l\'absence de professionnels.',
  },

  'NO_ANSWER': 'Aucune réponse pour cette campagne. Essayez d\'en importer !',

  'NO_PROFESSIONALS': 'Pas de professionnels pour cette campagne. Essayez d\'en ajouter/importer !',

  'LABEL_IMPORT': 'Importer des professionnels de la campagne (une seule campagne à la fois)',

};
