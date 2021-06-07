interface PitchExample {
  title: string;
  summary: string;
  issue?: string;
  solution?: string;
  context?: string;
}

export interface PitchHelpFields {
  title: string;
  summary: string;
  issue?: string;
  solution?: string;
  context?: string;
  quiz: string;
  example: PitchExample;
}

export interface PitchDescriptionHelp {
  en: PitchHelpFields;
  fr: PitchHelpFields;
}

class ProjectPitch {

  private static _titleHelp(objective: string, lang: string = 'en'): string {
    switch (objective) {

      case 'Detecting needs / trends':
      case 'Sourcing innovative solutions / partners':
      case 'Validating the interest of my solution':
      case 'Discovering new applications / markets':
      case 'Targeting the most receptive application / market':
      case 'Optimizing my value proposition':
        if (lang === 'fr') {
          return 'Le titre est présent dans l’objet des emails que l’on envoie aux milliers de professionnels, ' +
            'il ne doit pas seulement être le nom de la solution mais également indiquer en quelques mots ce que fait la solution.';
        } else {
          return 'The title of the project is inserted in the subject of the emails sent to the thousands of professionals ' +
            'we reach out. It shouldn\'t be the name of the solution only, but also condense in a few words what your ' +
            'solution brings.';
        }

      case 'Validating market needs':
        if (lang === 'fr') {
          return 'Le titre est présent dans l’objet des emails que l’on envoie aux milliers de professionnels, il résume en ' +
            '3-4 mots la thématique du questionnaire.';
        } else {
          return 'The title of the project is inserted in the subject of the emails we send to the thousands of professionals ' +
            'we reach out to. ' +
            'It condenses the the subject-matter of the questionnaire in a few words.';
        }

      default:
        return '';

    }
  }

  private static _summaryHelp(objective: string, lang: string = 'en'): string {
    switch (objective) {

      case 'Detecting needs / trends':
      case 'Validating the interest of my solution':
      case 'Discovering new applications / markets':
      case 'Targeting the most receptive application / market':
      case 'Optimizing my value proposition':
        if (lang === 'fr') {
          return 'Le pitch doit prendre la forme de deux phrases maximum mettant en lumière la proposition de valeur ' +
            'forte et différenciante du projet. Il sera présent dans le corps de texte des emails que nous enverrons aux professionnels.';
        } else {
          return 'The pitch must take the form of two sentences (this is a maximum) enlighting the strong and differentiating ' +
            'value proposition of your project. It will be inserted in the body of the emails we\'ll send to the professionals.';
        }

      case 'Validating market needs':
      case 'Sourcing innovative solutions / partners':
        if (lang === 'fr') {
          return 'Le pitch doit prendre la forme de deux phrases mettant en lumière la problématique principale et l\'objectif du ' +
            'questionnaire. Il sera présent dans le corps de texte des emails que nous enverrons aux professionnels.';
        } else {
          return 'The pitch must take the form of two sentences (this is a maximum) enlighting the main issue and the purpose of the ' +
            'questionnaire. It will be inserted in the body of the emails we\'ll send to the professionals.';
        }

      default:
        return '';

    }
  }

