import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-market-test-objectives-secondary',
  templateUrl: './market-test-objectives-secondary.component.html',
  styleUrls: ['./market-test-objectives-secondary.component.scss']
})
export class MarketTestObjectivesSecondaryComponent {

  @Input() objectivesList: Array<any> = [
    {
      en: { label: 'Classifying issues', description: 'I list potential problems (technical, usage, ...) ' +
          'that professionals will be able to classify according to their criticality.' },
      fr: { label: 'Classer des problématiques', description: 'Je liste des problématiques potentielles ' +
          '(techniques, d\'usages,...) que les professionnels pourront classer selon leur criticité.' }
    },
    {
      en: { label: 'Ranking strengths / features', description: 'I list functionalities and / or strong points that ' +
          'professionals will be able to classify according to their importance.' },
      fr: { label: 'Classer des points forts / fonctionnalités', description: 'Je liste des fonctionnalités ' +
          'et/ou points forts que les professionnels pourront classer selon leur importance.' }
    },
    {
      en: { label: 'Defining the business model', description: 'I would like to determine the most popular sales model.' },
      fr: { label: 'Définir le business model', description: 'Je souhaite déterminer le modèle de vente le plus plébiscité.' }
    },
    {
      en: { label: 'Testing the pricing', description: 'I present price ranges to assess acceptability.' },
      fr: { label: 'Tester le pricing', description: 'Je propose des fourchettes de prix pour évaluer l\'acceptabilité.' }
    },
    {
      en: { label: 'Knowing the competitive environment ', description: 'I wish to understand how professionals ' +
          'position my project in the competitive environment (actors / solutions).' },
      fr: { label: 'Connaître l\'environnement concurrentiel ', description: 'Je souhaite comprendre comment les ' +
          'professionnels positionnent mon projet dans l\'environnement concurrentiel (acteurs / solutions).' }
    },
    {
      en: { label: 'Sorting the segments', description: 'I would like to analyse the results by segment ' +
          '(profiles, sectors, geographical areas...).' },
      fr: { label: 'Classer les segments', description: 'Je souhaite analyser les résultats par segment ' +
          '(profils, secteurs, zones géographiques...).' }
    },
    {
      en: { label: 'Finding partners', description: 'I wish to find partners who demonstrate a first interest ' +
          'in my project (co-developers, beta testers, distributors, customers, ...).' },
      fr: { label: 'Trouver des partenaires', description: 'Je souhaite trouver des partenaires qui manifestent ' +
          'un premier intérêt pour mon projet (co-développeurs, bêta testeurs, distributeurs, clients,...).' }
    },
    {
      en: { label: 'Recontacting respondents', description: 'Beyond their feedback, I would like to continue ' +
          'the discussion with the respondents.' },
      fr: { label: 'Recontacter les répondants', description: 'Au delà de leur feedback, je souhaite continuer les ' +
          'échanges avec les répondants.' }
    },
    {
      en: { label: 'Questioning my collaborators', description: 'I would also like to share my project internally ' +
          'to get me colleagues opinion.' },
      fr: { label: 'Interroger mes collaborateurs', description: 'Je souhaite aussi diffuser mon projet en interne ' +
          'pour connaître l\'avis de mes collaborateurs.' }
    }
  ];

  @Input() set objectiveComment(value: string) {
    this._objectiveComment = value;
  }

  @Input() set objectivesSecondary(value: Array<any>) {
    this._objectivesSecondary = value;
  }

  @Output() objectivesSecondaryChange: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

  @Output() objectiveCommentChange: EventEmitter<string> = new EventEmitter<string>();

  private _objectiveComment = '';

  private _objectivesSecondary: Array<any> = [];

  constructor(private _translateService: TranslateService) { }

  public onChangeOption(event: Event, objective: any) {
    event.preventDefault();

    if (((event.target) as HTMLInputElement).checked) {
    } else {
    }
  }

  public isChecked(objective: any): boolean {
    return false;
  }

  public emitCommentChange() {
    this.objectiveCommentChange.emit(this._objectiveComment);
  }

  get objectivesSecondary(): Array<any> {
    return this._objectivesSecondary;
  }

  get objectiveComment(): string {
    return this._objectiveComment;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

}
