export const infographic = {
  title: 'Poly-X: new-to-the-world ultra-light polymer with the strength of a metal',

    worldMap: [
    {
      country: 'France',
      notation: 'FR',
      professionalsCount: 2
    },
    {
      country: 'Chine',
      notation: 'CN',
      professionalsCount: 1
    },
    {
      country: 'Etats-Unis',
      notation: 'US',
      professionalsCount: 1
    }
  ],

    questions: [
    '001',
    '666',
    '003',
    '12345',
    '0106',
    '1010'
  ],

    answers: [
    {
      proName: 'Person 1',
      follow: 'true',
      country: 'America',
      job: 'Webmarketer',
      entreprise: `Florida's websellers`,
      mail: 'p1@floridawebsellers.us',
      questions: [
        {
          id: '001',
          answer: 'America'
        },
        {
          id: '666',
          answer: 'I understand you are manufacturing in Europe, if your sourcing is also done in Europe then this is a strong point. /Key advantages: / Very Competitive Bio based prices/Reduce carbon footprint//High quality purification (above 98.5%)///'
        },
        {
          id: '003',
          answer: 'Bien'
        },
        {
          id: '0106',
          answer: '33'
        },
        {
          id: '1010',
          answer: 'true'
        }
      ]
    },
    {
      proName: 'Person 2',
      follow: 'true',
      country: 'France',
      job: 'Director',
      entreprise: 'MARKR',
      mail: 'p2@markr.com',
      questions: [
        {
          id: '001',
          answer: 'France'
        },
        {
          id: '666',
          answer: 'Full utilization of resources with shared purpose, revenue for nonprofits like us that will help with sustainability'
        },
        {
          id: '003',
          answer: 'Partiellement'
        },
        {
          id: '12345',
          answer: 'Commentaire Person 2'
        },
        {
          id: '0106',
          answer: '2'
        },
        {
          id: '1010',
          answer: 'true'
        }
      ]
    },
    {
      proName: 'Person 3',
      follow: 'false',
      country: 'China',
      job: 'Shoes Creator',
      entreprise: 'Chill Dren',
      mail: 'p3@chilldren.ch',
      questions: [
        {
          id: '001',
          answer: 'China'
        },
        {
          id: '666',
          answer: 'Promotes impact investing, puts them in the same locations as the big corporates'
        },
        {
          id: '12345',
          answer: 'Commentaire Person 3'
        },
        {
          id: '003',
          answer: 'Bien'
        },
        {
          id: '0106',
          answer: '1'
        },
        {
          id: '1010',
          answer: 'false'
        }
      ]
    },
    {
      proName: 'Person 4',
      follow: 'true',
      country: 'France',
      job: 'Comunity Manager',
      entreprise: 'MARKR',
      mail: 'p4@markr.com',
      questions: [
        {
          id: '001',
          answer: 'France'
        },
        {
          id: '666',
          answer: 'Affordable way for non profit to find adequate premises for their mission'
        },
        {
          id: '12345',
          answer: 'Commentaire Person 4'
        },
        {
          id: '003',
          answer: 'Très bien'
        },
        {
          id: '0106',
          answer: '6'
        },
        {
          id: '1010',
          answer: 'false'
        }
      ]
    }
  ]
};

export const questions = [
  {
    id: '001',
    question: 'Origine des réponses',
    statTitle: 'Les professionnels',
    answerPossibilities: [],
    answerType: 'worldmap',
    isOn: 'true'
  },
  {
    id: '12345',
    question: 'Voici la question 12345',
    statTitle: 'Une question chaînée',
    answerPossibilities: [],
    answerType: 'string',
    isOn: 'true'
  },
  {
    id: '666',
    question: 'Voici la question 666',
    statTitle: 'Une question complète',
    answerPossibilities: [],
    answerType: 'comment',
    isOn: 'true'
  },
  {
    id: '0106',
    question: 'Voici la question 0106',
    statTitle: 'Question chiffrée',
    answerPossibilities: [],
    answerType: 'number',
    isOn: 'true'
  },
  {
    id: '003',
    question: 'Voici la question QCM',
    statTitle: 'QCM',
    answerPossibilities: [
      'Très bien',
      'Bien',
      'Partiellement',
      'Non'
    ],
    answerType: 'qcm',
    isOn: 'true'
  },
  {
    id: '1010',
    question: 'Voici la question 1010',
    statTitle: 'Question booleenne',
    answerPossibilities: [
      'true',
      'false'
    ],
    answerType: 'qcm',
    isOn: 'true'
  }
];
