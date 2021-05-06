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

@Component({
  selector: 'app-question-conclusion',
  templateUrl: './question-conclusion.component.html',
  styleUrls: ['./question-conclusion.component.scss']
})

export class QuestionConclusionComponent implements OnInit {

  @Input() originAnswers: {[continent: string]: {count: any, countries: {[country: string]: {count: number}}}} = null;

  @Input() readonly = true;

  @Input() pieChart: PieChart = <PieChart>{};

  @Input() innovation: Innovation = <Innovation>{};

  @Input() question: Question = <Question>{};

  @Input() stats: { nbAnswers: number, percentage: number } = null;

  @Output() questionChanged = new EventEmitter<Question>();

  @Input() reportingLang = this._translateService.currentLang;

  private _isMainDomain = environment.domain === 'umi' || false;

  private _showEditor = false;

  private _editTitle = false;

  private _editSubtitle = false;

  private _picto: Picto = picto;

  public displayedQuestionLabel: string;

  constructor(private _translateService: TranslateService,
              private _dataService: DataService,
              private _innovationFrontService: InnovationFrontService) {}

  ngOnInit() {
    this._cleanQuestionHtml();
    if (!!this.innovation && !this.innovation.marketReport) {
      this.innovation.marketReport = {};
    }
  }

  private _cleanQuestionHtml() {
    this.displayedQuestionLabel = this.question.label[this.reportingLang].replace(htmlTagsRegex, '');
  }

  public keyupHandlerFunction(event: {content: string}) {
    this.innovation.marketReport[this.question.identifier] = { conclusion: event['content'] };
    this._innovationFrontService.setNotifyChanges({key: 'marketReport', state: true});
  }

  toggleEditor() {
    this.showEditor = !this.showEditor;
  }

  chartSectionColorChanged(event: {index: number, color: string}) {
    this.question.options[event.index].color = event.color;
    this.questionChanged.emit(this.question);
  }

  positiveAnswerLabelChanged(positivesAnswersLabel: Multiling) {
    this.question.positivesAnswersLabel = positivesAnswersLabel;
    this.questionChanged.emit(this.question);
  }

  positiveAnswerChange(event: {index: number, positive: boolean}) {
    this.question.options[event.index].positive = event.positive;
    this.questionChanged.emit(this.question);
  }

  subtitleChange(event: string) {
    this.question.subtitle[this.reportingLang] = event;
    this.questionChanged.emit(this.question);
  }

  get positivesAnswers(): boolean[] {
    return this.question.options.map(q => q.positive);
  }

  get tags(): Array<Tag> {
    return this._dataService.answersTagsLists[this.question._id];
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
