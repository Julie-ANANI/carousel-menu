import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Multiling } from '../../../../../models/multiling';
import { TranslateService } from '@ngx-translate/core';

/***
 * this module is to select the secondary objectives for the client project.
 * It already has the objectives in both languages. 'objectiveOptions' attribute, to make changes
 * in the current objectives list.
 *
 * Input:
 * 1. isEnabledOptions: makes disabled the selection of the different options checkbox.
 * 2. objectiveComment: the comment value you write in the provided box.
 * 3. objectives: pass the value in the form of [{ en: '', fr: '' }].
 * 4. isEnabledComment: makes this value false to disable comment section.
 *
 * Output:
 * 1. objectivesChange: emits the value in the form of [{ en: '', fr: '' }].
 * 2. objectiveCommentChange: emits the comment written in the provided box.
 *
 * Implementation:
 * <objectives-secondary
 *  [isEnabledOptions]=false
 *  [isisEnabledComment]=false
 *  [(objectiveComment)]=comment
 *  [(objectives)]=objectives>
 * </objectives-secondary>
 *
 * Example: while adding the new project. module: NewProjectModule
 */

interface Objective {
  en: { label: string , description: string },
  fr: { label: string , description: string },
}

@Component({
  selector: 'app-objectives-secondary',
  templateUrl: './objectives-secondary.component.html',
  styleUrls: ['./objectives-secondary.component.scss']
})

export class ObjectivesSecondaryComponent {

  @Input() isEnabledOptions = true;

  @Input() isEnabledComment = true;

  @Input() isTextWhite = false;

  @Input() set objectiveComment(value: string) {
    this._objectiveComment = value;
  }

  @Input() set objectives(value: Array<Multiling>) {
    this._objectives = value;
  }

  @Output() objectivesChange: EventEmitter<Array<Multiling>> = new EventEmitter<Array<Multiling>>();

  @Output() objectiveCommentChange: EventEmitter<string> = new EventEmitter<string>();

  private _objectives: Array<Multiling> = [];

  private _objectiveComment = '';

  private readonly _currentLang = this._translateService.currentLang;

  private _objectiveOptions: Array<Objective> = [
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

  constructor(private _translateService: TranslateService) { }

  public onChangeOption(event: Event, objective: Objective) {
    event.preventDefault();

    if (((event.target) as HTMLInputElement).checked) {
      this._objectives.push({ en: objective.en.label, fr: objective.fr.label });
    } else {
      this._objectives = this._objectives.filter((value) => value[this._currentLang] !== objective[this._currentLang]['label']);
    }

    if (this.isEnabledOptions) {
      this.objectivesChange.emit(this._objectives);
    }

  }

  public isChecked(objective: Objective): boolean {
    return this._objectives.some((value) => value[this._currentLang] === objective[this._currentLang]['label']);
  }

  public emitCommentChange() {
    this.objectiveCommentChange.emit(this._objectiveComment);
  }

  get objectives(): Array<Multiling> {
    return this._objectives;
  }

  get objectiveComment(): string {
    return this._objectiveComment;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get objectiveOptions(): Array<Objective> {
    return this._objectiveOptions;
  }

}