  private static _issueHelp(objective: string, lang: string = 'en'): string {
    switch (objective) {

      case 'Detecting needs / trends':
        if (lang === 'fr') {
          return '<p>Cette partie permet de contextualiser et d\'introduire la thématique du questionnaire aux professionnels.</p>' +
            '<p class="text-medium">' +
            '1. Introduction <br> <span class="text-normal p-left-15"> Introduisez la thématique/ le contexte marché.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '2. Enjeux à venir <br> <span class="text-normal p-left-15"> Expliquez les enjeux à venir sur la thématique.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '3. Démarche <br> <span class="text-normal p-left-15"> Expliquez la démarche : dans quel but vous souhaitez collecter ' +
            'ces informations et à quoi elles vont servir.</span>' +
            '</p>';
        } else {
          return '<p>This part helps to contextualize and introduce the subject matter of the questionnaire to the professionals.</p>' +
            '<p class="text-medium">' +
            '1. Introduction <br> <span class="text-normal p-left-15"> Introduce the subject matter / the market context.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '2. Implications <br> <span class="text-normal p-left-15"> Explain what\'s at stake, the upcoming issues in your ' +
            'field.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '3. Approach <br> <span class="text-normal p-left-15"> Explain your approach : why you\'re collecting this data and' +
            ' what your purpose is.</span>' +
            '</p>';
        }

      case 'Validating market needs':
        if (lang === 'fr') {
          return '<p>Cette partie permet de contextualiser le questionnaire et d\'introduire les problématiques identifiées ' +
            'aux professionnels.</p>' +
            '<p class="text-medium">' +
            '1. Introduction <br> <span class="text-normal p-left-15"> Introduisez la thématique/ le contexte marché.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '2. Problématique générale <br> <span class="text-normal p-left-15"> Expliquez le principal point de douleur.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '3. Problématiques des solutions actuelles <br> <span class="text-normal p-left-15"> Listez les solutions actuelles et ' +
            'expliquez en quoi elles ne répondent pas bien à cette problématique.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '4. Démarche <br> <span class="text-normal p-left-15"> Expliquez la démarche : dans quel but vous souhaitez collecter ' +
            'ces informations et à quoi elles vont servir.</span>' +
            '</p>';
        } else {
          return '<p>This part helps to contextualize and introduce the identified issues to the professionals.</p>' +
            '<p class="text-medium">' +
            '1. Introduction <br> <span class="text-normal p-left-15"> Introduce the subject matter / the market context.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '2. Main issue <br> <span class="text-normal p-left-15"> Outline the major pain point.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '3. Current solutions\' issues <br> <span class="text-normal p-left-15"> List the current solutions and expose why ' +
            'they\'re not relevant.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '4. Approach <br> <span class="text-normal p-left-15"> Explain your approach : why you\'re collecting this data and' +
            ' what your purpose is.</span>' +
            '</p>';
        }

      case 'Sourcing innovative solutions / partners':
        if (lang === 'fr') {
          return '<p>Cette partie permet de contextualiser le questionnaire et d\'introduire les problématiques identifiées ' +
            'aux professionnels.</p>' +
            '<p class="text-medium">' +
            '1. Introduction <br> <span class="text-normal p-left-15"> Introduisez la thématique/le contexte ayant amené à la ' +
            'recherche de solutions innovantes.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '2. Problématiques à résoudre <br> <span class="text-normal p-left-15">Expliquez les problématiques à résoudre pour laquelle ' +
            'vous cherchez des solutions.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '3. Contraintes/caractéristiques recherchées <br> <span class="text-normal p-left-15">Expliquez les ' +
            'contraintes/caractéristiques ou usages des solutions/partenaires recherché(e)s.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '4. Solutions connues/exclues<br> <span class="text-normal p-left-15">Listez les solutions déjà connues ou exclues.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '5. Démarche <br> <span class="text-normal p-left-15">Expliquez la démarche : dans quel but vous souhaitez collecter ' +
            'ces informations.</span>' +
            '</p>';
        } else {
          return '<p>This part helps to contextualize and introduce the identified issues to the professionals.</p>' +
            '<p class="text-medium">' +
            '1. Introduction <br> <span class="text-normal p-left-15">Introduce the subject matter / the context waging to the sourcing ' +
            'of innovative solutions.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '2. The issues to solve <br> <span class="text-normal p-left-15">Expose the issues your facing, for which your ' +
            'looking for solutions.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '3. Strains / Specifications required <br> <span class="text-normal p-left-15">Explain the strains / specifications or ' +
            'use cases of the solutions / partners you\'re looking for.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '4. Approach <br> <span class="text-normal p-left-15">Explain your approach : what\'s your purpose in collecting this ' +
            'data.</span>' +
            '</p>';
        }

      case 'Validating the interest of my solution':
      case 'Discovering new applications / markets':
      case 'Targeting the most receptive application / market':
      case 'Optimizing my value proposition':
      case 'Other':
        if (lang === 'fr') {
          return '<p>Cette partie permet de contextualiser le questionnaire et d\'introduire les problématiques identifiées ' +
            'aux professionnels.</p>' +
            '<p class="text-medium">' +
            '1. Introduction <br> <span class="text-normal p-left-15">Introduisez le périmètre / la thématique et le contexte ' +
            'marché.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '2. Problématique générale <br> <span class="text-normal p-left-15">Expliquez le principal point de douleur.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '3. Problématiques des solutions actuelles <br> <span class="text-normal p-left-15">Listez les solutions actuelles et ' +
            'expliquez en quoi elles ne répondent pas bien à cette problématique.</span>' +
            '</p>';
        } else {
          return '<p>This part helps to contextualize the questionnaire and to introduce the identified issues to the professionals.</p>' +
            '<p class="text-medium">' +
            '1. Introduction<br> <span class="text-normal p-left-15">Introduce the scope / subject matter and the market context.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '2. Main issue <br> <span class="text-normal p-left-15">Outline the major pain point.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '3. Current solutions\' issues<br> <span class="text-normal p-left-15">List the current solutions and expose why ' +
            'they\'re not relevant.</span>' +
            '</p>';
        }

    }
  }

  private static _solutionHelp(objective: string, lang: string = 'en'): string {
    switch (objective) {

      case 'Validating the interest of my solution':
      case 'Discovering new applications / markets':
      case 'Targeting the most receptive application / market':
      case 'Optimizing my value proposition':
      case 'Other':
        if (lang === 'fr') {
          return '<p>Cette partie permet d\'expliquer votre solution en termes de fonctionnalités, de bénéfices d\'usage, ' +
            'de propriétés et de répondre aux problématiques identifées dans la partie "problématiques"</p>' +
            '<p class="text-medium">' +
            '1. Votre solution<br> <span class="text-normal p-left-15">Décrivez ce qu\'est la solution.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '2. Problématique principale solutionnée<br> <span class="text-normal p-left-15">Expliquez comment elle résoud ' +
            'la problématique principale.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '3. Différentiation<br> <span class="text-normal p-left-15">Expliquez en quoi elle se différencie des solutions actuelles.</span>' +
            '</p>';
        } else {
          return '<p>This section is meant to describe your solution in terms of features, benefits to the user, ' +
            'properties and to address ' +
            'the issues identified in the "Issues" part.</p>' +
            '<p class="text-medium">' +
            '1. Solution<br> <span class="text-normal p-left-15">Describe the solution.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '2. Main solved issue<br> <span class="text-normal p-left-15">Explain how your solution solves the main issue.</span>' +
            '</p>' +
            '<p class="text-medium">' +
            '3. Differentiation<br> <span class="text-normal p-left-15">Explain in which way your it stands out from the current ' +
            'solutions.</span>' +
            '</p>';
        }

    }
  }

