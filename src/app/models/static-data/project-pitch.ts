export interface PitchHelpFields {
  title: string;
  summary: string;
  issue: string;
  solution?: string;
  quiz: string;
  example: {
    title: string;
    summary: string;
    issue: string;
    solution?: string
  }
}

export interface PitchDescriptionHelp {
  en: PitchHelpFields;
  fr: PitchHelpFields;
}

export const DetectingNeedsHelp: PitchDescriptionHelp = {
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
    quiz: 'https://quiz.umi.us/quiz/5e7a56bd80ea600015b4e3da/5e7a475633698d6dcf10ab6e?lang=en',
    example: {
      title: '5G deployment impact for MNO',
      summary: 'As a world leader of digital transformation solution, we would like to better understand how the deployment of ' +
        '5G will impact telecom companies and their various activities in the coming years.',
      issue: 'For several years now, companies around the world have been preparing themselves for the deployment of 5G by trying to ' +
        'anticipate tomorrow\'s uses and impacts (autonomous car, home automation, RV, etc.).\n' +
        '\n' +
        'For telecom companies, 5G technology is already transforming organizations, the value chain, offers, as well as the available ' +
        'services. Thus, new expectations and needs are emerging on all sides in order to overcome this new technological challenge, ' +
        'which is essential to maintain the highest level of competitiveness.\n' +
        '\n' +
        'Through this questionnaire, we would like to better understand the stakes in order to anticipate future needs and issues: ' +
        'those of our customers, our own, those of our partners, but also those of other business sectors.'
    }
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
    quiz: 'https://quiz.umi.us/quiz/5e7a56bd80ea600015b4e3da/5e7a475633698d6dcf10ab6e?lang=fr',
    example: {
      title: '5G deployment impact for MNO',
      summary: 'As a world leader of digital transformation solution, we would like to better understand how the deployment of ' +
        '5G will impact telecom companies and their various activities in the coming years.',
      issue: 'For several years now, companies around the world have been preparing themselves for the deployment of 5G by trying to ' +
        'anticipate tomorrow\'s uses and impacts (autonomous car, home automation, RV, etc.).\n' +
        '\n' +
        'For telecom companies, 5G technology is already transforming organizations, the value chain, offers, as well as the available ' +
        'services. Thus, new expectations and needs are emerging on all sides in order to overcome this new technological challenge, ' +
        'which is essential to maintain the highest level of competitiveness.\n' +
        '\n' +
        'Through this questionnaire, we would like to better understand the stakes in order to anticipate future needs and issues: ' +
        'those of our customers, our own, those of our partners, but also those of other business sectors.'
    }
  }
}

