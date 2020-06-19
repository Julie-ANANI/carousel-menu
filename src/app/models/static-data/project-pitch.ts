interface HELP {
  title: string;
  summary: string;
  issue: string;
  solution?: string;
  quiz: string;
}

export interface DESCRIPTION_HELP {
  en: HELP;
  fr: HELP
}

export const DetectingNeedsHelp: DESCRIPTION_HELP = {
  en: {
    title: 'The title of the project is inserted in the subject of the emails sent to the thousands of professionals we reach out. ' +
      'It shouldn\'t be the name of the solution only, but also condense in a few words what your solution brings.',
    summary: 'The pitch must take the form of two sentences (this is a maximum) enlighting the strong and differentiating ' +
      'value proposition of your project. It will be inserted in the body of the emails we\'ll send to the professionals.',
    issue: 'This part helps to contextualize and introduce the subject matter of the questionnaire to the professionals. \n' +
      '1. Introduction\n' +
      'Introduce the subject matter / the market context.\n' +
      '2. Implications\n' +
      'Explain what\'s at stake, the upcoming issues in your field.\n' +
      '3. Approach\n' +
      'Explain your approach : why you\'re collecting this data and what your purpose is.',
    quiz: 'https://quiz.umi.us/quiz/5e7a56bd80ea600015b4e3da/5e7a475633698d6dcf10ab6e?lang=en'
  },
  fr: {
    title: 'Le titre est présent dans l’objet des emails que l’on envoie aux milliers de professionnels, il ne doit pas seulement ' +
      'être le nom de la solution mais également indiquer en quelques mots ce que fait la solution.',
    summary: 'Le pitch doit prendre la forme de deux phrases maximum mettant en lumière la proposition de valeur ' +
      'forte et différenciante du projet. Il sera présent dans le corps de texte des emails que nous enverrons aux professionnels.\n',
    issue: 'Cette partie permet de contextualiser et d\'introduire la thématique du questionnaire aux professionnels. \n' +
      '\n' +
      '1. Introduction \n' +
      'Introduisez la thématique / le contexte marché.\n' +
      '2. Enjeux à venir\n' +
      'Expliquez les enjeux à venir sur la thématique.\n' +
      '3. Démarche\n' +
      'Expliquer la démarche : dans quel but vous souhaitez collecter ces informations et à quoi elles vont servir.',
    quiz: 'https://quiz.umi.us/quiz/5e7a56bd80ea600015b4e3da/5e7a475633698d6dcf10ab6e?lang=fr'
  }
}

export const ValidatingMarketHelp: DESCRIPTION_HELP = {
  en: {
    title: 'The title of the project is inserted in the subject of the emails we send to the thousands of professionals we reach out to. ' +
      'It condenses the the subject-matter of the questionnaire in a few words.',
    summary: 'The pitch must take the form of two sentences (this is a maximum) enlighting the main issue and the purpose of the ' +
      'questionnaire. It will be inserted in the body of the emails we\'ll send to the professionals.',
    issue: 'This part helps to contextualize and introduce the identified issues to the professionals. \n' +
      '\n' +
      '1. Introduction\n' +
      'Introduce the subject matter / the market context.\n' +
      '2. Wider issue\n' +
      'Outline the major pain point.\n' +
      '3. Current solutions\' issues\n' +
      'List the current solutions and expose why they\'re not relevant.\n' +
      '4. Approach\n' +
      'Explain your approach : why you\'re collecting this data and what your purpose is.',
    quiz: 'https://quiz.umi.us/quiz/5ee746ec12eb250014627407/5e84a6b10b6ee50ed40be4c9?lang=en'
  },
  fr: {
    title: 'Le titre est présent dans l’objet des emails que l’on envoie aux milliers de professionnels, il résume en ' +
      '3-4 mots la thématique du questionnaire. ',
    summary: 'Le pitch doit prendre la forme de deux phrases mettant en lumière la problématique principale et l\'objectif du ' +
      'questionnaire. Il sera présent dans le corps de texte des emails que nous enverrons aux professionnels.\n',
    issue: 'Cette partie permet de contextualiser le questionnaire et d\'introduire les problématiques identifiées aux professionnels. \n' +
      '\n' +
      '1. Introduction \n' +
      'Introduisez la thématique/ le contexte marché.\n' +
      '2. Problématique générale \n' +
      'Expliquez le principal point de douleur.\n' +
      '3. Problématiques des solutions actuelles\n' +
      'Listez les solutions actuelles et expliquez en quoi elles ne répondent pas bien à cette problématique.\n' +
      '4. Démarche\n' +
      'Expliquez la démarche : dans quel but vous souhaitez collecter ces informations et à quoi elles vont servir.',
    quiz: 'https://quiz.umi.us/quiz/5ee746ec12eb250014627407/5e84a6b10b6ee50ed40be4c9?lang=fr'
  }
}

