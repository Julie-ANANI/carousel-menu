import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DataService} from '../../services/data.service';
import {Innovation} from '../../../../../../models/innovation';
import {Question} from '../../../../../../models/question';
import {Tag} from '../../../../../../models/tag';
import {environment} from '../../../../../../../environments/environment';
import {PieChart} from '../../../../../../models/pie-chart';
import {InnovationFrontService} from '../../../../../../services/innovation/innovation-front.service';

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

  private _currentLang = this._translateService.currentLang;

  private _isMainDomain = environment.domain === 'umi' || false;

  private _showEditor = false;

  private _editTitle = false;

  private _editSubtitle = false;

  private _currentChartIndexModified = -1;
  private _currentChartOffsetXModified = 0;
  private _currentChartOffsetYModified = 0;

  constructor(private _translateService: TranslateService,
              private _dataService: DataService,
              private _innovationFrontService: InnovationFrontService) {}

  ngOnInit() {
    if (!!this.innovation && !this.innovation.marketReport) {
      this.innovation.marketReport = {};
    }
  }

  public keyupHandlerFunction(event: {content: string}) {
    this.innovation.marketReport[this.question.identifier] = { conclusion: event['content'] };
    this._innovationFrontService.setNotifyChanges({key: 'marketReport', state: true});
  }

  toggleEditor() {
    this.showEditor = !this.showEditor;
  }

  chartSectionClicked(event: {index: number, position: any}) {
    this._currentChartIndexModified = event.index;
    this._currentChartOffsetXModified = event.position.x;
    this._currentChartOffsetYModified = event.position.y;
  }

  chartColorChanged(color: string) {
    this.question.options[this._currentChartIndexModified].color = color;
    this.questionChanged.emit(this.question);
    this._currentChartIndexModified = -1;
  }

  positiveAnswerChange() {
    this.questionChanged.emit(this.question);
    this._currentChartIndexModified = -1;
  }

  subtitleChange(event: string) {
    this.question.subtitle[this.currentLang] = event;
    this.questionChanged.emit(this.question);
  }

  get tags(): Array<Tag> {
    return this._dataService.answersTagsLists[this.question._id];
  }

  get currentLang(): string {
    return this._currentLang;
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

  set currentChartIndexModified(value: number) {
    this._currentChartIndexModified = value;
  }

  get currentChartIndexModified(): number {
    return this._currentChartIndexModified;
  }

  get currentChartOffsetYModified(): number {
    return this._currentChartOffsetYModified;
  }

  get currentChartOffsetXModified(): number {
    return this._currentChartOffsetXModified;
  }
}
