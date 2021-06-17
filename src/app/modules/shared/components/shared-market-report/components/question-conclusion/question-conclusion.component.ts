import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DataService} from '../../services/data.service';
import {Innovation} from '../../../../../../models/innovation';
import {Question} from '../../../../../../models/question';
import {Tag} from '../../../../../../models/tag';
import {environment} from '../../../../../../../environments/environment';
import {PieChart} from '../../../../../../models/pie-chart';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';
import {Multiling} from '../../../../../../models/multiling';
import {Picto, picto} from '../../../../../../models/static-data/picto';
import {htmlTagsRegex} from '../../../../../../utils/regex';
import {Mission, MissionQuestion, MissionTemplate} from '../../../../../../models/mission';
import {MissionFrontService} from '../../../../../../services/mission/mission-front.service';
import {MissionQuestionService} from '../../../../../../services/mission/mission-question.service';

@Component({
  selector: 'app-question-conclusion',
  templateUrl: './question-conclusion.component.html',
  styleUrls: ['./question-conclusion.component.scss']
})

export class QuestionConclusionComponent implements OnInit {

  get innovation(): Innovation {
    return this._innovation;
  }

  get hasMissionTemplate(): boolean {
    return MissionFrontService.hasMissionTemplate(this.innovation && <Mission>this.innovation.mission);
  }

  get question(): Question | MissionQuestion {
    return this._question;
  }

  @Input() originAnswers: {[continent: string]: {count: any, countries: {[country: string]: {count: number, names: any}}}} = null;

  @Input() readonly = true;

  @Input() pieChart: PieChart = <PieChart>{};

  @Input() set innovation(value: Innovation) {
    this._innovation = value;
    if (this.hasMissionTemplate) {
      this._missionQuestionService.template = (<Mission>this._innovation.mission).template || <MissionTemplate>{};
    }
  }

  @Input() set question(value: Question | MissionQuestion) {
    this._question = value;
  }

  @Input() stats: { nbAnswers: number, percentage: number } = null;

  @Output() questionChanged = new EventEmitter<Question>();

  @Input() reportingLang = this._translateService.currentLang;

  private _isMainDomain = environment.domain === 'umi' || false;

  private _showEditor = false;

  private _editTitle = false;

  private _editSubtitle = false;

  private _picto: Picto = picto;

  private _innovation: Innovation = <Innovation>{};

  private _question: Question | MissionQuestion = <MissionQuestion | Question>{};

  constructor(private _translateService: TranslateService,
              private _missionQuestionService: MissionQuestionService,
              private _dataService: DataService,
              private _innovationFrontService: InnovationFrontService) {}

  ngOnInit() {
    if (!!this._innovation && !this._innovation.marketReport) {
      this._innovation.marketReport = {};
    }
  }

  public questionSubtitle(): string {
    return MissionQuestionService.label(this._question, 'subtitle', this.reportingLang) || '';
  }

  public questionTitle(): string {
    return MissionQuestionService.label(this._question, 'title', this.reportingLang) || '';
  }

  public questionLabel(): string {
    return MissionQuestionService.label(this._question, 'label', this.reportingLang) || '';
  }

  public displayedQuestionLabel(): string {
    return this.questionLabel().replace(htmlTagsRegex, '') || '';
  }

  public keyupHandlerFunction(event: {content: string}) {
    this._innovation.marketReport[this._question.identifier] = { conclusion: event['content'] };
    this._innovationFrontService.setNotifyChanges({key: 'marketReport', state: true});
  }

  public onChangeTitle(value: string) {
    if (this.hasMissionTemplate) {
      this._missionQuestionService.changeQuestionEntry(value, this.reportingLang, <MissionQuestion>this._question, 'title');
    } else if (this._question && !!(<Question>this._question).title) {
      (<Question>this._question).title[this.reportingLang] = value;
      this._emit();
    }
  }

  public positiveAnswerLabels() {
    if (this.hasMissionTemplate) {
      return (<MissionQuestion>this._question).entry.reduce((acc, val) => {
        acc[val.lang] = val.positivesAnswersLabel || '';
        return acc;
      }, {});
    } else if (this._question && (<Question>this._question).positivesAnswersLabel) {
      return (<Question>this._question).positivesAnswersLabel || {en: '', fr: ''};
    } else {
      return {en: '', fr: ''};
    }
  }

  private _emit() {
    this.questionChanged.emit(<Question>this._question);
  }

  toggleEditor() {
    this.showEditor = !this.showEditor;
  }

  chartSectionColorChanged(event: {index: number, color: string}) {
    if (this.hasMissionTemplate) {
      this._missionQuestionService.changeQuestionOption(event.color, <MissionQuestion>this._question, event.index, 'color');
    } else {
      this._question.options[event.index].color = event.color;
      this._emit();
    }
  }

  positiveAnswerLabelChanged(positivesAnswersLabel: Multiling) {
    if (this.hasMissionTemplate) {
      console.log(positivesAnswersLabel);
      (<MissionQuestion>this._question).entry.forEach((_entry) => {
        this._missionQuestionService.changeQuestionEntry(
          positivesAnswersLabel[_entry.lang], _entry.lang, <MissionQuestion>this._question, 'positivesAnswersLabel'
        );
      });
    } else if (this._question && !!(<Question>this._question)) {
      (<Question>this._question).positivesAnswersLabel = positivesAnswersLabel;
      this._emit();
    }
  }

  positiveAnswerChange(event: {index: number, positive: boolean}) {
    if (this.hasMissionTemplate) {
      this._missionQuestionService.changeQuestionOption(event.positive, <MissionQuestion>this._question, event.index, 'positive');
    } else {
      this._question.options[event.index].positive = event.positive;
      this._emit();
    }
  }

  subtitleChange(event: string) {
    if (this.hasMissionTemplate) {
      this._missionQuestionService.changeQuestionEntry(event, this.reportingLang, <MissionQuestion>this._question, 'subtitle');
    } else if (this._question && !!(<Question>this._question).subtitle) {
      (<Question>this._question).subtitle[this.reportingLang] = event;
      this._emit();
    }
  }

  get positivesAnswers(): boolean[] {
    return (<any>this._question).options.map((q: any) => q.positive);
  }

  get tags(): Array<Tag> {
    return this._dataService.answersTagsLists[this._question._id];
  }

  get isMainDomain(): boolean {
    return this._isMainDomain;
  }

  get showEditor(): boolean {
    return this._showEditor;
  }

  set showEditor(value: boolean) {
    this._showEditor = value;
  }

  get editSubtitle(): boolean {
    return this._editSubtitle;
  }

  set editSubtitle(value: boolean) {
    this._editSubtitle = value;
  }

  get editTitle(): boolean {
    return this._editTitle;
  }

  set editTitle(value: boolean) {
    this._editTitle = value;
  }

  get picto(): Picto {
    return this._picto;
  }

}