export const SourcingInnovativeHelp: DESCRIPTION_HELP = {
  en: {
    title: 'The title of the project is inserted in the subject of the emails sent to the thousands of professionals we reach out. ' +
      'It shouldn\'t only be the name of the solution, but also condense in a few words what your solution brings.',
    summary: 'The pitch must take the form of two sentences (this is a maximum) enlighting the main issue and the purpose of the ' +
      'questionnaire. It will be inserted in the body of the emails we\'ll send to the professionals.',
    issue: 'This part helps to contextualize and introduce the identified issues to the professionals. \n' +
      '\n' +
      '1. Introduction\n' +
      'Introduce the subject matter / the context waging to the sourcing of innovative solutions.\n' +
      '2. The issues to solve\n' +
      'Expose the issues your facing, for which your looking for solutions.\n' +
      '3. Strains / Specifications required\n' +
      'Explain the strains / specifications or use cases of the solutions / partners you\'re looking for.\n' +
      '4. Approach\n' +
      'Explain your approach : what\'s your purpose in collecting this data.',
    quiz: 'https://quiz.umi.us/quiz/5e3292a580ea600015b49c04/5e1f6489733e215e4f5a5635'
  },
  fr: {
    title: 'Le titre est présent dans l’objet des emails que l’on envoie aux milliers de professionnels, il résume en 3-4 mots ' +
      'la thématique du questionnaire. ',
    summary: 'Le pitch doit prendre la forme de deux phrases mettant en lumière la problématique principale et l\'objectif ' +
      'du questionnaire. Il sera présent dans le corps de texte des emails que nous enverrons aux professionnels.\n',
    issue: 'Cette partie permet de contextualiser le questionnaire et d\'introduire les problématiques identifiées aux professionnels. \n' +
      '\n' +
      '1. Introduction \n' +
      'Introduisez la thématique/le contexte ayant amené à la recherche de solutions innovantes.\n' +
      '2. Problématiques à résoudre \n' +
      'Expliquez les problématiques à résoudre pour laquelle vous cherchez des solutions.\n' +
      '3. Contraintes/caractéristiques recherchées\n' +
      'Expliquez les contraintes/caractéristiques ou usages des solutions/partenaires recherché(e)s.\n' +
      '4. Solutions connues/exclues\n' +
      'Listez les solutions déjà connues ou exclues.\n' +
      '5. Démarche\n' +
      'Expliquez la démarche : dans quel but vous souhaitez collecter ces informations.',
    quiz: 'https://quiz.umi.us/quiz/5e3292a580ea600015b49c04/5e1f6489733e215e4f5a5635'
  }
}

