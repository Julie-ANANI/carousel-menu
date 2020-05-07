import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../../../../../../models/question';
import { Answer } from '../../../../../../models/answer';
import { ExecutiveSection } from '../../../../../../models/executive-report';
import { MultilingPipe } from '../../../../../../pipe/pipes/multiling.pipe';
import { ResponseService } from '../../../../../shared/components/shared-market-report/services/response.service';
import { Professional } from '../../../../../../models/professional';
import { BarData } from '../../../../../shared/components/shared-market-report/models/bar-data';
import { Tag } from '../../../../../../models/tag';
import { PieChart } from '../../../../../../models/pie-chart';
import { ExecutiveReportFrontService } from '../../../../../../services/executive-report/executive-report-front.service';

@Component({
  selector: 'executive-section',
  templateUrl: './executive-section.component.html',
  styleUrls: ['./executive-section.component.scss']
})

export class ExecutiveSectionComponent {

  @Input() questions: Array<Question> = [];

  @Input() answers: Array<Answer> = [];

  @Input() reportLang: 'en';

  @Input() set section(value: ExecutiveSection) {
    this._section = {
      questionId: value.questionId || '',
      questionType: value.questionType || '',
      abstract: value.abstract || '',
      title: value.title || '',
      content: value.content || <any>{}
    };
  }

  @Output() sectionChange: EventEmitter<ExecutiveSection> = new EventEmitter<ExecutiveSection>();

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _enableVisualBar = false;

  private _enableVisualRanking = false;

  private _enableVisualPie = false;

  constructor(private _multilingPipe: MultilingPipe,
              private _executiveReportFrontService: ExecutiveReportFrontService,
              private _responseService: ResponseService) { }

  public emitChanges() {
    this.sectionChange.emit(this._section);
  }

  private _resetVisuals() {
    this._enableVisualBar = false;
    this._enableVisualRanking = false;
    this._enableVisualPie = false;
  }

  /***
   * assign the question id to the section and based on the question
   * controlType active the different visualization.
   * @param id
   */
  public selectQuestion(id: string) {
    this._section.questionId = id;
    const question: Question = this._getQuestion(this._section.questionId);
    this._resetVisuals();

    if (question && question.controlType) {
      switch (question.controlType) {

        case 'radio':
          this._enableVisualPie = true;
          this._enableVisualBar = true;
          break;

        case 'checkbox':
          this._enableVisualBar = true;
          break;

        default:
          this._enableVisualRanking = true;
          break;
      }
    }

  }

  public selectQuestionType(type: any) {
    if (this._section.questionId) {
      switch (type) {

        case 'PIE':
          if (this._enableVisualPie) {
            this._section.questionType = type;
            this._initializeSection();
            this.emitChanges();
          }
          break;

        case 'RANKING':
          if (this._enableVisualRanking) {
            this._section.questionType = type;
            this._initializeSection();
            this.emitChanges();
          }
          break;

        case 'QUOTE':
        case 'KPI':
          this._section.questionType = type;
          this._initializeSection();
          this.emitChanges();
          break;

        case 'BAR':
          if (this._enableVisualBar) {
            this._section.questionType = type;
            this._initializeSection();
            this.emitChanges();
          }
          break;

      }
    }
  }

  public onSectionUpdate(value: ExecutiveSection) {
    this._section = value;
    this.emitChanges();
  }

  private _initializeSection() {
    switch (this._section.questionType) {

      case 'KPI':
        this._setKpiData();
        break;

      case 'QUOTE':
        this._setQuoteData();
        break;

      case 'BAR':
        this._setBarData();
        break;

      case 'RANKING':
        this._setRankingData();
        break;

      case 'PIE':
        this._setPieData();
        break;
    }
  }

  /***
   * available for all the question type
   * @private
   */
  private _setKpiData() {
    const question: Question = this._getQuestion(this._section.questionId);
    const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
    const professionals: Array<Professional> = ResponseService.answersProfessionals(answers);
    this._section.title = this._multilingPipe.transform(question.title, this.reportLang);
    this._section.content = ExecutiveReportFrontService.kpiSection(professionals, answers.length.toString(10));
  }

  /***
   * available for all the question type
   * @private
   */
  private _setQuoteData() {
    const question: Question = this._getQuestion(this._section.questionId);
    this._section.title = this._multilingPipe.transform(question.title, this.reportLang);
    this._section.content = ExecutiveReportFrontService.quoteSection();
  }

  /***
   * available for the question type === 'radio' || 'checkbox'.
   * @private
   */
  private _setBarData() {
    const question: Question = this._getQuestion(this._section.questionId);
    const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
    const barsData: Array<BarData> = ResponseService.barsData(question, answers);
    this._section.title = this._multilingPipe.transform(question.title, this.reportLang);
    this._section.content = this._executiveReportFrontService.barSection(barsData, this.reportLang);
  }

  /***
   * available for all the question type expect 'radio' and 'checkbox'.
   * @private
   */
  private _setRankingData() {
    const question: Question = this._getQuestion(this._section.questionId);
    const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
    const tagsData: Array<Tag> = ResponseService.tagsList(answers, question);
    this._section.title = this._multilingPipe.transform(question.title, this.reportLang);
    this._section.content = this._executiveReportFrontService.rankingSection(tagsData, this.reportLang);
  }

  /***
   * available for the question type === 'radio'.
   * @private
   */
  private _setPieData() {
    const question: Question = this._getQuestion(this._section.questionId);
    const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
    const barsData: Array<BarData> = ResponseService.barsData(question, answers);
    const pieChartData: PieChart = ResponseService.pieChartData(barsData, answers);
    this._section.title = this._multilingPipe.transform(question.title, this.reportLang);
    this._section.content = ExecutiveReportFrontService.pieChartSection(pieChartData, this.reportLang);
  }

  private _getQuestion(id: string): Question {
    const index = this.questions.findIndex((ques) => ques._id === id);
    if (index !== -1) {
      return this.questions[index];
    }
  }

  get section(): ExecutiveSection {
    return this._section;
  }

  get enableVisualBar(): boolean {
    return this._enableVisualBar;
  }

  get enableVisualRanking(): boolean {
    return this._enableVisualRanking;
  }

  get enableVisualPie(): boolean {
    return this._enableVisualPie;
  }

}


