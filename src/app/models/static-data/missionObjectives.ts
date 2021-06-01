/**
 * not using it any more. still here for the old project.
 * on 1st June, 2021
 */

export interface Objective {
  en: { label: string , description: string };
  fr: { label: string , description: string };
  picto: string;
  icon: string;
}

export const ObjectivesPrincipal: Array<Objective> = [
  {
    en: { label: 'Detecting needs / trends', description: 'I would like to find out what are the market ' +
        'issues / expectations / trends on a specific topic.' },
    fr: { label: 'Détecter des besoins / tendances', description: 'Je souhaite découvrir quelles sont les ' +
        'problématiques / attentes / tendances du marché sur une thématique précise.' },
    picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-compass.svg',
    icon: 'fas fa-compass'
  },
  {
    en: { label: 'Validating market needs', description: 'I have identified a / or several need(s) and I ' +
        'wish to confirm its / their existence and criticality for the market.' },
    fr: { label: 'Valider les besoins marché', description: 'J\'ai identifié un / des besoin(s) dont je ' +
        'souhaite confirmer l\'existence et la criticité pour le marché.' },
    picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-world.svg',
    icon: 'fas fa-compass'

  },
  {
    en: { label: 'Sourcing innovative solutions / partners', description: 'I would like to find innovative ' +
        'solutions and / or partners to solve a problem.' },
    fr: { label: 'Sourcer des solutions innovantes / partenaires', description: 'Je souhaite trouver des solutions ' +
        'innovantes et/ou des partenaires pour résoudre une problématique.' },
    picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-book.svg',
    icon: 'fas fa-book-open'
  },
  {
    en: { label: 'Validating the interest of my solution', description: 'I want to make sure that my innovation ' +
        'is meeting market expectations and will be well received.' },
    fr: { label: 'Valider l\'intérêt de ma solution', description: 'Je souhaite valider que mon innovation répond ' +
        'bien aux attentes et sera adoptée par le marché.' },
    picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-bulb.svg',
    icon: 'fas fa-lightbulb'
  },
  {
    en: { label: 'Discovering new applications / markets', description: 'I would like to discover the ' +
        'applications / markets for which my solution could be of interest.' },
    fr: { label: 'Découvrir de nouvelles applications / marchés', description: 'Je souhaite découvrir les ' +
        'applications / marchés pour lesquels ma solution pourrait présenter un intérêt.' },
    picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-panels.svg',
    icon: 'fas fa-map-signs'
  },
  {
    en: { label: 'Targeting the most receptive application / market', description: 'I have already identified several ' +
        'applications / markets of interest and wish to determine the most receptive ones.' },
    fr: { label: 'Cibler l\'application / marché le plus réceptif', description: 'J\'ai déjà identifié plusieurs ' +
        'applications / marchés d\'intérêt et je souhaite déterminer le plus réceptif.' },
    picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-target.svg',
    icon: 'fas fa-crosshairs'
  },
  {
    en: { label: 'Optimizing my value proposition', description: 'I have already validated the interest of my solution ' +
        'for the market, I now wish to adjust and optimize my value proposition / offer / business model.' },
    fr: { label: 'Optimiser ma proposition de valeur', description: 'J\'ai déjà validé l\'intérêt de ma solution pour ' +
        'le marché, je souhaite maintenant ajuster et optimiser ma proposition de valeur / offre / business model.' },
    picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-cycle.svg',
    icon: 'fas fa-sync-alt'
  },
  {
    en: { label: 'Other', description: '' },
    fr: { label: 'Autre', description: '' },
    picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-pencil.svg',
    icon: 'fas fa-pencil-alt'
  }
];