export const ValidatingInterestHelp: DESCRIPTION_HELP = {
  en: {
    title: 'The title of the project is inserted in the subject of the emails sent to the thousands of professionals we reach out. ' +
      'It shouldn\'t be the name of the solution only, but also condense in a few words what your solution brings.',
    summary: 'The pitch must take the form of two sentences (this is a maximum) enlighting the strong and differentiating value ' +
      'proposition of your project. It will be inserted in the body of the emails we\'ll send to the professionals.',
    issue: 'This part helps to contextualize the questionnaire and to introduce the identified issues to the professionals. \n' +
      '\n' +
      '1. Introduction\n' +
      'Introduce the scope / subject matter and the market context.\n' +
      '2. Wider issue\n' +
      'Outline the major pain point.\n' +
      '3. Current solutions\' issues\n' +
      'List the current solutions and expose why they\'re not relevant.',
    solution: 'This section is meant to describe your solution in terms of features, benefits to the user, properties and to address ' +
      'the issues identified in the "Issues" part. \n' +
      '\n' +
      '1. Solution\n' +
      'Describe the solution\n' +
      '2. Main solved issue\n' +
      'Explain how your solution solves the main issue.\n' +
      '3. Differentiation\n' +
      'Explain in which way your it stands out from the current solutions.',
    quiz: 'https://quiz.umi.us/quiz/5de8c24e80ea600015b478f7/5dc11054b4fc806a74800bcc?lang=en'
  },
  fr: {
    title: 'Le titre est présent dans l’objet des emails que l’on envoie aux milliers de professionnels, il ne doit pas seulement ' +
      'être le nom de la solution mais également indiquer en 3-4 mots ce que fait la solution.',
    summary: 'Le pitch doit prendre la forme de deux phrases maximum mettant en lumière la proposition de valeur forte et ' +
      'différenciante du projet. Il sera présent dans le corps de texte des emails que nous enverrons aux professionnels.',
    issue: 'Cette partie permet de contextualiser le questionnaire et d\'introduire les problématiques identifiées aux professionnels. \n' +
      '\n' +
      '1. Introduction \n' +
      'Introduisez le périmètre / la thématique et le contexte marché.\n' +
      '2. Problématique générale \n' +
      'Expliquez le principal point de douleur.\n' +
      '3. Problématiques des solutions actuelles \n' +
      'Listez les solutions actuelles et expliquez en quoi elles ne répondent pas bien à cette problématique.',
    solution: 'Cette partie permet d\'expliquer votre solution en termes de fonctionnalités, de bénéfices d\'usage, ' +
      'de propriétés et de répondre aux problématiques identifées dans la partie "problématiques" \n' +
      '\n' +
      '1. Votre solution\n' +
      'Décrivez ce qu\'est la solution.\n' +
      '2. Problématique principale solutionnée\n' +
      'Expliquez comment elle résoud la problématique principale.\n' +
      '3. Différentiation\n' +
      'Expliquez en quoi elle se différencie des solutions actuelles.',
    quiz: 'https://quiz.umi.us/quiz/5de8c24e80ea600015b478f7/5dc11054b4fc806a74800bcc?lang=fr'
  }
}

export const DiscoveringApplicationsHelp: DESCRIPTION_HELP = {
  en: {
    title: 'The title of the project is inserted in the subject of the emails sent to the thousands of professionals we reach out. ' +
      'It shouldn\'t be the name of the solution only, but also condense in a few words what your solution brings.',
    summary: 'The pitch must take the form of two sentences (this is a maximum) enlighting the strong and differentiating ' +
      'value proposition of your project. It will be inserted in the body of the emails we\'ll send to the professionals.',
    issue: 'This part helps to contextualize the questionnaire and to introduce the identified issues to the professionals. \n' +
      '\n' +
      '1. Introduction\n' +
      'Introduce the scope / subject matter and the market context.\n' +
      '2. Wider issue\n' +
      'Outline the major pain point.\n' +
      '3. Current solutions\' issues\n' +
      'List the current solutions and expose why they\'re not relevant.',
    solution: 'This section is meant to describe your solution in terms of features, benefits to the user, properties and to ' +
      'address the issues identified in the "Issues" part. \n' +
      '\n' +
      '1. Solution\n' +
      'Describe the solution.\n' +
      '2. Main solved issue\n' +
      'Explain how your solution solves the main issue.\n' +
      '3. Differentiation\n' +
      'Explain in which way your it stands out from the current solutions.',
    quiz: 'https://quiz.umi.us/quiz/5dde944580ea600015b4714b/5da49e135bc26796fba961a9?lang=en'
  },
  fr: {
    title: 'Le titre est présent dans l’objet des emails que l’on envoie aux milliers de professionnels, il ne doit pas seulement ' +
      'être le nom de la solution mais également indiquer en 3-4 mots ce que fait la solution.',
    summary: 'Le pitch doit prendre la forme de deux phrases maximum mettant en lumière la proposition de valeur forte et ' +
      'différenciante du projet. Il sera présent dans le corps de texte des emails que nous enverrons aux professionnels.',
    issue: 'Cette partie permet de contextualiser le questionnaire et d\'introduire les problématiques identifiées aux professionnels. \n' +
      '\n' +
      '1. Introduction \n' +
      'Introduisez le périmètre / la thématique et le contexte marché. \n' +
      '2. Problématique générale \n' +
      'Expliquez le principal point de douleur (si vous le connaissez).\n' +
      '3. Problématiques des solutions actuelles \n' +
      'Listez les solutions actuelles et expliquez en quoi elles ne répondent pas bien à cette problématique.',
    solution: 'Cette partie permet d\'expliquer votre solution en termes de fonctionnalités, de bénéfices d\'usage, ' +
      'de propriétés et de répondre aux problématiques identifées dans la partie "problématiques" \n' +
      '\n' +
      '1. Votre solution\n' +
      'Décrivez ce qu\'est la solution.\n' +
      '2. Problématique principale solutionnée\n' +
      'Expliquez comment elle résoud la problématique principale.\n' +
      '3. Différentiation\n' +
      'Expliquez en quoi elle se différencie des solutions actuelles.',
    quiz: 'https://quiz.umi.us/quiz/5dde944580ea600015b4714b/5da49e135bc26796fba961a9?lang=fr'
  }
}