export const ValidatingMarketHelp: PitchDescriptionHelp = {
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
    quiz: 'https://quiz.umi.us/quiz/5ee746ec12eb250014627407/5e84a6b10b6ee50ed40be4c9?lang=en',
    example: {
      title: 'Solution for evaluating the welding quality of plastic parts by simulation',
      summary: 'It is a patented device to evaluate the weld quality between two plastic parts by simulating the real weld operation ' +
        'before actually doing it.',
      issue: 'Fluid distribution networks (water, gas, industrial fluids) are mainly made up of plastic pipes. Whether to deploy, ' +
        'extend, branch out or maintain these networks, operators have to carry out welding operations on plastic parts.\n' +
        '\n' +
        'Despite the maturity of plastic pipe welding techniques - the most common being electrofusion and butt welding - they are ' +
        'failures that may not be revealed during the quality control sampling in the manufacture of electrofusion tubes or fittings. ' +
        'These failures may eventually result in leaks that compromise the safety of the system and have financial repercussions. \n' +
        '\n' +
        'Control methods such as visual inspection, pressure resistance or leak detection tests are used on site and during audits, ' +
        'but these are systematically carried out after the welding operation.\n' +
        '\n' +
        'There are nowadays complementary methods based on the measurement of temperature fields which allow to ensure the correct ' +
        'functioning of a welding operation: \n' +
        '\n' +
        '- Measurements by thermal cameras make it possible to carry out measurements that are too global (difficult access to ' +
        'the interface due to interference) and generate volumes of information that are difficult to process and interpret.\n' +
        '\n' +
        '- Measurements by integration of thermal sensors on or within the test parts allow access to the interface of these parts. ' +
        'The integration of thermal sensors within the parts themselves can be difficult due to integration techniques. The use ' +
        'of micro-sensor film deposited on the surface of the parts is an expensive solution with a risk of pollution of the ' +
        'measurement, and is non-reusable. Moreover, these films are not adapted to the range of temperatures encountered during fusion ' +
        'welding of thermoplastic polymers.'
    }
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
    quiz: 'https://quiz.umi.us/quiz/5ee746ec12eb250014627407/5e84a6b10b6ee50ed40be4c9?lang=fr',
    example: {
      title: 'Solution d\'évaluation de la qualité de soudage de pièces plastiques par simulation',
      summary: 'Il s\'agit d\'un dispositif breveté qui permet d’évaluer la qualité de soudure entre deux pièces plastiques, ' +
        'en simulant l’opération réelle en amont de la réalisation de cette dernière.',
      issue: 'Les réseaux de distribution de fluides (eau, gaz, fluides industriels) sont majoritairement constitués de tube plastiques. ' +
        'Que ce soit pour déployer, étendre ou encore maintenir ces réseaux, les exploitants sont amenés à réaliser des opérations ' +
        'de soudage de pièces plastiques.\n' +
        '\n' +
        'Malgré la maturité des techniques de soudage de tubes plastiques - electrofusion et soudage bout à bout pour les plus ' +
        'communes - on constate des défaillances qui peuvent parfois ne pas se révéler lors des contrôles qualité par échantillonnage ' +
        'en fabrication des tubes ou des accessoires electrosoudables. Elles peuvent se traduire à terme par des fuites remettant en ' +
        'cause la sécurité du réseau et ayant des répercussions financières. \n' +
        '\n' +
        'Des méthodes de contrôles telles que l\'inspection visuelle, les essais de résistance en pression ou de détection de fuite ' +
        'sont utilisées sur chantier et à l\'occasion d\'audits, mais ces dernières interviennent systématiquement a posteriori ' +
        'de l\'opération de soudage.\n' +
        '\n' +
        'Il existe aujourd\'hui des méthodes complémentaires basées sur la mesure de champs de températures qui permettent de s\'assurer ' +
        'du bon fonctionnement d\'une opération de soudage : \n' +
        '\n' +
        '- Les mesures par caméras thermiques permettent de réaliser des mesures trop globales (accès à l\'interface difficile ' +
        'du fait des interférences) et générant des volumes d\'informations difficiles à traiter et à interpréter.\n' +
        '\n' +
        '- Les mesures par intégration de capteurs thermiques sur ou au sein des pièces à tester permettent d\'accéder à ' +
        'l\'interface de ces pièces. L’intégration de capteurs thermiques au sein même des pièces peut se révéler difficile du ' +
        'fait des techniques d\'intégration. L\'utilisation de film à micro-capteurs déposé en surface des pièces est une solution ' +
        'chère présentant un risque de pollution de la mesure, et est non-réutilisable. De plus ces films ne sont pas adaptés à la ' +
        'gamme des températures rencontrées durant le soudage par fusion de polymères thermoplastiques.'
    }
  }
}

export const SourcingInnovativeHelp: PitchDescriptionHelp = {
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
    quiz: 'https://quiz.umi.us/quiz/5e3292a580ea600015b49c04/5e1f6489733e215e4f5a5635',
    example: {
      title: 'Plant pathogens early detection toolkit',
      summary: 'This current project aims to identify the most promising techniques of detecting plant pathogens at their latent phase ' +
        'at field scale from a very few hectares up to an array of 200 Ha. Early detection and quantification of available pathogens ' +
        'should improve the application timing resulting in significant cost savings, while reducing pressure on the environment.',
      issue: 'Plants pathogenic fungi are difficult to monitor in open environment due to the high diversity of the microorganisms as ' +
        'well as host crops, the enormous complexity and extreme volatility of their environment.\n' +
        '\n' +
        'Currently, the timing of use for highly potent fungicides can be sub-optimal leading to higher costs as well as unnecessary ' +
        'exposure to the environment of applications associated with a risk of resistance selection.\n' +
        '\n' +
        'As well, current plant-pathogen scounting practice does not support a good understanding of plant-pathogen interactions ' +
        'epidemiology. For example, since interactions happen, latent infections cannot be detected by field scouting for visible ' +
        'symptoms, thus crop managers often intervene too late and pathogens having a rapid disease development.\n' +
        '\n' +
        'Finally, currently, insufficient justification due to lack of evidences at the beginning of infestation leads to a low public ' +
        'acceptance of crop caring systems.\n' +
        '\n' +
        'We hope to identify the most promising techniques of detecting plant pathogens at their latent phase in order to solve ' +
        'these issues. It would be kind to have your help.'
    }
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
    quiz: 'https://quiz.umi.us/quiz/5e3292a580ea600015b49c04/5e1f6489733e215e4f5a5635',
    example: {
      title: 'Plant pathogens early detection toolkit',
      summary: 'This current project aims to identify the most promising techniques of detecting plant pathogens at their latent phase ' +
        'at field scale from a very few hectares up to an array of 200 Ha. Early detection and quantification of available pathogens ' +
        'should improve the application timing resulting in significant cost savings, while reducing pressure on the environment.',
      issue: 'Plants pathogenic fungi are difficult to monitor in open environment due to the high diversity of the microorganisms as ' +
        'well as host crops, the enormous complexity and extreme volatility of their environment.\n' +
        '\n' +
        'Currently, the timing of use for highly potent fungicides can be sub-optimal leading to higher costs as well as unnecessary ' +
        'exposure to the environment of applications associated with a risk of resistance selection.\n' +
        '\n' +
        'As well, current plant-pathogen scounting practice does not support a good understanding of plant-pathogen interactions ' +
        'epidemiology. For example, since interactions happen, latent infections cannot be detected by field scouting for visible ' +
        'symptoms, thus crop managers often intervene too late and pathogens having a rapid disease development.\n' +
        '\n' +
        'Finally, currently, insufficient justification due to lack of evidences at the beginning of infestation leads to a low public ' +
        'acceptance of crop caring systems.\n' +
        '\n' +
        'We hope to identify the most promising techniques of detecting plant pathogens at their latent phase in order to solve ' +
        'these issues. It would be kind to have your help.'
    }
  }
}

