import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../../../../../../models/question';
import { Answer } from '../../../../../../models/answer';
import { ExecutiveSection } from '../../../../../../models/executive-report';
import { ResponseService } from '../../../../../shared/components/shared-market-report/services/response.service';
import { Professional } from '../../../../../../models/professional';
import { BarData } from '../../../../../shared/components/shared-market-report/models/bar-data';
import { PieChart } from '../../../../../../models/chart/pie-chart';
import { ExecutiveReportFrontService } from '../../../../../../services/executive-report/executive-report-front.service';
import {MissionQuestion} from '../../../../../../models/mission';
import {MissionQuestionService} from '../../../../../../services/mission/mission-question.service';

@Component({
  selector: 'app-admin-executive-section',
  templateUrl: './executive-section.component.html',
  styleUrls: ['./executive-section.component.scss']
})

export class ExecutiveSectionComponent {

  @Input() isEditable = false;
  @Input() questions: Array<Question | MissionQuestion> = [];
  @Input() answers: Array<Answer> = [];
  @Input() reportLang: 'en';
  @Input() sectionIndex = 0;

 /* get questions(): Array<Question | MissionQuestion> {
    return this._questions;
  }*/


  @Input() set section(value: ExecutiveSection) {
    //console.log(this.questions);
    this._section = {
      questionId: value.questionId || '',
      questionType: value.questionType,
      questionIdentifier: value.questionIdentifier || '',
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
  private _enableVisualLikertScale = false;
  //private _question: Question | MissionQuestion = <Question>{};
  //private _question: Question | MissionQuestion = <MissionQuestion | Question>{};


/*

  @Input() set question(value: Question | MissionQuestion) {
    this._question = value;
  }

  @Output() questionChanged = new EventEmitter<Question>();


*/


  private _resetVisuals() {
    this._enableVisualBar = false;
    this._enableVisualRanking = false;
    this._enableVisualPie = false;
    this._enableVisualLikertScale = false;
  }

  constructor(private _executiveReportFrontService: ExecutiveReportFrontService,
              private _responseService: ResponseService) { }


  public emitChanges() {
    if (this.isEditable) {
      this.sectionChange.emit(this._section);
    }
  }


  /***
   * assign the question id to the section and based on the question
   * controlType active the different visualization.
   * @param identifier
   */
  public selectQuestion(identifier: string) {
    this._section.questionIdentifier = identifier;
    const question: Question | MissionQuestion = this._getQuestion(this._section.questionIdentifier);
    this._resetVisuals();

    if (question && question.controlType) {
      switch (question.controlType) {

        case 'radio':
          this._enableVisualPie = true;
          this._enableVisualBar = true;
          break;

        case 'likert-scale':
          this._enableVisualLikertScale = true;
          break;

        case 'checkbox':
          this._enableVisualBar = true;
          break;

        default:
          this._enableVisualRanking = true;
          break;
      }
    } else if (identifier === `quesCustom_${this.sectionIndex}`) {
      this._enableVisualPie = true;
      this._enableVisualBar = true;
      this._enableVisualBar = true;
      this._enableVisualRanking = true;
      this._enableVisualLikertScale = true;
    }

  }

  /**
   * Return the questionType selected
   * @public
   * @param type : any
   * */
  public selectQuestionType(type: any) {
    if (this._section.questionIdentifier) {
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

        case 'LIKERT-SCALE':
          if (this._enableVisualLikertScale) {
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

      case 'LIKERT-SCALE':
        this._setLikertScaleData();
        break;
    }
  }

  /***
   * available for all the question type
   * @private
   */
  private _setKpiData() {
    if (this._section.questionIdentifier === `quesCustom_${this.sectionIndex}`) {
      this._section.title = 'Custom KPI ';
      this._section.content = ExecutiveReportFrontService.kpiSection([], '0');
    } else {
      const question: Question | MissionQuestion = this._getQuestion(this._section.questionIdentifier);
      const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
      const professionals: Array<Professional> = ResponseService.answersProfessionals(answers);
      this._section.title = MissionQuestionService.label(question, 'title', this.reportLang);
      this._section.content = ExecutiveReportFrontService.kpiSection(professionals, answers.length.toString(10));
    }
  }

  /***
   * available for all the question type
   * @private
   */
  private _setQuoteData() {
    if (this._section.questionIdentifier === `quesCustom_${this.sectionIndex}`) {
      this._section.title = 'Custom quotation';
      this._section.content = ExecutiveReportFrontService.quoteSection();
    } else {
      const question: Question | MissionQuestion = this._getQuestion(this._section.questionIdentifier);
      this._section.title = MissionQuestionService.label(question, 'title', this.reportLang);
      this._section.content = ExecutiveReportFrontService.quoteSection();
    }
  }

  /***
   * available for the question type === 'radio' || 'checkbox'.
   * @private
   */
  private _setBarData() {
    if (this._section.questionIdentifier === `quesCustom_${this.sectionIndex}`) {
      this._section.title = 'Custom progress bars';
      this._section.content = this._executiveReportFrontService.barSection([], this.reportLang);
    } else {
      const question: Question | MissionQuestion = this._getQuestion(this._section.questionIdentifier);
      const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
      const barsData: Array<BarData> = ResponseService.barsData(question, answers);
      this._section.title = MissionQuestionService.label(question, 'title', this.reportLang);
      this._section.content = this._executiveReportFrontService.barSection(barsData, this.reportLang);
    }
  }

  /***
   * available for all the question type expect 'radio' and 'checkbox'.
   * @private
   */
  private _setRankingData() {
    if (this._section.questionIdentifier === `quesCustom_${this.sectionIndex}`) {
      this._section.title = 'Custom ranking';
      this._section.content = this._executiveReportFrontService.rankingTagsSection([], this.reportLang);
    } else {
      const question: Question | MissionQuestion = this._getQuestion(this._section.questionIdentifier);
      const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
      this._section.title = MissionQuestionService.label(question, 'title', this.reportLang);
      let data;
      if (question.controlType === 'ranking') {
        data = ResponseService.rankingChartData(answers, question, this.reportLang);
        this._section.content = this._executiveReportFrontService.rankingSection(data, this.reportLang);
      } else {
        data = ResponseService.tagsList(answers, question);
        this._section.content = this._executiveReportFrontService.rankingTagsSection(data, this.reportLang);
      }
    }
  }

  /***
   * available for the question type === 'radio'.
   * @private
   */
  private _setPieData() {
    if (this._section.questionIdentifier === `quesCustom_${this.sectionIndex}`) {
      this._section.title = 'Custom pie';
      this._section.content = this._executiveReportFrontService.pieChartSection(null, this.reportLang);
    } else {
      const question: Question | MissionQuestion = this._getQuestion(this._section.questionIdentifier);
      const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
      const barsData: Array<BarData> = ResponseService.barsData(question, answers);
      const pieChartData: PieChart = ResponseService.pieChartData(barsData, answers);
      this._section.title = MissionQuestionService.label(question, 'title', this.reportLang);
      this._section.content = this._executiveReportFrontService.pieChartSection(pieChartData, this.reportLang);
    }
  }


  /***
   * @private
   */
  private _setLikertScaleData() {
    /* Section Custom */
    if (this._section.questionIdentifier === `quesCustom_${this.sectionIndex}`) {
      this._section.title = 'Custom likert scale';
      this._section.content = this._executiveReportFrontService.likertScaleTagsSection([], this.reportLang);

    } else {
      /* Section with specific question of quiz */
      const question: Question | MissionQuestion = this._getQuestion(this._section.questionIdentifier);
      const answers: Array<Answer> = this._responseService.answersToShow(this.answers, question);
      this._section.title = MissionQuestionService.label(question, 'title', this.reportLang);
      const data = ResponseService.likertScaleChartData(answers, question, this.reportLang);
      // graphics is service for calculate score and return name, color and percentage
      // This service is used when a questionnaire question is selected, it returns the current score value and its name and color
      const graphics = ResponseService.getLikertScaleGraphicScore(data.averageGeneralEvaluation)
      //console.log(graphics);
      this._section.content = this._executiveReportFrontService.likertScaleSection(data, this.reportLang, graphics);
    }
  }


  private _getQuestion(identifier: string): Question | MissionQuestion {
    const index = this.questions.findIndex((ques) => ques.identifier === identifier);
    if (index !== -1) {
      return this.questions[index];
    }
  }

  public onClickPlay(section: ExecutiveSection) {
    this._executiveReportFrontService.audio(section.abstract, this.reportLang);
  }

  public questionTitle(question: any): string {
    return MissionQuestionService.label(question, 'title', this.reportLang);
  }

  /**
   * @type {boolean}
   * */
  get section(): ExecutiveSection {
    return this._section;
  }

  /**
   * @type {boolean}
   * */
  get enableVisualBar(): boolean {
    return this._enableVisualBar;
  }

  /**
   * @type {boolean}
   * */
  get enableVisualRanking(): boolean {
    return this._enableVisualRanking;
  }

  /**
   * @type {boolean}
   * */
  get enableVisualPie(): boolean {
    return this._enableVisualPie;
  }

  /**
  * @type {boolean}
  * */
  get enableVisualLikertScale(): boolean {
    return this._enableVisualLikertScale;
  }

}