export const TargetingApplicationHelp: DESCRIPTION_HELP = {
  en: {
    title: 'The title of the project is inserted in the subject of the emails sent to the thousands of professionals we reach out. ' +
      'It shouldn\'t be the name of the solution only, but also condense in a few words what your solution brings.',
    summary: 'The pitch must take the form of two sentences (this is a maximum) enlighting the strong and differentiating ' +
      'value proposition of your project. It will be inserted in the body of the emails we\'ll send to the professionals.',
    issue: 'This part helps to contextualize the questionnaire and to introduce the identified issues to the professionals. \n' +
      '\n' +
      '1. Introduction\n' +
      'Introduce the scope / subject matter.\n' +
      '2. Wider issue\n' +
      'Outline the major pain point.\n' +
      '3. Current solutions\' issues\n' +
      'List the current solutions and expose why they\'re not relevant.',
    solution: 'This section is meant to describe your solution in terms of features, benefits to the user, properties and to ' +
      'address the issues identified in the "Issues" part. \n' +
      '\n' +
      '1. Solution\n' +
      'Describe the solution.\n' +
      '2. Main solved issue\n' +
      'Explain how your solution solves the main issue.\n' +
      '3. Differentiation\n' +
      'Explain in which way your it stands out from the current solutions.',
    quiz: 'https://quiz.umi.us/quiz/5dde944580ea600015b4714b/5da49e135bc26796fba961a9?lang=en'
  },
  fr: {
    title: 'Le titre est présent dans l’objet des emails que l’on envoie aux milliers de professionnels, il ne doit pas seulement ' +
      'être le nom de la solution mais également indiquer en 3-4 mots ce que fait la solution.',
    summary: 'Le pitch doit prendre la forme de deux phrases maximum mettant en lumière la proposition de valeur forte et ' +
      'différenciante du projet. Il sera présent dans le corps de texte des emails que nous enverrons aux professionnels.',
    issue: 'Cette partie permet de contextualiser le questionnaire et d\'introduire les problématiques identifiées aux professionnels. \n' +
      '\n' +
      '1. Introduction \n' +
      'Introduisez le périmètre / la thématique.\n' +
      '2. Problématique générale \n' +
      'Expliquez le principal point de douleur.\n' +
      '3. Problématiques des solutions actuelles \n' +
      'Listez les solutions actuelles et expliquez en quoi elles ne répondent pas bien à cette problématique.',
    solution: 'Cette partie permet d\'expliquer votre solution en termes de fonctionnalités, de bénéfices d\'usage, ' +
      'de propriétés et de répondre aux problématiques identifées dans la partie "problématiques" \n' +
      '\n' +
      '1. Votre solution\n' +
      'Décrivez ce qu\'est la solution.\n' +
      '2. Problématique principale solutionnée\n' +
      'Expliquez comment elle résoud la problématique principale.\n' +
      '3. Différentiation\n' +
      'Expliquez en quoi elle se différencie des solutions actuelles.',
    quiz: 'https://quiz.umi.us/quiz/5dde944580ea600015b4714b/5da49e135bc26796fba961a9?lang=fr'
  }
}

