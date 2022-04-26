export const ERROR = {
  400: {
    INVALID_ARGUMENT: 'Votre entrée n\'est pas valide. Vérifiez l\'entrée et réessayez.',
    EMPTY_PARAM: 'Le paramètre de la request est vide. Vérifiez et réessayez.',
    EMPTY_BODY: 'Les données de la request sont vides. Vérifiez et réessayez.',
    ALREADY_EXISTS: 'Les données existent déjà.'
  },

  401:{
    NO_AUTHORIZED: 'Vous n\'êtes pas autorisé à effectuer cette demande.',
  },

  403: {
    PERMISSION_DENIED: 'Vous n\'êtes pas autorisé à effectuer cette demande.'
  },

  404: {
    NOT_FOUND: 'Désolé, nous ne trouvons pas les données.'
  },

  500: {
    NOT_FOUND: 'Désolé, nous ne trouvons pas les données.',
    UNKNOWN_ERROR: 'Il y a eu quelques problèmes techniques pour finaliser cette demande. Veuillez réessayer.',
    DB_ERROR: 'Nous rencontrons des problèmes lors de la récupération des données dans la base de données.',
    SAVE_ERROR: 'Nous rencontrons des problèmes lors de la sauvegarde des données dans la base de données.'
  },

  504: {
    SERVER_ERROR: 'Nous rencontrons des problèmes lors de la connexion au serveur.'
  },

  AUTH_400: {
    INVALID_USERID: 'L\'utilisateur n\'est pas valide. Vérifiez et réessayez.',
    MISSING_BODY_EMAIL: 'Veuillez entrer votre adresse e-mail dans le champ fourni.',
    MISSING_BODY_PASSWORD: 'Veuillez entrer votre mot de passe dans le champ fourni.',
    LOGIN_FAILED: 'Désolé, la connexion a échoué. Vérifiez la combinaison e-mail/mot de passe et réessayez.',
  },

  AUTH_404: {
    USER_NOT_FOUND: 'L\'utilisateur est introuvable. Vérifiez-le et réessayez.',
  },

  AUTH_500: {
    ATTEMPTS_TOO_SOON: 'Désolé, la connexion est trop fréquente. Veuillez prendre une pause et réessayer.',
    OUT_OF_ATTEMPTS: 'Désolé, vous avez manqué de 5 tentatives. Veuillez contacter le service de support UMI.',
    USER_STATUS_ANORMAL: 'Désolé, nous avons détecté que l\'état de votre compte est anormal. Veuillez contacter le service de support UMI.'
  },

  USER_200:{
    PASSWORD_UPDATED: 'Le mot de passe a été mis à jour.'
  },

  USER_400: {
    ALREADY_EXISTS: 'L\'adresse email est déjà enregistrée dans le système.',
    PASSWORD_NOT_MATCH: 'Le nouveau mot de passe et le mot de passe de confirmation doivent être identiques.',
    WRONG_PASSWORD: 'L\'ancien mot de passe est incorrect.',
    MISSING_BODY_EMAIL: 'L\'adresse e-mail est manquante. Veuillez vérifier et réessayer.',
    MISSING_BODY_FIRSTNAME: 'Le prénom est manquant. Veuillez vérifier et réessayer.',
    MISSING_BODY_LASTNAME: 'Le nom est manquant. Veuillez vérifier et réessayer.',
    MISSING_BODY_PASSWORD: 'Le mot de passe est manquant. Veuillez vérifier et réessayer.',
    MISSING_BODY_COMPANY_NAME: 'Le nom de l\'entreprise est manquant. Veuillez vérifier et réessayer.'
  },

  USER_404: {
    USER_NOT_FOUND: 'Vos informations sont introuvables. Vérifiez-les et réessayez.',
  },

  INNOVATION_400:{
    MISSING_COLLABORATOR: 'Les informations sur le collaborateur sont manquantes. Vérifiez-les et réessayez.'
  },

  INNOVATION_404:{
    CARD_NOT_FOUND: 'Nous n\'avons pas trouvé l\'innovation que vous recherchez.',
    MEDIA_NOT_FOUND: 'Nous ne trouvons pas les médias d\'innovation, veuillez les vérifier et réessayer.',
    EMPTY_SYNTHESIS: 'Nous ne pouvons pas trouver de synthèse s\'il vous plaît vérifier et réessayer.',
    NOT_SUBMITTED_MODE: 'Les commentaires ne peuvent être ajoutés que lorsque le statut d\'innovation est Soumis.',
    INNOVATION_NOT_FOUND: 'Nous ne trouvons pas l\'innovation, veuillez la vérifier et réessayer.'
  },

  INNOVATION_500:{
    PUBLISH_COMMUNITY_FAILED: 'Désolé, nous ne pouvons pas publier le projet sur Community.',
    UPDATE_OWNER_FAILED: 'Désolé, nous ne pouvons pas mettre à jour le propriétaire.',
    UPDATE_MISSION_TYPE_FAILED: 'Désolé, nous ne pouvons pas mettre à jour le type de mission.',
    UPDATE_MISSION_TEAM_FAILED: 'Désolé, nous ne pouvons pas mettre à jour l\'équipe de mission.',
    UPDATE_MISSION_TEMPLATE_FAILED: 'Désolé, Nous ne pouvons pas mettre à jour le modèle de mission',
    UPDATE_MISSION_RESULT_FAILED: 'Désolé, Nous ne pouvons pas mettre à jour le résultat de la mission',
    SAVE_INNOVATION_FAILED: 'Désolé, nous ne pouvons pas sauvegarder l\'innovation.',
    SAVE_MEDIA_FAILED: 'Désolé, nous ne pouvons pas sauvegarder les médias.',
    DELETE_MEDIA_FAILED: 'Désolé, nous ne pouvons pas supprimer les médias.',
    DELETE_TAG_FAILED: 'Désolé, nous ne pouvons pas sauvegarder les tags de l\'innovation.',
    SAVE_INNOVATION_CARD_FAILED: 'Désolé, nous ne pouvons pas sauvegarder l\'innovation.',
    REMOVE_INNOVATION_CARD_FAILED: 'Désolé, nous ne pouvons pas supprimer la carte de l\'innovation.',
    REMOVE_INNOVATION_FAILED: 'Désolé, nous ne pouvons pas supprimer l\'innovation.',
    IMPORT_ANSWER_FAILED: 'Désolé, nous ne pouvons pas importer les réponses.',
    IMPORT_TAG_FAILED: 'Désolé, nous ne pouvons pas importer les tags.'
  },

  NOTIFICATION_400:{
    ALREADY_SENT: 'Nous avons déjà envoyé cette notification, cette notification est envoyée une seule fois.',
    AT_LEAST_3_ANSWERS:'Nous n\'avons pas pu envoyer cette notification. Il nécessite au minimum 3 réponses validées.',
    THIRD_ANSWER_OVERTIME: 'Nous n\'avons pas pu envoyer cette notification car la troisième réponse est validée après 3 jours de la première envoie.',
    MISSING_USER_INFO: 'Nous n\'avons pas trouvé les informations de l\'utilisateur, nous ne pouvons donc pas continuer.',
    MISSING_INNOVATION_INFO: 'Nous n\'avons pas trouvé les informations sur l\'innovation, nous ne pouvons donc pas aller plus loin.',
    MISSING_RECIPIENTS_INFO: 'Nous n\'avons pas trouvé les informations des destinataires, nous ne pouvons donc pas continuer.',
    MISSING_BATCH_INFO: 'Nous n\'avons pas pu envoyer cette notification. Nous n\'avons trouvé aucun batch.',
    MISSING_TEMPLATE_INFO: 'Nous n\'avons pas trouvé le template de notification, nous ne pouvons donc pas continuer.',
    MISSING_DATE_INFO: 'Nous n\'avons pas pu envoyer cette notification. Nous n\'avons pas trouvé la date de la première envoie ou la date de la réponse mise à jour.\n',
    TRIGGER_NOT_FOUND: 'Nous n\'avons pas trouvé la notification pour le déclencheur.',
    NOTIFICATION_CANNOT_SAVE: 'Un problème est survenu lors de l\'enregistrement de la tâche de notification.',
  },

  CSV_500:{
    CSV_PARSE_FAILED: 'Désolé, nous avons rencontré un problem lors de l\'analyse du fichier csv.'
  },

  BATCH_404:{
    BATCH_NOT_FOUND: 'Nous n\'avons pas trouvé le batch que vous recherchez.'
  },

  BATCH_500:{
    UPDATE_BATCH_FAILED: 'Désolé, nous ne pouvons pas mettre à jour le batch.'
  },

  CAMPAIGN_400:{
    MISSING_PARAM_CAMPAIGN_ID: 'Nous n\'avons pas trouvé l\'innovation que vous recherchez.'
  },

  CAMPAIGN_404:{
    CAMPAIGN_NOT_FOUND: 'Nous n\'avons pas trouvé la campaign que vous recherchez.'
  },

  CAMPAIGN_500:{
    SAVE_CAMPAIGN_FAILED: 'Nous ne pouvons pas sauvegarder la campaign du pour le moment.',
    UPDATE_CAMPAIGN_FAILED: 'Nous ne pouvons pas mettre à jour la campaign du project pour le moment.',
    UPDATE_STATS_SEARCH_FAILED: 'Désolé, nous ne pouvons pas mettre à jour la recherche dans les statistiques.',
    UPDATE_STATS_PROS_FAILED: 'Désolé, nous ne pouvons pas à mettre à jour les pros dans les statistiques.',
    UPDATE_STATS_FAILED: 'Désolé, nous ne pouvons pas mettre à jour les statistiques.',
    UPDATE_STATS_BATCH_FAILED: 'Désolé, nous ne pouvons pas mettre à jour le batch en stats.',
    SAVE_TARGET_PROS_FAILED: 'Nous ne pouvons pas sauvegarder target-pros pour le moment.'
  },

  CLIENT_PROJECT_500:{
    CREATE_PROJECT_FAILED: 'Nous rencontrons des problèmes lors de la creation du project.',
    DELETE_PROJECT_FAILED: 'Nous ne pouvons pas supprimer votre project pour le moment.'
  },

  DELIVERABLE_JOB_500:{
    SAVE_DELIVERABLE_JOB_FAILED: 'Désolé, nous ne pouvons pas sauvegarder le travail.',
  },

  'ERROR': 'Oups..',

  'SUCCESS': 'Succès',

  'CANNOT_REACH': 'Nous ne pouvons pas atteindre le serveur pour le moment.',

  'OPERATION_ERROR': 'Il y a eu quelques problèmes techniques pour donner suite à cette demande. Veuillez réessayer.',

  'FORM_ERROR': 'Erreur de formulaire',

  'PAGINATION': 'Nous ne pouvons pas obtenir les résultats. S\'il vous plaît changez le nombre de \'lignes par page\'.',

  'FETCHING_ERROR': 'Nous rencontrons des problèmes lors de la récupération des données.',

  'SERVER_ERROR': 'Nous rencontrons des problèmes lors de la connexion au serveur.',

  'RELOAD_PAGE': 'Veuillez recharger la page et réessayer.',

  'RELOADING_PAGE': 'La page va se recharger automatiquement en quelques secondes. Merci de votre patience.',

  'NO_CONNECTION': 'Il semble que vous n\'êtes pas connecté.',

  'INVALID_FORM': 'Des erreurs se sont glissées dans votre formulaire, corrigez-les et réessayez.',

  'INVALID_FORM_DATA': 'L\'e-mail ou le mot de passe n\'est pas valide.',

  'INVALID_DOMAIN': 'Vous n\'êtes pas autorisé à créer un compte super-administrateur dans cette instance.',

  'ALREADY_EXIST': 'Un utilisateur avec cette adresse e-mail est déjà enregistré dans le système.',

  'PAGE_NOT_FOUND': 'Pas de page par ici...',

  'CARD_NOT_FOUND': 'Nous n\'avons pas trouvé l\'innovation que vous recherchez.',

  'URL_NOT_FOUND': 'L\'URL demandée n\'a pas été trouvée sur le serveur.',

  'NO_PERMISSION': 'Vous n\'avez pas la permission d\'exécuter cette demande.',

  'NO_AUTHORIZED': 'Vous n\'êtes pas autorisé à exécuter cette demande.',

  'NO_AUTHORIZED_ADMIN': 'Désolé, mais vous n\'êtes pas autorisé à accéder à cette page. ' +
    'Veuillez contacter votre chef d\'équipe.',

  'NO_AUTHORIZED_PAGE': 'Désolé, mais vous n\'êtes pas autorisé à accéder à cette page. ' +
    'Veuillez contacter votre responsable du test de marché.',

  'FORM': {
    'PITCH_FORM': 'Veuillez remplir tous les champs avant de soumettre votre projet. Merci !',
    'TARGETING_FORM': 'Il manque quelques informations dans l\'onglet "Ciblage".'
  },


  'LOGIN': {
    'WELCOME': 'Bienvenue !',
    'LOGGED_IN': 'Bienvenue chez nous !',
    'EMPTY_EMAIL': 'Champ email vide',
    'EMAIL_PLEASE': 'Veuillez entrer votre adresse e-mail dans le champ prévu à cet effet.',
    'EMAIL_SENT': 'Email envoyé',
    'CHANGE_PASSWORD': 'Pour changer votre mot de passe, veuillez cliquer sur le lien que nous venons de vous envoyer par email.',
    'EMAIL_NOT_FOUND': 'Le courriel entré n\'a pu être trouvé, veuillez le vérifier et réessayer.',
    'LOGOUT': 'Déconnexion',
    'LOGOUT_TEXT': 'Vous avez été déconnecté(e).',
  },


  'ACCOUNT': {
    'UPDATE': 'Mise à jour réussie',
    'UPDATE_TEXT': 'Votre profil a bien été mis à jour.',
    'DELETED': 'Compte supprimé',
    'DELETED_TEXT': 'Le compte a été supprimé.',
    'PASSWORD_UPDATED': 'Mot de passe mis à jour.',
    'PASSWORD_UPDATED_TEXT': 'Le mot de passe a été mis à jour avec succès.',
    'SAME_PASSWORD': 'Le nouveau mot de passe et le mot de passe de confirmation doivent être identiques.',
    'OLD_PASSWORD': 'Ancien mot de passe est incorrect.',
    'PROFILE_UPDATE_TEXT': 'Le profil a été mis à jour avec succès.',
    'PROFILE_DELETE_TEXT': 'Le profil a été supprimé avec succès.',
    'ADDED': 'Le profil a été ajouté avec succès.',
    'NOT_ADDED': 'Le profil n\'a pas été ajouté. Il appartient peut-être à une autre campagne du projet, ou est blacklisté.'
  },


  'PROJECT': {
    'NOT_FOUND': 'Introuvable',
    'UNFORBIDDEN': 'Accès interdit',
    'CANT_EDIT': 'Vous ne pouvez pas éditer ce projet.',
    'SAVED': 'Sauvegardé',
    'DELETED': 'Supprimé',
    'DELETED_TEXT': 'Votre projet a été supprimé dans la langue spécifiée.',
    'DELETED_PROJECT_TEXT': 'Votre projet a été supprimé.',
    'NOT_DELETED_TEXT': 'Votre projet ne peut pas être supprimé pour le moment pour des raisons techniques. Veuillez réessayer plus tard !',
    'SAVED_TEXT': 'Le projet a été enregistré.',
    'UPDATED_TEXT': 'Le projet a été mis à jour avec succès.',
    'REQUEST_PROOFREADING': 'La demande de relecture a bien été envoyée.',
    'SAVE_ERROR': 'Il y a des modifications à enregistrer avant de poursuivre.',
    'SUBMITTED': 'Soumis',
    'SUBMITTED_TEXT': 'Le projet a été envoyé pour validation.',
    'NOT_ALLOWED': 'Vous n\'êtes plus autorisé à effectuer cette action.',
    'COMMENT_NOT_FOUND': 'Nous n\'avons pas trouvé le commentaire sur l\'innovation demandée.',
    'NOT_SUBMITTED_MODE': 'Les commentaires ne peuvent être ajoutés que lorsque le statut d\'innovation est soumis.',
    'LINKING': 'Mise en relation',
    'LINKING_DONE': 'Votre demande de mise en relation a été prise en compte',
    'SEND_EMAILS': 'Envoi des emails',
    'SEND_EMAILS_OK': 'Les emails ont bien été envoyés.',
    'SEND_MESSAGE': 'Le message a été envoyé avec succès.',
    'COLLABORATORS_ADDED': 'Les collaborateurs ont été ajoutés au projet.',
    'COLLABORATOR_DELETED': 'Le collaborateur a été supprimé avec succès.',
    'UPDATED_COMPANY': 'L\'entreprise a été mise à jour avec succès.'
  },


  'TAGS': {
    'UPDATE': 'Tag',
    'ADDED': 'Le tag a été ajouté.',
    'UPDATED': 'Le tag a été modifié.',
    'CREATED': 'Le tag a été créée avec succès.',
    'REMOVED': 'Le tag a été supprimé.',
    'ALREADY_ADDED': 'Le tag a déjà été ajoutée.',
    'FETCHING_ERROR': 'Nous rencontrons des problèmes pour récupérer les tags de ces innovations sur le serveur.',
    'TAG_FETCHING_ERROR': 'Nous rencontrons des problèmes pour récupérer les données de ce tag.',
    'IMPORTED': 'Les tags ont été importés avec succès.',
  },


  'COUNTRY': {
    'ADDED': 'Ce pays a été ajouté.',
    'INCLUDED': 'Ce pays a été inclus.',
    'ALREADY_ADDED': 'Ce pays a déjà été ajouté.',
    'EXCLUDED': 'Ce pays a été exclu.',
    'ALREADY_EXCLUDED': 'Ce pays a déjà été exclu.'
  },


  'PRESET': {
    'UPDATED': 'La questionnaire mis à jour.',
    'LOADED': 'Le modèle a été chargé avec succès.'
  },


  'ANSWER': {
    'UPDATED': 'La réponse a été mise à jour avec succès.',
    'IMPORTED': 'Les réponses ont été importées avec succès.',
    'REASSIGNED': 'La réponse a été reassignée avec succès.',
    'STATUS_UPDATE': 'Le statut a été mis à jour avec succès.'
  },


  'NOT_MODIFIED': {
    'USER_ANSWER': 'Vous n\'êtes pas autorisé à effectuer des modifications en mode affichage.'
  },


  'QUIZ': {
    'CREATED': 'Le quiz a été créé.',
    'GENERATED': 'Le quiz a été généré avec succès.',
  },


  'CAMPAIGN': {
    'ADDED': 'La campagne a été ajoutée avec succès.',
    'UPDATED': 'La campagne a été mise à jour avec succès.',
    'DELETED': 'La campagne et ses professionnels ont été supprimés avec succès.',
    'TEMPLATE_ERROR': 'Nous avons du mal à récupérer les données des modèles. Veuillez essayer de recharger la page !',
    'SIGNATURE_ERROR': 'Nous avons du mal à récupérer les données des signatures. Veuillez essayer de recharger la page !',
    'WORKFLOW': {
      'ADDED': 'Le workflow a été ajouté avec succès.',
      'DELETED': 'Le workflow a été supprimé avec succès.',
      'UPDATED': 'Le workflow a été mis à jour avec succès.',
      'SENT': 'L\'email a été envoyé avec succès.',
      'SENT_ERROR': 'Nous avons des difficulté à envoyer l\'email.',
      'DEFAULT': 'Le workflow par défaut a été mis à jour.'
    },
    'BATCH': {
      'NUGGETS_ERROR': 'Nous avons du mal à activer/désactiver les nuggets. Veuillez essayer de recharger la page !',
      'BATCH_ERROR': 'Nous avons du mal à activer/désactiver les batchs. Veuillez essayer de recharger la page !',
      'NUGGETS_ACTIVATED': 'Les nuggets ont été activés avec succès.',
      'NUGGETS_DEACTIVATED': 'Les nuggets ont été désactivés avec succès.',
      'NOT_CREATED': 'Aucun batch n\'est créé.',
      'STARTED': 'Le batch a été démarré avec succès.',
      'CREATED': 'Le batch a été créé avec succès.',
      'STOPPED': 'Le batch a été arrêté avec succès.',
      'ALREADY_STARTED': 'Le batch a déjà été lancé. Il ne peut pas être défait.',
      'DELETED': 'Le batch a été supprimé avec succès.',
      'FREEZED': 'Le batch a été mis en pause avec succès.',
      'UPDATED': 'Le batch a été mis à jour avec succès.',
      'AUTOBATCH_ON': 'L\'autobatch est activé pour cette campagne. Les batchs seront bientôt créés.',
      'AUTOBATCH_OFF': 'L\'autobatch est désactivé pour cette campagne. Aucun nouveau batch ne sera créé.',
    },
    'SEARCH': {
      'SETTINGS_UPDATED': 'Les paramètres ont été mis à jour avec succès.',
      'REQUEST_SAVED': 'La requête a été sauvegardée avec succès.',
      'NO_REQUEST': "Il n'y a pas de requête à sauvegarder !"
    }
  },


  'IMPORT': {
    'CSV': 'Le CSV a été importé avec succès.',
    'PROJECT': 'Le projet a été importé avec succès.'
  },


  'FILTER': {
    'ALREADY_EXIST': 'La vue avec ce nom existe déjà.',
    'ALREADY_ACTIVATED': 'La vue est déjà active.',
  },


  'ERRORS': {
    'PROFESSIONAL_ERROR': 'Cela peut être parce que vous essayez d\'accéder au professionnel qui n\'existe pas ou à cause d\'un problème de connexion au serveur ou une mauvaise URL.',
    'PROJECT_ERROR': 'Cela peut être parce que vous essayez d\'accéder au projet qui n\'existe pas ou à cause d\'un problème de connexion au serveur ou une mauvaise URL.',
    'FETCHING': 'Nous rencontrons des problèmes lors de la récupération des données. Cela pourrait être dû à un problème de connexion au serveur.',
    'FETCHING_CAMPAIGN_ANSWERS': 'Nous rencontrons des problèmes lors de la récupération des réponses pour cette campagne.',
    'PROJECT_FETCHING_ERROR': 'Cela peut être dû à un problème de connexion au serveur ou au fait que nous n\'avons pas trouvé l\'innovation que vous recherchez.',
    'HEADING_1': 'Oups. quelque chose s\'est mal passé..',
    'FETCHING_MESSAGE_1': 'Nous rencontrons des problèmes lors de la récupération des données.',
    'SERVER_CONNECTION': 'Cela pourrait être à cause d\'un problème de connexion au serveur.',
    'PATTERNS_DUPLICATED': 'Pattern duplicated!',
  },


  'AMBASSADOR': {
    'DELETED': 'L\'ambassadeur a été supprimé avec succès.',
  },


  'SIGNATURES': {
    'ADDED': 'La signature a été ajoutée avec succès.',
    'UPDATED': 'La signature a été mise à jour avec succès.',
    'ALREADY_EXIST': 'La signature avec la même nom existe déjà.',
    'DELETED': 'La signature a été supprimée avec succès.',
  },

  'PROFESSIONAL': {
    'MERGE_ERROR': 'Un profesionnel avec cette adresse e-mail existe déjà. Essayez de merger à la main les deux profesionnels.<br>Demandez l\'équipe tech pour plus d\'info',
  },

  'JOB': {
    'VIDEO': 'La demande de vidéo est enregistrée. Nous vous enverrons un courriel une fois qu\'elle aura été complétée.'
  }

};