export const ValidatingInterestHelp: PitchDescriptionHelp = {
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
    quiz: 'https://quiz.umi.us/quiz/5de8c24e80ea600015b478f7/5dc11054b4fc806a74800bcc?lang=en',
    example: {
      title: 'On-site hydrogen production unit',
      summary: 'Competitive solution for on-site hydrogen production from natural gas that is more competitive and sustainable than ' +
        'the existing hydrogen supply (cylinders, bundles, tank trailers or liquid hydrogen), which require specific transportation means, ' +
        'compliant with existing regulations.',
      issue: 'Today, hydrogen production is centralized near large industrial areas. The supply arrives by truck, either compressed or ' +
        'liquid gas tanker.\n' +
        '\n' +
        'Dependence on centralized production presents three difficulties:\n' +
        '\n' +
        '1) The transportation cost has a significant impact on the overall hydrogen cost when the place of consumption is far from the ' +
        'production centers. (it could represent up to 40% of the total H2 cost, depending on the geographical area).\n' +
        '\n' +
        '2) The environmental impact of heavy truck transport generates a significant or even critical carbon footprint for certain ' +
        'applications (e. g. hydrogen energy). \n' +
        '\n' +
        '3) Supply chain management can be affected by regulations related to local transporation and hazardous materials. The supply ' +
        'chain can also be affected by the variability of customer consumption. Finally, for customers with high hydrogen consumption, ' +
        'the traditional supply by transportation does not make sense.  \n' +
        '\n' +
        'A few alternative solutions are emerging but none of them are competitive yet. ',
      solution: 'We have developed a solution for on-site hydrogen production from natural gas. The hydrogen quality is at least equivalent to that produced from industrial sources (e.g. SMR)  (purity >99%).\n' +
        '\n' +
        'This on-site hydrogen solution offers the following advantages:\n' +
        '\n' +
        '1) Reduce costs\n' +
        '\n' +
        'On-site production with our unit is more cost-effective (15% lower than existing on-site solutions on average) than a supply which is centrally produced then transported.\n' +
        '\n' +
        '2) Reduce the environmental impact:\n' +
        '\n' +
        'Depending on the geography and natural gas supply, heavy truck transport could be partially or totally eliminated, resulting ' +
        'in a significantly reduced carbon footprint. In addition, this new on-site hydrogen solution reduces CO2 emissions by 20% ' +
        'compared to existing solutions. \n' +
        '\n' +
        '3) Mastering the supply chain:\n' +
        '\n' +
        'Limit risks related to transportation: delays and non-delivery\n' +
        'Reduced delivery times for more flexible consumption\n' +
        'Optimize storage\n' +
        'The on-site H2 plant is available in 3 sizes: 50 m3/h, 100 m3/h, and 150 m3/h. The space requirement is limited to 20 ft. ' +
        'container modules for the 50m3/h model and 40 ft. for the 100 m3/h and 150 m3/h models.  '
    }
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
    quiz: 'https://quiz.umi.us/quiz/5de8c24e80ea600015b478f7/5dc11054b4fc806a74800bcc?lang=fr',
    example: {
      title: 'Module de production d\'hydrogène sur site',
      summary: 'Solution pour la production d\'hydrogène sur site à partir de gaz naturel plus compétitive et durable que ' +
        'l\'approvisionnement en hydrogène existant (bouteilles, cylindres, remorques citernes ou hydrogène liquide), qui ' +
        'nécessite des moyens de transport spécifiques, soumis à des réglementations fortes.',
      issue: 'Aujourd’hui la production d’hydrogène est centralisée proches des grands bassins industriels. L’approvisionnement ' +
        'est réalisé par camion réservoir de gaz comprimé ou liquide.\n' +
        '\n' +
        'Cette dépendance de la production centralisée implique 3 difficultés :\n' +
        '\n' +
        '1) Le coût d\'approvisionnement impacte fortement le coût global de l\'hydrogène dès lors que le lieu de consommation ' +
        'est éloigné des centres de production. Cela peut représenter jusqu\'à 40% du coût total de l\'hydrogène livré selon la ' +
        'géographie. \n' +
        '\n' +
        '2) L’impact environnemental des poids lourds engendre un bilan carbone important voire critique pour certaines applications ' +
        '(Hydrogène énergie par exemple).\n' +
        '\n' +
        '3) La maitrise de la supply chain peut être impactée par les normes  de transports locales ou de produits dangereux. ' +
        'Elle peut aussi être impactée par la variabilité de consommation. Enfin à partir d\'un niveau de consommation d\'hydrogène ' +
        'important l\'approvisionnement par transport devient une abération.\n' +
        '\n' +
        'Certaines solutions de production d’hydrogène décentralisées voient le jour mais aucune n’est compétitive.',
      solution: 'Nous avons développé une solution de production d’hydrogène sur site à partir de gaz naturel. L\'hydrogène généré est de ' +
        'qualité équivalente à une production centralisée (pureté >99%). \n' +
        '\n' +
        'Cette production d\'hydrogène sur site offre les avantages suivants :\n' +
        '\n' +
        '1) Réduire les coûts\n' +
        '\n' +
        'La production sur site avec notre module est plus rentable (environ 15% inférieur par rapport aux solutions on-site existantes) ' +
        'que production centralisée et de son approvisionnement en transport.\n' +
        '\n' +
        '2) Réduire l\'impact environnemental :\n' +
        '\n' +
        'En fonction de la géographie et de l\'approvisionnement en gaz naturel, le transport par poids lourds est partiellement ou ' +
        'totalement supprimé, d\'où un bilan carbone fortement réduit.\n' +
        '\n' +
        'Cette nouvelle solution de génération sur site émet 20% de moins de C02 par rapport aux solutions on-sites existantes.\n' +
        '\n' +
        '3) Maitriser la supply chain :\n' +
        '\n' +
        'Limiter les risques liés au transport : retards et défauts de livraison\n' +
        'Réduire les délais de livraison pour une consommation plus flexible\n' +
        'Optimiser le stockage\n' +
        'L\'unité de production sur site est disponible suivant 3 capacités : 50 m3h / 100 m3h / 150 m3h.\n' +
        '\n' +
        'L’encombrement est limité dans des modules conteneurs de 20 ft pour le modèle 50m3h et 40 ft pour les modèles 100 m3h et 150 m3h.'
    }
  }
}

