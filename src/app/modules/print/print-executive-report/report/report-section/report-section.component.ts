import { Component, Input, OnChanges } from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { Question } from '../../../../../models/question';
import { ResponseService } from '../../../../shared/components/shared-market-report/services/response.service';
import { Innovation, OldExecutiveReport } from '../../../../../models/innovation';
import { TranslateService } from '@ngx-translate/core';
import { Tag } from '../../../../../models/tag';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { DataService } from '../../../../shared/components/shared-market-report/services/data.service';
import {
  ExecutiveReport,
  ExecutiveSection, SectionBar,
  SectionKpi,
  SectionPie,
  SectionQuote,
  SectionRanking
} from '../../../../../models/executive-report';
import { ExecutivePieChart } from '../../../../../models/pie-chart';

@Component({
  selector: 'report-section',
  templateUrl: './report-section.component.html',
  styleUrls: ['./report-section.component.scss']
})

export class ReportSectionComponent implements OnChanges {

  @Input() currentSection = 0;

  @Input() answers: Array<Answer> = [];

  @Input() report: OldExecutiveReport | ExecutiveReport = <OldExecutiveReport | ExecutiveReport>{};

  @Input() set project(value: Innovation) {
    this._innovation = value;
    this._getQuestions(value);
  }

  /*@Input() set section(value: number) {
    this._sectionNumber = value;
  }*/

  /*@Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this._getSectionInformation(this._sectionNumber);
  }*/

  private _answers: Array<Answer> = [];

  private _innovation: Innovation;

  private _sectionMenuOptions: Array<Question> = [];

  private _questions: Array<Question> = [];

  private _sectionNumber: number;

  private _questionSelected: Question;

  private _abstractValue = '';

  private _stats: { nbAnswers?: number, percentage?: number };

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionKpi | SectionQuote | SectionRanking | SectionPie | SectionBar
    = <SectionKpi | SectionQuote | SectionRanking | SectionPie | SectionBar>{}

  private _pieChart: ExecutivePieChart = {
    data: [],
    colors: [],
    labels: [],
    labelPercentage: []
  };

  constructor(private _responseService: ResponseService,
              private _dataService: DataService,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnChanges(): void {
    if (this.report['totalSections'] && this.answers.length > 0 && !this.report['_id']) {
      this._typeInnovation();
    } else if (this.answers.length === 0 && this.report['_id'] && !this.report['totalSections']) {
      this._typeExecutive();
    }
  }

  /***
   * it the object type is Innovation.
   * @private
   */
  private _typeInnovation() {
    console.log(this.report);
  }

  /***
   * if the object type is Executive report
   * @private
   */
  private _typeExecutive() {
    console.log(this.report);
    const data: ExecutiveReport = <ExecutiveReport>this.report;
    this._section = data.sections[this.currentSection];
    this._content = <SectionKpi | SectionQuote | SectionRanking | SectionPie | SectionBar>this._section.content;
    this._initPieChartData();
  }

  /***
   * initializing the values for the pie chart.
   * @private
   */
  private _initPieChartData() {
    const _content = <SectionPie>this._content;
    if (this._section.questionType === 'PIE' && _content.values.length > 0) {
      _content.values.forEach((value, index) => {
        this._pieChart.data[index] = value.percentage;
        this._pieChart.colors[index] = value.color;
        this._pieChart.labels[index] = value.legend;
        this._pieChart.labelPercentage[index] = value.percentage;
      });
    }
  }


  /***
   * This function is to get the questions from the service, and then push it into the
   * respective arrays.
   * @param {Innovation} value
   */
  private _getQuestions(value: Innovation) {
    if (value.preset && value.preset.sections) {
      ResponseService.presets(value).forEach((questions) => {
        const index = this._questions.findIndex((question) => question._id === questions._id);
        if (index === -1) {
          this._questions.push(questions);
          this._sectionMenuOptions.push(questions);
        }
      });
    }
  }


  /***
   * This function is called when the operator clicked on anyone title
   * then we select that question and save that question id.
   * @param {Event} event
   * @param {Question} option
   */
  public onTitleClicked(event: Event, option: Question) {
    this._innovation.executiveReport.sections[this._sectionNumber] = { quesId: option._id };

    this._innovationService.save(this._innovation._id, this._innovation).subscribe(() => {
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });

    this._getSectionInformation(this._sectionNumber);
  }


  /***
   * Based on the sectionNumber we get the question id from the executiveReport.sections array and fill that section
   * with all the details.
   * @param {number} sectionNumber
   */
  private _getSectionInformation(sectionNumber: number) {

    if (this._innovation.executiveReport.sections[sectionNumber]) {

      this._questionSelected = this._questions.find((ques) => ques._id === this._innovation.executiveReport.sections[sectionNumber].quesId);

      if (this._questionSelected) {

        const answersToShow = this._responseService.answersToShow(this._answers, this._questionSelected);
        this._dataService.setAnswers(this._questionSelected, answersToShow);

        this._stats = {
          nbAnswers: answersToShow.length,
          percentage: Math.round((answersToShow.length * 100) / this._answers.length)
        };

        this._getAbstractValue();

      }

    }

  }


  /***
   * this function is to get the abstract value from the abstracts array by using
   * quesId.
   */
  private _getAbstractValue() {

    this._abstractValue = '';

    if (this._innovation.executiveReport.abstracts) {
      const findAbstract = this._innovation.executiveReport.abstracts.find((ques) => ques.quesId === this._questionSelected._id);
      if (findAbstract) {
        this._abstractValue = findAbstract.value;
      }
    }

  }

  get lang(): string {
    return this._translateService.currentLang;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get sectionMenuOptions(): Array<Question> {
    return this._sectionMenuOptions;
  }

  get questions(): Array<Question> {
    return this._questions;
  }

  get questionSelected(): Question {
    return this._questionSelected;
  }

  get abstractValue(): string {
    return this._abstractValue;
  }

  get stats(): { nbAnswers?: number; percentage?: number } {
    return this._stats;
  }

  get tags(): Array<Tag> {
    return this._dataService.answersTagsLists[this._questionSelected._id];
  }

  get section(): ExecutiveSection {
    return this._section;
  }

  get content(): SectionKpi | SectionQuote | SectionRanking | SectionPie | SectionBar {
    return this._content;
  }

  get pieChart(): ExecutivePieChart {
    return this._pieChart;
  }

}


