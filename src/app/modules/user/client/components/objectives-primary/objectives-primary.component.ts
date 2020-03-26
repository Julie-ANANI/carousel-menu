import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Multiling } from '../../../../../models/multiling';

interface Objective {
  en: { label: string , description: string },
  fr: { label: string , description: string },
  picto: string
}

@Component({
  selector: 'objectives-primary',
  templateUrl: './objectives-primary.component.html',
  styleUrls: ['./objectives-primary.component.scss']
})

export class ObjectivesPrimaryComponent {

  @Input() set objective(value: Multiling) {
    this._objective = value;
  };

  @Output() objectiveChange: EventEmitter<Multiling> = new EventEmitter<Multiling>();

  private readonly _currentLang = this._translateService.currentLang;

  private _objective: Multiling = {
    en: '', fr: ''
  };

  private _objectives: Array<Objective> = [
    {
      en: { label: 'Detecting needs / trends', description: 'I would like to find out what are the market ' +
          'issues / expectations / trends on a specific topic.' },
      fr: { label: 'Détecter des besoins / tendances', description: 'Je souhaite découvrir quelles sont les ' +
          'problématiques / attentes / tendances du marché sur une thématique précise.' },
      picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-compass.svg'
    },
    {
      en: { label: 'Validating market needs', description: 'I have identified a/or several need(s) and I ' +
          'wish to confirm its/their existence and criticality for the market.' },
      fr: { label: 'Valider les besoins marché', description: 'J\'ai identifié un/des besoin(s) dont je ' +
          'souhaite confirmer l\'existence et la criticité pour le marché.' },
      picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-world.svg'
    },
    {
      en: { label: 'Sourcing innovative solutions / partners', description: 'I would like to find innovative ' +
          'solutions and/or partners to solve a problem.' },
      fr: { label: 'Sourcer des solutions innovantes / partenaires', description: 'Je souhaite trouver des solutions ' +
          'innovantes et/ou des partenaires pour résoudre une problématique.' },
      picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-book.svg'
    },
    {
      en: { label: 'Validating the interest of my solution', description: 'I want to make sure that my innovation ' +
          'is meeting market expectations and will be well received.' },
      fr: { label: 'Valider l\'intérêt de ma solution', description: 'Je souhaite valider que mon innovation répond ' +
          'bien aux attentes et sera adoptée par le marché.' },
      picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-bulb.svg'
    },
    {
      en: { label: 'Discovering new applications / markets', description: 'I would like to discover the ' +
          'applications / markets for which my solution could be of interest.' },
      fr: { label: 'Découvrir de nouvelles applications / marchés', description: 'Je souhaite découvrir les ' +
          'applications / marchés pour lesquels ma solution pourrait présenter un intérêt.' },
      picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-panels.svg'
    },
    {
      en: { label: 'Targeting the most receptive application / market', description: 'I have already identified several ' +
          'applications / markets of interest and wish to determine the most receptive ones.' },
      fr: { label: 'Cibler l\'application / marché le plus réceptif', description: 'J\'ai déjà identifié plusieurs ' +
          'applications / marchés d\'intérêt et je souhaite déterminer le plus réceptif.' },
      picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-target.svg'
    },
    {
      en: { label: 'Optimizing my value proposition', description: 'I have already validated the interest of my solution ' +
          'for the market, I now wish to adjust and optimize my value proposition / offer / business model.' },
      fr: { label: 'Optimiser ma proposition de valeur', description: 'J\'ai déjà validé l\'intérêt de ma solution pour ' +
          'le marché, je souhaite maintenant ajuster et optimiser ma proposition de valeur / offre / business model' },
      picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-cycle.svg'
    },
    {
      en: { label: 'Other', description: '' },
      fr: { label: 'Autre', description: '' },
      picto: 'https://res.cloudinary.com/umi/image/upload/app/default-images/pictos/picto-pencil.svg'
    }
    ];

  constructor(private _translateService: TranslateService) { }

  public onClickObjective(event: Event, objective: Objective) {
    event.preventDefault();
    this._objective = { en: objective.en.label, fr: objective.fr.label };
    this.objectiveChange.emit(this._objective);
  }

  public isActive(objective: Objective): boolean {
    return this._objective[this._currentLang] === objective[this._currentLang]['label'];
  }

  get objective(): Multiling {
    return this._objective;
  }

  get objectives(): Array<Objective> {
    return this._objectives;
  }

  get currentLang(): string {
    return this._currentLang;
  }

}