export const DiscoveringApplicationsHelp: PitchDescriptionHelp = {
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
    quiz: 'https://quiz.umi.us/quiz/5dde944580ea600015b4714b/5da49e135bc26796fba961a9?lang=en',
    example: {
      title: 'Smart Power Ecosystem',
      summary: 'A smart Energy Management System that easily interfaces with existing energy production and consumption devices to ' +
        'improve their availability (autonomy, lifetime) and thus reduce pollution (noise, CO2 emissions)',
      issue: 'Nowadays power management and optimization is a major challenge for our societies. However, new solutions development ' +
        'costs are more and more high and encourage people to use new and fully unproved technologies which are  increasingly dangerous ' +
        'and highly polluting. \n' +
        '\n' +
        'Many sectors of activity are concerned by the use of batteries and are facing the following problems:\n' +
        '\n' +
        'Lifetime: regular replacement of batteries\n' +
        'Autonomy: regular recharging of systems\n' +
        'Oversizing (size and weight)  \n' +
        'Batteries premature degradation in operational using and during storage\n' +
        'Lack of batteries feedback: healthy battery change, recharging when not necessary, unknown life span,...',
      solution: 'Our solution consists in putting our intelligent battery charge and discharge management system in energy production ' +
        'and consumption devices, which controls a specific configuration of the batteries.\n' +
        '\n' +
        'Combined to AI, Smart Power Ecosystem anticipates and optimizes consumption and production (solar, heat engines) to increase ' +
        'more than 30% of power recovery rate, 50% of operational running time and 3 times  battery life.\n' +
        '\n' +
        'The system also allows the visualization of the battery\'s health status on existing device interfaces and efficient time ' +
        'of use for better management of energy sources.\n' +
        '\n' +
        'Our Smart Power Ecosystem can be used for both civil and military applications (e. g. automotive, hybrid/electric cars, ' +
        'renewable energies, radio, Mobile, timers, power units, IoT, etc.) and for all battery technologies (lithium, lead, etc.)'
    }
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
    quiz: 'https://quiz.umi.us/quiz/5dde944580ea600015b4714b/5da49e135bc26796fba961a9?lang=fr',
    example: {
      title: 'Ecosystème de gestion de l\'énergie',
      summary: 'Une technologie de gestion intelligente de l\'énergie qui s\'interface facilement dans les dispositifs de production ' +
        'et de consommation d\'énergie actuels pour améliorer leur disponibilité (autonomie, durée de vie) et donc réduire la pollution' +
        ' engendrée (bruit, émissions de CO2).',
      issue: 'Aujourd\'hui, la gestion et l\'optimisation de l\'énergie est un enjeu majeur de nos sociétés. Toutefois, les coûts ' +
        'associés au développement de nouvelles solutions sont extrêmement élevés et poussent les gens à utiliser des technologies ' +
        'non mâtures, très polluantes et de plus en plus dangereuses.\n' +
        '\n' +
        'De nombreux secteurs d\'activités sont concernés par l\'utilisation de batteries et font face aux problèmes :\n' +
        '\n' +
        'de durée de vie : remplacement régulier des batteries\n' +
        'd’autonomie : rechargement régulier des systèmes \n' +
        'de surdimensionnement (encombrement et poids) \n' +
        'de dégradation prématurée des batteries en utilisation et lors du stockage \n' +
        'de manque de connaissances de l\'état des batteries : changement de batterie en bonne santé, rechargement de celles-ci quand ' +
        'ce n\'est pas nécessaire, durée de vie inconnue',
      solution: 'Notre solution consiste à mettre dans les dispositifs de production et de consommation de l\'énergie, notre système ' +
        'intelligent de gestion de charge et décharge des batteries pilotant une configuration spécifique de celles-ci. \n' +
        '\n' +
        'Grâce à son IA, le système anticipe et optimise les consommations mais aussi les productions (solaire, thermiques) pour ' +
        'augmenter de plus de 30 % le taux de récupération de l’énergie, de 50 % l’autonomie et multiplier par 3 la durée de vie des batteries.\n' +
        '\n' +
        'Le système permet aussi la visualisation de l\'état de santé de la batterie sur les interfaces existantes des dispositifs ' +
        'et le temps efficace d\'utilisation pour une meilleure gestion des sources d\'énergie.  \n' +
        '\n' +
        'Notre écosystème de gestion intelligent de l’énergie s\'adapte sur tout type d\'applications aussi bien civiles que ' +
        'militaires (ex : Automobile, voiture hybride/électrique, énergies renouvelables, radio, téléphone, bâtiment, groupes ' +
        'électrogènes, objets connectés, ...) et pour toutes les technologies de batterie (lithium, plomb, ...)'
    }
  }
}