  private static _quiz(objective: string, lang: string = 'en'): string {
    switch (objective) {

      case 'Detecting needs / trends':
        return `https://quiz.umi.us/quiz/5e7a56bd80ea600015b4e3da/5e7a475633698d6dcf10ab6e?lang=${lang}`;

      case 'Validating market needs':
        return `https://quiz.umi.us/quiz/5efb41935a7c64002186695d/5efb4143c635012865583efd`;

      case 'Sourcing innovative solutions / partners':
        return 'https://quiz.umi.us/quiz/5e3292a580ea600015b49c04/5e1f6489733e215e4f5a5635';

      case 'Validating the interest of my solution':
        return `https://quiz.umi.us/quiz/5de8c24e80ea600015b478f7/5dc11054b4fc806a74800bcc?lang=${lang}`;

      case 'Discovering new applications / markets':
      case 'Targeting the most receptive application / market':
        return `https://quiz.umi.us/quiz/5eea141daf43c4001afcfa4e/5da49e135bc26796fba961a9?lang=${lang}`;

      case 'Optimizing my value proposition':
        return `https://quiz.umi.us/quiz/5c9e33c6e0ce7d001cde8a98/5c92425a01ea6d73469107ce?lang=${lang}`;

      case 'Other':
        return `https://quiz.umi.us/quiz/5de8c24e80ea600015b478f7/5dc11054b4fc806a74800bcc?lang=${lang}`;

    }
  }