export const OptimizingValueHelp: DESCRIPTION_HELP = {
  en: {
    title: 'The title of the project is inserted in the subject of the emails sent to the thousands of professionals we reach out. ' +
      'It shouldn\'t be the name of the solution only, but also condense in a few words what your solution brings.',
    summary: 'The pitch must take the form of two sentences (this is a maximum) enlighting the strong and differentiating ' +
      'value proposition of your project. It will be inserted in the body of the emails we\'ll send to the professionals.',
    issue: 'This part helps to contextualize the questionnaire and to introduce the identified issues to the professionals. \n' +
      '\n' +
      '1. Introduction\n' +
      'Introduce the scope / subject matter and the market context.\n' +
      '2. Wider issue\n' +
      'Outline the major pain point.\n' +
      '3. Current solutions\' issues\n' +
      'List the current solutions and expose why they\'re not relevant.',
    solution: 'This section is meant to describe your solution in terms of features, benefits to the user, properties and to ' +
      'address the issues identified in the "Issues" part. \n' +
      '\n' +
      '1. Solution\n' +
      'Describe the solution.\n' +
      '2. Main solved issue\n' +
      'Explain how your solution solves the main issue.\n' +
      '3. Differentiation\n' +
      'Explain in which way your it stands out from the current solutions.',
    quiz: 'https://quiz.umi.us/quiz/5c9e33c6e0ce7d001cde8a98/5c92425a01ea6d73469107ce?lang=en'
  },
  fr: {
    title: 'Le titre est présent dans l’objet des emails que l’on envoie aux milliers de professionnels, il ne doit pas seulement ' +
      'être le nom de la solution mais également indiquer en 3-4 mots ce que fait la solution.',
    summary: 'Le pitch doit prendre la forme de deux phrases maximum mettant en lumière la proposition de valeur forte et ' +
      'différenciante du projet. Il sera présent dans le corps de texte des emails que nous enverrons aux professionnels.',
    issue: 'Cette partie permet de contextualiser le questionnaire et d\'introduire les problématiques identifiées aux professionnels. \n' +
      '\n' +
      '1. Introduction \n' +
      'Introduisez le périmètre / la thématique et le contexte marché. \n' +
      '2. Problématique générale \n' +
      'Expliquez le principal point de douleur.\n' +
      '3. Problématiques des solutions actuelles \n' +
      'Listez les solutions actuelles et expliquez en quoi elles ne répondent pas bien à cette problématique.',
    solution: 'Cette partie permet d\'expliquer votre solution en termes de fonctionnalités, de bénéfices d\'usage, ' +
      'de propriétés et de répondre aux problématiques identifées dans la partie "problématiques" \n' +
      '\n' +
      '1. Votre solution\n' +
      'Décrivez ce qu\'est la solution.\n' +
      '2. Problématique principale solutionnée\n' +
      'Expliquez comment elle résoud la problématique principale.\n' +
      '3. Différentiation\n' +
      'Expliquez en quoi elle se différencie des solutions actuelles.',
    quiz: 'https://quiz.umi.us/quiz/5c9e33c6e0ce7d001cde8a98/5c92425a01ea6d73469107ce?lang=fr'
  }
}

export const OtherHelp: DESCRIPTION_HELP = {
  en: {
    title: '',
    summary: '',
    issue: 'This part helps to contextualize the questionnaire and to introduce the identified issues to the professionals. \n' +
      '\n' +
      '1. Introduction\n' +
      'Introduce the scope / subject matter and the market context.\n' +
      '2. Wider issue\n' +
      'Outline the major pain point.\n' +
      '3. Current solutions\' issues\n' +
      'List the current solutions and expose why they\'re not relevant.',
    solution: 'This section is meant to describe your solution in terms of features, benefits to the user, properties and to ' +
      'address the issues identified in the "Issues" part. \n' +
      '\n' +
      '1. Solution\n' +
      'Describe the solution.\n' +
      '2. Main solved issue\n' +
      'Explain how your solution solves the main issue.\n' +
      '3. Differentiation\n' +
      'Explain in which way your it stands out from the current solutions.',
    quiz: 'https://quiz.umi.us/quiz/5de8c24e80ea600015b478f7/5dc11054b4fc806a74800bcc?lang=en'
  },
  fr: {
    title: '',
    summary: '',
    issue: 'Cette partie permet de contextualiser le questionnaire et d\'introduire les problématiques identifiées aux professionnels. \n' +
      '\n' +
      '1. Introduction \n' +
      'Introduisez le périmètre / la thématique et le contexte marché. \n' +
      '2. Problématique générale \n' +
      'Expliquez le principal point de douleur.\n' +
      '3. Problématiques des solutions actuelles \n' +
      'Listez les solutions actuelles et expliquez en quoi elles ne répondent pas bien à cette problématique.',
    solution: 'Cette partie permet d\'expliquer votre solution en termes de fonctionnalités, de bénéfices d\'usage, ' +
      'de propriétés et de répondre aux problématiques identifées dans la partie "problématiques" \n' +
      '\n' +
      '1. Votre solution\n' +
      'Décrivez ce qu\'est la solution.\n' +
      '2. Problématique principale solutionnée\n' +
      'Expliquez comment elle résoud la problématique principale.\n' +
      '3. Différentiation\n' +
      'Expliquez en quoi elle se différencie des solutions actuelles.',
    quiz: 'https://quiz.umi.us/quiz/5de8c24e80ea600015b478f7/5dc11054b4fc806a74800bcc?lang=fr'
  }
}