export const TargetingApplicationHelp: PitchDescriptionHelp = {
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
    quiz: 'https://quiz.umi.us/quiz/5dde944580ea600015b4714b/5da49e135bc26796fba961a9?lang=en',
    example: {
      title: 'Smart Power Ecosystem',
      summary: 'A smart Energy Management System that easily interfaces with existing energy production and consumption devices to ' +
        'improve their availability (autonomy, lifetime) and thus reduce pollution (noise, CO2 emissions)',
      issue: 'Nowadays power management and optimization is a major challenge for our societies. However, new solutions development ' +
        'costs are more and more high and encourage people to use new and fully unproved technologies which are  increasingly dangerous ' +
        'and highly polluting. \n' +
        '\n' +
        'Many sectors of activity are concerned by the use of batteries and are facing the following problems:\n' +
        '\n' +
        'Lifetime: regular replacement of batteries\n' +
        'Autonomy: regular recharging of systems\n' +
        'Oversizing (size and weight)  \n' +
        'Batteries premature degradation in operational using and during storage\n' +
        'Lack of batteries feedback: healthy battery change, recharging when not necessary, unknown life span,...',
      solution: 'Our solution consists in putting our intelligent battery charge and discharge management system in energy production ' +
        'and consumption devices, which controls a specific configuration of the batteries.\n' +
        '\n' +
        'Combined to AI, Smart Power Ecosystem anticipates and optimizes consumption and production (solar, heat engines) to increase ' +
        'more than 30% of power recovery rate, 50% of operational running time and 3 times  battery life.\n' +
        '\n' +
        'The system also allows the visualization of the battery\'s health status on existing device interfaces and efficient time ' +
        'of use for better management of energy sources.\n' +
        '\n' +
        'Our Smart Power Ecosystem can be used for both civil and military applications (e. g. automotive, hybrid/electric cars, ' +
        'renewable energies, radio, Mobile, timers, power units, IoT, etc.) and for all battery technologies (lithium, lead, etc.)'
    }
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
    quiz: 'https://quiz.umi.us/quiz/5dde944580ea600015b4714b/5da49e135bc26796fba961a9?lang=fr',
    example: {
      title: 'Ecosystème de gestion de l\'énergie',
      summary: 'Une technologie de gestion intelligente de l\'énergie qui s\'interface facilement dans les dispositifs de production ' +
        'et de consommation d\'énergie actuels pour améliorer leur disponibilité (autonomie, durée de vie) et donc réduire la pollution' +
        ' engendrée (bruit, émissions de CO2).',
      issue: 'Aujourd\'hui, la gestion et l\'optimisation de l\'énergie est un enjeu majeur de nos sociétés. Toutefois, les coûts ' +
        'associés au développement de nouvelles solutions sont extrêmement élevés et poussent les gens à utiliser des technologies ' +
        'non mâtures, très polluantes et de plus en plus dangereuses.\n' +
        '\n' +
        'De nombreux secteurs d\'activités sont concernés par l\'utilisation de batteries et font face aux problèmes :\n' +
        '\n' +
        'de durée de vie : remplacement régulier des batteries\n' +
        'd’autonomie : rechargement régulier des systèmes \n' +
        'de surdimensionnement (encombrement et poids) \n' +
        'de dégradation prématurée des batteries en utilisation et lors du stockage \n' +
        'de manque de connaissances de l\'état des batteries : changement de batterie en bonne santé, rechargement de celles-ci quand ' +
        'ce n\'est pas nécessaire, durée de vie inconnue',
      solution: 'Notre solution consiste à mettre dans les dispositifs de production et de consommation de l\'énergie, notre système ' +
        'intelligent de gestion de charge et décharge des batteries pilotant une configuration spécifique de celles-ci. \n' +
        '\n' +
        'Grâce à son IA, le système anticipe et optimise les consommations mais aussi les productions (solaire, thermiques) pour ' +
        'augmenter de plus de 30 % le taux de récupération de l’énergie, de 50 % l’autonomie et multiplier par 3 la durée de vie des batteries.\n' +
        '\n' +
        'Le système permet aussi la visualisation de l\'état de santé de la batterie sur les interfaces existantes des dispositifs ' +
        'et le temps efficace d\'utilisation pour une meilleure gestion des sources d\'énergie.  \n' +
        '\n' +
        'Notre écosystème de gestion intelligent de l’énergie s\'adapte sur tout type d\'applications aussi bien civiles que ' +
        'militaires (ex : Automobile, voiture hybride/électrique, énergies renouvelables, radio, téléphone, bâtiment, groupes ' +
        'électrogènes, objets connectés, ...) et pour toutes les technologies de batterie (lithium, plomb, ...)'
    }
  }
}