  private static _example(objective: string, lang: string = 'en'): PitchExample {
    switch (objective) {

      case 'Other':
        if (lang === 'fr') {
          return {
            title: 'Module de production d\'hydrogène sur site',
            summary: 'Solution pour la production d\'hydrogène sur site à partir de gaz naturel plus compétitive et durable ' +
              'que l\'approvisionnement en hydrogène existant (bouteilles, cylindres, remorques citernes ou hydrogène liquide), ' +
              'qui nécessite des moyens de transport spécifiques, soumis à des réglementations fortes.',
            issue: 'Aujourd’hui la production d’hydrogène est centralisée proches des grands bassins industriels. ' +
              'L’approvisionnement est réalisé par camion réservoir de gaz comprimé ou liquide.<br>' +
              'Cette dépendance de la production centralisée implique 3 difficultés :<br>' +
              '1) Le coût d\'approvisionnement impacte fortement le coût global de l\'hydrogène dès lors que le lieu de consommation ' +
              'est éloigné des centres de production. Cela peut représenter jusqu\'à 40% du coût total de l\'hydrogène livré selon la ' +
              'géographie. <br>' +
              '2) L’impact environnemental des poids lourds engendre un bilan carbone important voire critique pour certaines ' +
              'applications (Hydrogène énergie par exemple).<br>' +
              '3) La maitrise de la supply chain peut être impactée par les normes  de transports locales ou de produits dangereux. ' +
              'Elle peut aussi être impactée par la variabilité de consommation. Enfin à partir d\'un niveau de consommation ' +
              'd\'hydrogène important l\'approvisionnement par transport devient une abération.<br>' +
              'Certaines solutions de production d’hydrogène décentralisées voient le jour mais aucune n’est compétitive.',
            solution: 'Nous avons développé une solution de production d’hydrogène sur site à partir de gaz naturel. ' +
              'L\'hydrogène généré est de qualité équivalente à une production centralisée (pureté >99%). <br>' +
              'Cette production d\'hydrogène sur site offre les avantages suivants :<br>' +
              '1) Réduire les coûts<br>' +
              'La production sur site avec notre module est plus rentable (environ 15% inférieur par rapport aux solutions on-site ' +
              'existantes) ' +
              'que production centralisée et de son approvisionnement en transport.<br>' +
              '2) Réduire l\'impact environnemental :<br>' +
              'En fonction de la géographie et de l\'approvisionnement en gaz naturel, le transport par poids lourds est partiellement ' +
              'ou totalement supprimé, d\'où un bilan carbone fortement réduit.<br>' +
              'Cette nouvelle solution de génération sur site émet 20% de moins de C02 par rapport aux solutions on-sites existantes.' +
              '<br>' +
              '3) Maitriser la supply chain :<br>' +
              'Limiter les risques liés au transport : retards et défauts de livraison<br>' +
              'Réduire les délais de livraison pour une consommation plus flexible<br>' +
              'Optimiser le stockage<br>' +
              'L\'unité de production sur site est disponible suivant 3 capacités : 50 m3h / 100 m3h / 150 m3h.<br>' +
              'L’encombrement est limité dans des modules conteneurs de 20 ft pour le modèle 50m3h et 40 ft pour les modèles 100 m3h ' +
              'et 150 m3h.'
          };
        } else {
          return {
            title: 'On-site hydrogen production unit',
            summary: 'Competitive solution for on-site hydrogen production from natural gas that is more competitive and sustainable ' +
              'than the existing hydrogen supply (cylinders, bundles, tank trailers or liquid hydrogen), which require specific ' +
              'transportation means, compliant with existing regulations.',
            issue: 'Today, hydrogen production is centralized near large industrial areas. The supply arrives by truck, either ' +
              'compressed or liquid gas tanker.<br>' +
              'Dependence on centralized production presents three difficulties:<br>' +
              '1) The transportation cost has a significant impact on the overall hydrogen cost when the place of consumption is ' +
              'far from the production centers. (it could represent up to 40% of the total H2 cost, depending on the geographical area)' +
              '.<br>' +
              '2) The environmental impact of heavy truck transport generates a significant or even critical carbon footprint for ' +
              'certain applications (e. g. hydrogen energy). <br>' +
              '3) Supply chain management can be affected by regulations related to local transporation and hazardous materials. ' +
              'The supply chain can also be affected by the variability of customer consumption. Finally, for customers with high ' +
              'hydrogen consumption, the traditional supply by transportation does not make sense.  <br>' +
              'A few alternative solutions are emerging but none of them are competitive yet. ',
            solution: 'We have developed a solution for on-site hydrogen production from natural gas. The hydrogen quality is at ' +
              'least equivalent to that produced from industrial sources (e.g. SMR)  (purity >99%).<br>' +
              'This on-site hydrogen solution offers the following advantages:<br>' +
              '1) Reduce costs<br>' +
              'On-site production with our unit is more cost-effective (15% lower than existing on-site solutions on average) than ' +
              'a supply which is centrally produced then transported.<br>' +
              '2) Reduce the environmental impact:<br>' +
              'Depending on the geography and natural gas supply, heavy truck transport could be partially or totally eliminated, ' +
              'resulting in a significantly reduced carbon footprint. In addition, this new on-site hydrogen solution reduces CO2 ' +
              'emissions by 20% compared to existing solutions. <br>' +
              '3) Mastering the supply chain:<br>' +
              'Limit risks related to transportation: delays and non-delivery<br>' +
              'Reduced delivery times for more flexible consumption<br>' +
              'Optimize storage<br>' +
              'The on-site H2 plant is available in 3 sizes: 50 m3/h, 100 m3/h, and 150 m3/h. The space requirement is limited to 20 ' +
              'ft. ' +
              'container modules for the 50m3/h model and 40 ft. for the 100 m3/h and 150 m3/h models.  '
          };
        }

      case 'Optimizing my value proposition':
        if (lang === 'fr') {
          return {
            title: 'Micro-piles CMS rechargeables pour alimentation de secours',
            summary: 'Microbatterie à semi-conducteurs, très compacte et rechargeable dans le schéma CMS, compatible avec la soudure' +
              ' par refusion et le pick & place. Ces microbatteries à 2,5V sont capables de stocker pendant plusieurs mois des densités' +
              ' d\'énergie élevées pour la sauvegarde RTC ou un microcontrôleur, à des températures comprises entre -40°C et + 85°C. ' +
              'Elles délivrent également des courants de pointes élevés (jusqu\'à quelques centaines de milliampères) pour les ' +
              'sauvegardes DRAM et SSD et peuvent également être utilisées pour mettre sous tension toute transmission RF (Bluetooth, ' +
              'Zigbee, LORA, Sigfox, Nb-IoT, Wifi...).',
            issue: 'Les alimentations de secours sont utilisées pour assurer le fonctionnement de certaines fonctions électroniques ' +
              'clés en cas de panne ou d\'arrêt de l\'alimentation principale. Leurs principales exigences dépendent de l\'application ' +
              ':<br>' +
              '- pour sauvegarder le RTC ou les microcontrôleurs (µC), l’importance est de stocker suffisamment d\'énergie pour ' +
              'couvrir ' +
              'le courant de veille du RTC ou le courant de sommeil profond du µC. Dans certaines applications industrielles, ' +
              'comme les ' +
              'automates programmables (PLC), il est nécessaire de maintenir le RTC actif plusieurs semaines après l\'arrêt de ' +
              'l\'alimentation ' +
              'principale, entre -40° et 85°C.<br>' +
              '- pour sauvegarder les mémoires volatiles dans les automates et les disques SSD d\'entreprise, une puissance élevée est ' +
              'nécessaire pour conserver le contenu des mémoires cache/tampons ou pour terminer leur transfert de données vers des ' +
              'mémoires non volatiles.<br>' +
              'Aujourd\'hui, les fonctions de sauvegarde sont :<br>' +
              '- soit des piles primaires ne fournissant pas de courants de crête, encombrantes, ne fonctionnant pas au-delà de 60 ° C ' +
              'et qui sont assemblées manuellement<br>' +
              '- ou des supercondensateurs coûteux, encombrants, se déchargeant rapidement et présentant des problèmes de vieillissement',
            solution: 'La solution proposée est basée sur des microbatteries à l\'état solide dont l\'empreinte est inférieure ' +
              'à 8 mm² et ' +
              'le volume inférieur à 12 mm3 (beaucoup plus petit que les supercondensateurs). Elles sont livrées en format CMS et ' +
              'sont ' +
              'compatibles avec les lignes d\'assemblage automatisées de circuits imprimés (pick & place, brasage par refusion). ' +
              'La plage ' +
              'de température de fonctionnement la plus large s\'étend de -40°C à 85°C. Ce sont des batteries à longue durée de vie ' +
              '(10-20 ans) et ont un taux d\'autodécharge de moins de 5%/mois, compatibles avec les longs temps de sauvegarde des ' +
              'automates ' +
              'industriels.<br>' +
              'Ces micro-batteries sont non seulement capables de stocker des densités d\'énergie élevées, mais fournissent également ' +
              'des courants de crête élevés (quelques centaines de milliampères) et une puissance de 0,1 W à 0,5 W sur 150 à 400 ms ' +
              'généralement nécessaire pour transférer un contenu cache / tampon dans une mémoire non volatile.<br>' +
              'Cette solution combine la meilleur des performances de batterie et de supercondensateur: un seul composant suffit à ' +
              'sauvegarder simultanément les formats RTC, µC et DRAM / SRAM, ainsi que les disques SSD d\'entreprise / client.'
          };
        } else {
          return {
            title: 'Tiny rechargeable SMD micro-batteries for emergency backup power',
            summary: 'Very compact solid-state and rechargeable microbattery in SMD outline compatible with reflow soldering and pick ' +
              '& place. ' +
              'These microbatteries at 2,5V are able to store high energy densities for RTC or microcontroller backup for a few months ' +
              'in ' +
              'temperatures from -40°C to +85°C. They also deliver high peak currents (up to a few hundred milliamps) for DRAM and SSD ' +
              'backup and can also be used to power-up any RF transmission (Bluetooth, Zigbee, LORA, Sigfox, Nb-IoT, Wifi...).',
            issue: 'Backup power supplies are used to keep some key electronic functions running in case of failure or shut down of ' +
              'the main power. Their main requirements depend on the application:<br>' +
              '- to backup RTC or microcontrollers (µC), the key is to store enough energy to cover the quiescent current of the RTC ' +
              'or ' +
              'the deep-sleep current of the µC. In some industrial applications like Programmable Logic Controllers (PLC), it is ' +
              'required ' +
              'to keep the RTC active several weeks after the main power shutdown, between -40° and 85°C.<br>' +
              '- to backup volatile memories in PLC and enterprise SSD, high power is required to keep the content of cache/buffer ' +
              'memories ' +
              'or complete their data transfer to non-volatile memories.<br>' +
              'Today, the backup functions are:<br>' +
              '- either primary coin cells that do not deliver peak currents, are bulky, do not operate beyond 60°C, and are assembled ' +
              'manually<br>' +
              '- or supercapacitors that are expensive, bulky, self-discharge quickly and have aging problems',
            solution: 'The proposed solution is based on solid-state micro-batteries featuring  footprints of less than 8mm² and ' +
              'volumes ' +
              'of less than 12mm3 (much smaller than supercapacitors)). They are delivered in SMD outlines and are compatible with ' +
              'automated ' +
              'PCB assembly lines (pick & place, reflow soldering). The broadest operating temperature range is up to -40°C 85°C. ' +
              'These are ' +
              'long lifespan batteries (10-20 years) and feature self-discharge rate of less than 5%/month compatible with long backup ' +
              'times ' +
              'of industrial PLC.<br>' +
              'These micro-batteries are not only able to store high energy densities but also to deliver high peak currents ' +
              '(a few 100 ' +
              'milliampers) and the power of 0,1W to 0,5W over 150 to 400ms typically required to transfer a cache/buffer content ' +
              'into a ' +
              'non volatile memory.<br>' +
              'This solution combines the best of battery and supercapacitor performance:a single component is enough to backup ' +
              'simultaneously RTC and µC and DRAM/SRAM and enterprise/client SSDs as well.'
          };
        }

      case 'Discovering new applications / markets':
      case 'Targeting the most receptive application / market':
        if (lang === 'fr') {
          return {
            title: 'Ecosystème de gestion de l\'énergie',
            summary: 'Une technologie de gestion intelligente de l\'énergie qui s\'interface facilement dans les dispositifs ' +
              'de production ' +
              'et de consommation d\'énergie actuels pour améliorer leur disponibilité (autonomie, durée de vie) et donc réduire ' +
              'la pollution' +
              ' engendrée (bruit, émissions de CO2).',
            issue: 'Aujourd\'hui, la gestion et l\'optimisation de l\'énergie est un enjeu majeur de nos sociétés. Toutefois, ' +
              'les coûts ' +
              'associés au développement de nouvelles solutions sont extrêmement élevés et poussent les gens à utiliser des ' +
              'technologies ' +
              'non mâtures, très polluantes et de plus en plus dangereuses.<br>' +
              'De nombreux secteurs d\'activités sont concernés par l\'utilisation de batteries et font face aux problèmes :<br>' +
              'de durée de vie : remplacement régulier des batteries<br>' +
              'd’autonomie : rechargement régulier des systèmes <br>' +
              'de surdimensionnement (encombrement et poids) <br>' +
              'de dégradation prématurée des batteries en utilisation et lors du stockage <br>' +
              'de manque de connaissances de l\'état des batteries : changement de batterie en bonne santé, rechargement de ' +
              'celles-ci quand ' +
              'ce n\'est pas nécessaire, durée de vie inconnue',
            solution: 'Notre solution consiste à mettre dans les dispositifs de production et de consommation de l\'énergie, ' +
              'notre système ' +
              'intelligent de gestion de charge et décharge des batteries pilotant une configuration spécifique de celles-ci. <br>' +
              'Grâce à son IA, le système anticipe et optimise les consommations mais aussi les productions (solaire, thermiques) pour ' +
              'augmenter de plus de 30 % le taux de récupération de l’énergie, de 50 % l’autonomie et multiplier par 3 la durée ' +
              'de vie des ' +
              'batteries.<br>' +
              'Le système permet aussi la visualisation de l\'état de santé de la batterie sur les interfaces existantes des ' +
              'dispositifs ' +
              'et le temps efficace d\'utilisation pour une meilleure gestion des sources d\'énergie.  <br>' +
              'Notre écosystème de gestion intelligent de l’énergie s\'adapte sur tout type d\'applications aussi bien civiles que ' +
              'militaires (ex : Automobile, voiture hybride/électrique, énergies renouvelables, radio, téléphone, bâtiment, groupes ' +
              'électrogènes, objets connectés, ...) et pour toutes les technologies de batterie (lithium, plomb, ...)'
          };
        } else {
          return {
            title: 'Smart Power Ecosystem',
            summary: 'A smart Energy Management System that easily interfaces with existing energy production and consumption ' +
              'devices to ' +
              'improve their availability (autonomy, lifetime) and thus reduce pollution (noise, CO2 emissions)',
            issue: 'Nowadays power management and optimization is a major challenge for our societies. However, new solutions ' +
              'development ' +
              'costs are more and more high and encourage people to use new and fully unproved technologies which are  increasingly ' +
              'dangerous ' +
              'and highly polluting. <br>' +
              'Many sectors of activity are concerned by the use of batteries and are facing the following problems:<br>' +
              'Lifetime: regular replacement of batteries<br>' +
              'Autonomy: regular recharging of systems<br>' +
              'Oversizing (size and weight)  <br>' +
              'Batteries premature degradation in operational using and during storage<br>' +
              'Lack of batteries feedback: healthy battery change, recharging when not necessary, unknown life span,...',
            solution: 'Our solution consists in putting our intelligent battery charge and discharge management system in energy ' +
              'production ' +
              'and consumption devices, which controls a specific configuration of the batteries.<br>' +
              'Combined to AI, Smart Power Ecosystem anticipates and optimizes consumption and production (solar, heat engines) ' +
              'to increase ' +
              'more than 30% of power recovery rate, 50% of operational running time and 3 times  battery life.<br>' +
              'The system also allows the visualization of the battery\'s health status on existing device interfaces and efficient ' +
              'time ' +
              'of use for better management of energy sources.<br>' +
              'Our Smart Power Ecosystem can be used for both civil and military applications (e. g. automotive, hybrid/electric ' +
              'cars, ' +
              'renewable energies, radio, Mobile, timers, power units, IoT, etc.) and for all battery technologies (lithium, lead, etc.)'
          };
        }

      case 'Detecting needs / trends':
        if (lang === 'fr') {
          return {
            title: '5G deployment impact for MNO',
            summary: 'As a world leader of digital transformation solution, we would like to better understand how the deployment of ' +
              '5G will impact telecom companies and their various activities in the coming years.',
            issue: 'For several years now, companies around the world have been preparing themselves for the deployment of 5G by ' +
              'trying to ' +
              'anticipate tomorrow\'s uses and impacts (autonomous car, home automation, RV, etc.).<br>' +
              '<br>' +
              'For telecom companies, 5G technology is already transforming organizations, the value chain, offers, as well as ' +
              'the available ' +
              'services. Thus, new expectations and needs are emerging on all sides in order to overcome this new technological ' +
              'challenge, ' +
              'which is essential to maintain the highest level of competitiveness.<br>' +
              '<br>' +
              'Through this questionnaire, we would like to better understand the stakes in order to anticipate future needs ' +
              'and issues: ' +
              'those of our customers, our own, those of our partners, but also those of other business sectors.'
          };
        } else {
          return {
            title: '5G deployment impact for MNO',
            summary: 'As a world leader of digital transformation solution, we would like to better understand how the deployment of ' +
              '5G will impact telecom companies and their various activities in the coming years.',
            issue: 'For several years now, companies around the world have been preparing themselves for the deployment of 5G by ' +
              'trying to ' +
              'anticipate tomorrow\'s uses and impacts (autonomous car, home automation, RV, etc.).<br>' +
              '<br>' +
              'For telecom companies, 5G technology is already transforming organizations, the value chain, offers, as well as ' +
              'the available ' +
              'services. Thus, new expectations and needs are emerging on all sides in order to overcome this new technological ' +
              'challenge, ' +
              'which is essential to maintain the highest level of competitiveness.<br>' +
              '<br>' +
              'Through this questionnaire, we would like to better understand the stakes in order to anticipate future needs ' +
              'and issues: ' +
              'those of our customers, our own, those of our partners, but also those of other business sectors.'
          };
        }

      case 'Validating market needs':
        return {
          title: 'New molecules for drug production',
          summary: 'We have designed a robust and efficient process to provide cubane derivatives at kilogram scale ' +
            'for cubane-based drug production under cGMP. We would like to better understand the reason behind their ' +
            'disuse in the pharmaceutical industry thus far, if they could be of interest at an industrial scale and ' +
            'if not, why.',
          issue: 'Cubanes are molecules in the shape of a cube. They have been discovered in the 1960s, and have become ' +
            'a popular template in drug design and medicinal chemistry in the 2000s. <br>' +
            'Currently, they are quite expensive, and there are no suppliers capable of larger scale availability ' +
            '(several kg). <br>' +
            'This would make the initial development of a cubane-based drug rather tedious, with the obligation to ' +
            'synthesize this moiety or have it made by a third-party contract research organization. Hence, their ' +
            'availability is not immediate and/or of a lower quality compared to an experienced supplier. <br>' +
            'If this initial step was successful, the supply of kilogram quantities of cubane derivatives, ' +
            'in cGMP conditions, is not possible.'
        };

      case 'Sourcing innovative solutions / partners':
        return {
          title: 'Plant pathogens early detection toolkit',
          summary: 'This current project aims to identify the most promising techniques of detecting plant pathogens ' +
            'at their latent phase ' +
            'at field scale from a very few hectares up to an array of 200 Ha. Early detection and quantification of ' +
            'available pathogens ' +
            'should improve the application timing resulting in significant cost savings, while reducing pressure on the environment.',
          issue: 'Plants pathogenic fungi are difficult to monitor in open environment due to the high diversity of ' +
            'the microorganisms as ' +
            'well as host crops, the enormous complexity and extreme volatility of their environment.<br>' +
            'Currently, the timing of use for highly potent fungicides can be sub-optimal leading to higher costs as ' +
            'well as unnecessary ' +
            'exposure to the environment of applications associated with a risk of resistance selection.<br>' +
            'As well, current plant-pathogen scounting practice does not support a good understanding of plant-pathogen ' +
            'interactions ' +
            'epidemiology. For example, since interactions happen, latent infections cannot be detected by field scouting ' +
            'for visible ' +
            'symptoms, thus crop managers often intervene too late and pathogens having a rapid disease development.<br>' +
            'Finally, currently, insufficient justification due to lack of evidences at the beginning of infestation leads ' +
            'to a low public ' +
            'acceptance of crop caring systems.<br>' +
            'We hope to identify the most promising techniques of detecting plant pathogens at their latent phase in order to solve ' +
            'these issues. It would be kind to have your help.'
        };

      case 'Validating the interest of my solution':
        if (lang === 'fr') {
          return {
            title: 'Module de production d\'hydrogène sur site',
            summary: 'Solution pour la production d\'hydrogène sur site à partir de gaz naturel plus compétitive et durable que ' +
              'l\'approvisionnement en hydrogène existant (bouteilles, cylindres, remorques citernes ou hydrogène liquide), qui ' +
              'nécessite des moyens de transport spécifiques, soumis à des réglementations fortes.',
            issue: 'Aujourd’hui la production d’hydrogène est centralisée proches des grands bassins industriels. L’approvisionnement ' +
              'est réalisé par camion réservoir de gaz comprimé ou liquide.<br>' +
              'Cette dépendance de la production centralisée implique 3 difficultés :<br>' +
              '1) Le coût d\'approvisionnement impacte fortement le coût global de l\'hydrogène dès lors que le lieu de consommation ' +
              'est éloigné des centres de production. Cela peut représenter jusqu\'à 40% du coût total de l\'hydrogène livré selon la ' +
              'géographie. <br>' +
              '2) L’impact environnemental des poids lourds engendre un bilan carbone important voire critique pour certaines ' +
              'applications ' +
              '(Hydrogène énergie par exemple).<br>' +
              '3) La maitrise de la supply chain peut être impactée par les normes  de transports locales ou de produits dangereux. ' +
              'Elle peut aussi être impactée par la variabilité de consommation. Enfin à partir d\'un niveau de consommation ' +
              'd\'hydrogène ' +
              'important l\'approvisionnement par transport devient une abération.<br>' +
              'Certaines solutions de production d’hydrogène décentralisées voient le jour mais aucune n’est compétitive.',
            solution: 'Nous avons développé une solution de production d’hydrogène sur site à partir de gaz naturel. L\'hydrogène ' +
              'généré est de ' +
              'qualité équivalente à une production centralisée (pureté >99%). <br>' +
              'Cette production d\'hydrogène sur site offre les avantages suivants :<br>' +
              '1) Réduire les coûts<br>' +
              'La production sur site avec notre module est plus rentable (environ 15% inférieur par rapport aux solutions ' +
              'on-site existantes) ' +
              'que production centralisée et de son approvisionnement en transport.<br>' +
              '2) Réduire l\'impact environnemental :<br>' +
              'En fonction de la géographie et de l\'approvisionnement en gaz naturel, le transport par poids lourds est ' +
              'partiellement ou ' +
              'totalement supprimé, d\'où un bilan carbone fortement réduit.<br>' +
              'Cette nouvelle solution de génération sur site émet 20% de moins de C02 par rapport aux solutions on-sites ' +
              'existantes.<br>' +
              '3) Maitriser la supply chain :<br>' +
              'Limiter les risques liés au transport : retards et défauts de livraison<br>' +
              'Réduire les délais de livraison pour une consommation plus flexible<br>' +
              'Optimiser le stockage<br>' +
              'L\'unité de production sur site est disponible suivant 3 capacités : 50 m3h / 100 m3h / 150 m3h.<br>' +
              'L’encombrement est limité dans des modules conteneurs de 20 ft pour le modèle 50m3h et 40 ft pour les modèles ' +
              '100 m3h et 150 m3h.'
          };
        } else {
          return {
            title: 'On-site hydrogen production unit',
            summary: 'Competitive solution for on-site hydrogen production from natural gas that is more competitive and ' +
              'sustainable than ' +
              'the existing hydrogen supply (cylinders, bundles, tank trailers or liquid hydrogen), which require specific ' +
              'transportation means, ' +
              'compliant with existing regulations.',
            issue: 'Today, hydrogen production is centralized near large industrial areas. The supply arrives by truck, ' +
              'either compressed or ' +
              'liquid gas tanker.<br>' +
              'Dependence on centralized production presents three difficulties:<br>' +
              '1) The transportation cost has a significant impact on the overall hydrogen cost when the place of consumption ' +
              'is far from the ' +
              'production centers. (it could represent up to 40% of the total H2 cost, depending on the geographical area).<br>' +
              '2) The environmental impact of heavy truck transport generates a significant or even critical carbon footprint ' +
              'for certain ' +
              'applications (e. g. hydrogen energy). <br>' +
              '3) Supply chain management can be affected by regulations related to local transporation and hazardous materials. ' +
              'The supply ' +
              'chain can also be affected by the variability of customer consumption. Finally, for customers with high hydrogen ' +
              'consumption, ' +
              'the traditional supply by transportation does not make sense.  <br>' +
              'A few alternative solutions are emerging but none of them are competitive yet. ',
            solution: 'We have developed a solution for on-site hydrogen production from natural gas. The hydrogen quality is at ' +
              'least equivalent to that produced from industrial sources (e.g. SMR)  (purity >99%).<br>' +
              'This on-site hydrogen solution offers the following advantages:<br>' +
              '1) Reduce costs<br>' +
              'On-site production with our unit is more cost-effective (15% lower than existing on-site solutions on average) ' +
              'than a supply ' +
              'which is centrally produced then transported.<br>' +
              '2) Reduce the environmental impact:<br>' +
              'Depending on the geography and natural gas supply, heavy truck transport could be partially or totally eliminated, ' +
              'resulting ' +
              'in a significantly reduced carbon footprint. In addition, this new on-site hydrogen solution reduces CO2 emissions' +
              ' by 20% ' +
              'compared to existing solutions. <br>' +
              '3) Mastering the supply chain:<br>' +
              'Limit risks related to transportation: delays and non-delivery<br>' +
              'Reduced delivery times for more flexible consumption<br>' +
              'Optimize storage<br>' +
              'The on-site H2 plant is available in 3 sizes: 50 m3/h, 100 m3/h, and 150 m3/h. The space requirement is limited ' +
              'to 20 ft. ' +
              'container modules for the 50m3/h model and 40 ft. for the 100 m3/h and 150 m3/h models.  '
          };
        }

    }
  }