export const OptimizingValueHelp: PitchDescriptionHelp = {
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
    quiz: 'https://quiz.umi.us/quiz/5c9e33c6e0ce7d001cde8a98/5c92425a01ea6d73469107ce?lang=en',
    example: {
      title: 'Tiny rechargeable SMD micro-batteries for emergency backup power',
      summary: 'Very compact solid-state and rechargeable microbattery in SMD outline compatible with reflow soldering and pick & place. ' +
        'These microbatteries at 2,5V are able to store high energy densities for RTC or microcontroller backup for a few months in ' +
        'temperatures from -40°C to +85°C. They also deliver high peak currents (up to a few hundred milliamps) for DRAM and SSD ' +
        'backup and can also be used to power-up any RF transmission (Bluetooth, Zigbee, LORA, Sigfox, Nb-IoT, Wifi...).\n' +
        '\n',
      issue: 'Backup power supplies are used to keep some key electronic functions running in case of failure or shut down of ' +
        'the main power. Their main requirements depend on the application:\n' +
        '\n' +
        '- to backup RTC or microcontrollers (µC), the key is to store enough energy to cover the quiescent current of the RTC or ' +
        'the deep-sleep current of the µC. In some industrial applications like Programmable Logic Controllers (PLC), it is required ' +
        'to keep the RTC active several weeks after the main power shutdown, between -40° and 85°C.\n' +
        '\n' +
        '- to backup volatile memories in PLC and enterprise SSD, high power is required to keep the content of cache/buffer memories ' +
        'or complete their data transfer to non-volatile memories.\n' +
        '\n' +
        'Today, the backup functions are:\n' +
        '\n' +
        '- either primary coin cells that do not deliver peak currents, are bulky, do not operate beyond 60°C, and are assembled ' +
        'manually\n' +
        '\n' +
        '- or supercapacitors that are expensive, bulky, self-discharge quickly and have aging problems',
      solution: 'The proposed solution is based on solid-state micro-batteries featuring  footprints of less than 8mm² and volumes ' +
        'of less than 12mm3 (much smaller than supercapacitors)). They are delivered in SMD outlines and are compatible with automated ' +
        'PCB assembly lines (pick & place, reflow soldering). The broadest operating temperature range is up to -40°C 85°C. These are ' +
        'long lifespan batteries (10-20 years) and feature self-discharge rate of less than 5%/month compatible with long backup times ' +
        'of industrial PLC.\n' +
        '\n' +
        'These micro-batteries are not only able to store high energy densities but also to deliver high peak currents (a few 100 ' +
        'milliampers) and the power of 0,1W to 0,5W over 150 to 400ms typically required to transfer a cache/buffer content into a ' +
        'non volatile memory.\n' +
        '\n' +
        'This solution combines the best of battery and supercapacitor performance:a single component is enough to backup ' +
        'simultaneously RTC and µC and DRAM/SRAM and enterprise/client SSDs as well.'
    }
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
    quiz: 'https://quiz.umi.us/quiz/5c9e33c6e0ce7d001cde8a98/5c92425a01ea6d73469107ce?lang=fr',
    example: {
      title: 'Micro-piles CMS rechargeables pour alimentation de secours',
      summary: 'Microbatterie à semi-conducteurs, très compacte et rechargeable dans le schéma CMS, compatible avec la soudure' +
        ' par refusion et le pick & place. Ces microbatteries à 2,5V sont capables de stocker pendant plusieurs mois des densités' +
        ' d\'énergie élevées pour la sauvegarde RTC ou un microcontrôleur, à des températures comprises entre -40°C et + 85°C. ' +
        'Elles délivrent également des courants de pointes élevés (jusqu\'à quelques centaines de milliampères) pour les ' +
        'sauvegardes DRAM et SSD et peuvent également être utilisées pour mettre sous tension toute transmission RF (Bluetooth, ' +
        'Zigbee, LORA, Sigfox, Nb-IoT, Wifi...).',
      issue: 'Les alimentations de secours sont utilisées pour assurer le fonctionnement de certaines fonctions électroniques ' +
        'clés en cas de panne ou d\'arrêt de l\'alimentation principale. Leurs principales exigences dépendent de l\'application :\n' +
        '\n' +
        '- pour sauvegarder le RTC ou les microcontrôleurs (µC), l’importance est de stocker suffisamment d\'énergie pour couvrir ' +
        'le courant de veille du RTC ou le courant de sommeil profond du µC. Dans certaines applications industrielles, comme les ' +
        'automates programmables (PLC), il est nécessaire de maintenir le RTC actif plusieurs semaines après l\'arrêt de l\'alimentation ' +
        'principale, entre -40° et 85°C.\n' +
        '\n' +
        '- pour sauvegarder les mémoires volatiles dans les automates et les disques SSD d\'entreprise, une puissance élevée est ' +
        'nécessaire pour conserver le contenu des mémoires cache/tampons ou pour terminer leur transfert de données vers des ' +
        'mémoires non volatiles.\n' +
        '\n' +
        'Aujourd\'hui, les fonctions de sauvegarde sont :\n' +
        '\n' +
        '- soit des piles primaires ne fournissant pas de courants de crête, encombrantes, ne fonctionnant pas au-delà de 60 ° C ' +
        'et qui sont assemblées manuellement\n' +
        '\n' +
        '- ou des supercondensateurs coûteux, encombrants, se déchargeant rapidement et présentant des problèmes de vieillissement',
      solution: 'La solution proposée est basée sur des microbatteries à l\'état solide dont l\'empreinte est inférieure à 8 mm² et ' +
        'le volume inférieur à 12 mm3 (beaucoup plus petit que les supercondensateurs). Elles sont livrées en format CMS et sont ' +
        'compatibles avec les lignes d\'assemblage automatisées de circuits imprimés (pick & place, brasage par refusion). La plage ' +
        'de température de fonctionnement la plus large s\'étend de -40°C à 85°C. Ce sont des batteries à longue durée de vie ' +
        '(10-20 ans) et ont un taux d\'autodécharge de moins de 5%/mois, compatibles avec les longs temps de sauvegarde des automates ' +
        'industriels.\n' +
        '\n' +
        'Ces micro-batteries sont non seulement capables de stocker des densités d\'énergie élevées, mais fournissent également ' +
        'des courants de crête élevés (quelques centaines de milliampères) et une puissance de 0,1 W à 0,5 W sur 150 à 400 ms ' +
        'généralement nécessaire pour transférer un contenu cache / tampon dans une mémoire non volatile.\n' +
        '\n' +
        'Cette solution combine la meilleur des performances de batterie et de supercondensateur: un seul composant suffit à ' +
        'sauvegarder simultanément les formats RTC, µC et DRAM / SRAM, ainsi que les disques SSD d\'entreprise / client.'
    }
  }
}

export const OtherHelp: PitchDescriptionHelp = {
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
    quiz: 'https://quiz.umi.us/quiz/5de8c24e80ea600015b478f7/5dc11054b4fc806a74800bcc?lang=en',
    example: {
      title: 'On-site hydrogen production unit',
      summary: 'Competitive solution for on-site hydrogen production from natural gas that is more competitive and sustainable ' +
        'than the existing hydrogen supply (cylinders, bundles, tank trailers or liquid hydrogen), which require specific ' +
        'transportation means, compliant with existing regulations.',
      issue: 'Today, hydrogen production is centralized near large industrial areas. The supply arrives by truck, either ' +
        'compressed or liquid gas tanker.\n' +
        '\n' +
        'Dependence on centralized production presents three difficulties:\n' +
        '\n' +
        '1) The transportation cost has a significant impact on the overall hydrogen cost when the place of consumption is ' +
        'far from the production centers. (it could represent up to 40% of the total H2 cost, depending on the geographical area).\n' +
        '\n' +
        '2) The environmental impact of heavy truck transport generates a significant or even critical carbon footprint for ' +
        'certain applications (e. g. hydrogen energy). \n' +
        '\n' +
        '3) Supply chain management can be affected by regulations related to local transporation and hazardous materials. ' +
        'The supply chain can also be affected by the variability of customer consumption. Finally, for customers with high ' +
        'hydrogen consumption, the traditional supply by transportation does not make sense.  \n' +
        '\n' +
        'A few alternative solutions are emerging but none of them are competitive yet. ',
      solution: 'We have developed a solution for on-site hydrogen production from natural gas. The hydrogen quality is at ' +
        'least equivalent to that produced from industrial sources (e.g. SMR)  (purity >99%).\n' +
        '\n' +
        'This on-site hydrogen solution offers the following advantages:\n' +
        '\n' +
        '1) Reduce costs\n' +
        '\n' +
        'On-site production with our unit is more cost-effective (15% lower than existing on-site solutions on average) than ' +
        'a supply which is centrally produced then transported.\n' +
        '\n' +
        '2) Reduce the environmental impact:\n' +
        '\n' +
        'Depending on the geography and natural gas supply, heavy truck transport could be partially or totally eliminated, ' +
        'resulting in a significantly reduced carbon footprint. In addition, this new on-site hydrogen solution reduces CO2 ' +
        'emissions by 20% compared to existing solutions. \n' +
        '\n' +
        '3) Mastering the supply chain:\n' +
        '\n' +
        'Limit risks related to transportation: delays and non-delivery\n' +
        'Reduced delivery times for more flexible consumption\n' +
        'Optimize storage\n' +
        'The on-site H2 plant is available in 3 sizes: 50 m3/h, 100 m3/h, and 150 m3/h. The space requirement is limited to 20 ft. ' +
        'container modules for the 50m3/h model and 40 ft. for the 100 m3/h and 150 m3/h models.  '
    }
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
    quiz: 'https://quiz.umi.us/quiz/5de8c24e80ea600015b478f7/5dc11054b4fc806a74800bcc?lang=fr',
    example: {
      title: 'Module de production d\'hydrogène sur site',
      summary: 'Solution pour la production d\'hydrogène sur site à partir de gaz naturel plus compétitive et durable ' +
        'que l\'approvisionnement en hydrogène existant (bouteilles, cylindres, remorques citernes ou hydrogène liquide), ' +
        'qui nécessite des moyens de transport spécifiques, soumis à des réglementations fortes.',
      issue: 'Aujourd’hui la production d’hydrogène est centralisée proches des grands bassins industriels. ' +
        'L’approvisionnement est réalisé par camion réservoir de gaz comprimé ou liquide.\n' +
        '\n' +
        'Cette dépendance de la production centralisée implique 3 difficultés :\n' +
        '\n' +
        '1) Le coût d\'approvisionnement impacte fortement le coût global de l\'hydrogène dès lors que le lieu de consommation ' +
        'est éloigné des centres de production. Cela peut représenter jusqu\'à 40% du coût total de l\'hydrogène livré selon la géographie. \n' +
        '\n' +
        '2) L’impact environnemental des poids lourds engendre un bilan carbone important voire critique pour certaines ' +
        'applications (Hydrogène énergie par exemple).\n' +
        '\n' +
        '3) La maitrise de la supply chain peut être impactée par les normes  de transports locales ou de produits dangereux. ' +
        'Elle peut aussi être impactée par la variabilité de consommation. Enfin à partir d\'un niveau de consommation ' +
        'd\'hydrogène important l\'approvisionnement par transport devient une abération.\n' +
        '\n' +
        'Certaines solutions de production d’hydrogène décentralisées voient le jour mais aucune n’est compétitive.',
      solution: 'Nous avons développé une solution de production d’hydrogène sur site à partir de gaz naturel. ' +
        'L\'hydrogène généré est de qualité équivalente à une production centralisée (pureté >99%). \n' +
        '\n' +
        'Cette production d\'hydrogène sur site offre les avantages suivants :\n' +
        '\n' +
        '1) Réduire les coûts\n' +
        '\n' +
        'La production sur site avec notre module est plus rentable (environ 15% inférieur par rapport aux solutions on-site existantes) ' +
        'que production centralisée et de son approvisionnement en transport.\n' +
        '\n' +
        '2) Réduire l\'impact environnemental :\n' +
        '\n' +
        'En fonction de la géographie et de l\'approvisionnement en gaz naturel, le transport par poids lourds est partiellement ' +
        'ou totalement supprimé, d\'où un bilan carbone fortement réduit.\n' +
        '\n' +
        'Cette nouvelle solution de génération sur site émet 20% de moins de C02 par rapport aux solutions on-sites existantes.\n' +
        '\n' +
        '3) Maitriser la supply chain :\n' +
        '\n' +
        'Limiter les risques liés au transport : retards et défauts de livraison\n' +
        'Réduire les délais de livraison pour une consommation plus flexible\n' +
        'Optimiser le stockage\n' +
        'L\'unité de production sur site est disponible suivant 3 capacités : 50 m3h / 100 m3h / 150 m3h.\n' +
        '\n' +
        'L’encombrement est limité dans des modules conteneurs de 20 ft pour le modèle 50m3h et 40 ft pour les modèles 100 m3h et 150 m3h.'
    }
  }
}