  /**
   *
   * @param objective
   * @param template - true means using the new mission template so change in the object.
   */
  public object(objective: string, template: boolean = false): PitchDescriptionHelp {
    let _obj: PitchDescriptionHelp = <PitchDescriptionHelp>{};

    if (objective) {
      if (template) {
        switch (objective) {

          case 'Detecting needs / trends':
            _obj = {
              en: {
                title: ProjectPitch._titleHelp(objective),
                summary: ProjectPitch._summaryHelp(objective),
                quiz: ProjectPitch._quiz(objective),
                example: ProjectPitch._example(objective),
                context: ProjectPitch._issueHelp(objective)
              },
              fr: {
                title: ProjectPitch._titleHelp(objective, 'fr'),
                summary: ProjectPitch._summaryHelp(objective, 'fr'),
                quiz: ProjectPitch._quiz(objective, 'fr'),
                example: ProjectPitch._example(objective, 'fr'),
                context: ProjectPitch._issueHelp(objective, 'fr')
              }
            };
            break;

          case 'Discovering new applications / markets':
            _obj = {
              en: {
                title: ProjectPitch._titleHelp(objective),
                summary: ProjectPitch._summaryHelp(objective),
                quiz: ProjectPitch._quiz(objective),
                example: ProjectPitch._example(objective),
                solution: ProjectPitch._solutionHelp(objective)
              },
              fr: {
                title: ProjectPitch._titleHelp(objective, 'fr'),
                summary: ProjectPitch._summaryHelp(objective, 'fr'),
                quiz: ProjectPitch._quiz(objective, 'fr'),
                example: ProjectPitch._example(objective, 'fr'),
                solution: ProjectPitch._solutionHelp(objective, 'fr')
              }
            };
            break;

        }
      } else {
        switch (objective) {

          case 'Validating the interest of my solution':
          case 'Discovering new applications / markets':
          case 'Targeting the most receptive application / market':
          case 'Optimizing my value proposition':
          case 'Other':
            _obj = {
              en: {
                title: ProjectPitch._titleHelp(objective),
                summary: ProjectPitch._summaryHelp(objective),
                issue: ProjectPitch._issueHelp(objective),
                solution: ProjectPitch._solutionHelp(objective),
                quiz: ProjectPitch._quiz(objective),
                example: ProjectPitch._example(objective)
              },
              fr: {
                title: ProjectPitch._titleHelp(objective, 'fr'),
                summary: ProjectPitch._summaryHelp(objective, 'fr'),
                issue: ProjectPitch._issueHelp(objective, 'fr'),
                solution: ProjectPitch._solutionHelp(objective, 'fr'),
                quiz: ProjectPitch._quiz(objective, 'fr'),
                example: ProjectPitch._example(objective, 'fr')
              }
            };
            break;

          case 'Detecting needs / trends':
          case 'Validating market needs':
          case 'Sourcing innovative solutions / partners':
            _obj = {
              en: {
                title: ProjectPitch._titleHelp(objective),
                summary: ProjectPitch._summaryHelp(objective),
                issue: ProjectPitch._issueHelp(objective),
                quiz: ProjectPitch._quiz(objective),
                example: ProjectPitch._example(objective)
              },
              fr: {
                title: ProjectPitch._titleHelp(objective, 'fr'),
                summary: ProjectPitch._summaryHelp(objective, 'fr'),
                issue: ProjectPitch._issueHelp(objective, 'fr'),
                quiz: ProjectPitch._quiz(objective, 'fr'),
                example: ProjectPitch._example(objective, 'fr')
              }
            };
            break;

        }
      }
    }

    return _obj;
  }

}

/**
 * as we have the definition for certain objective.
 * based on the new mission templates
 * on 7th June, 2021
 */
export const Template_Pitches = {
  'Detecting market needs': new ProjectPitch().object('Detecting needs / trends', true),
  'Validating market needs': new ProjectPitch().object('Validating market needs'),
  'Sourcing solutions / suppliers': new ProjectPitch().object('Sourcing innovative solutions / partners'),
  'Identifying receptive markets': new ProjectPitch().object('Discovering new applications / markets', true),
  'Validating the interest in my project': new ProjectPitch().object('Validating the interest of my solution'),
  'Optimizing my value proposition': new ProjectPitch().object('Optimizing my value proposition'),
};

/**
 * using for the old mission objective.
 */
export const Pitches = {
  'Detecting needs / trends': new ProjectPitch().object('Detecting needs / trends'),
  'Validating market needs': new ProjectPitch().object('Validating market needs'),
  'Sourcing innovative solutions / partners': new ProjectPitch().object('Sourcing innovative solutions / partners'),
  'Validating the interest of my solution': new ProjectPitch().object('Validating the interest of my solution'),
  'Discovering new applications / markets': new ProjectPitch().object('Discovering new applications / markets'),
  'Targeting the most receptive application / market': new ProjectPitch().object('Targeting the most receptive application / market'),
  'Optimizing my value proposition': new ProjectPitch().object('Optimizing my value proposition'),
  'Other': new ProjectPitch().object('Other')
};
