import { Component, Input, OnChanges } from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { ResponseService } from '../../../../shared/components/shared-market-report/services/response.service';
import { OldExecutiveReport } from '../../../../../models/innovation';
import { Tag } from '../../../../../models/tag';
import {
  ExecutiveReport,
  ExecutiveSection,
  SectionBar,
  SectionKpi,
  SectionPie,
  SectionQuote,
  SectionRanking,
  SectionLikertScale,
} from '../../../../../models/executive-report';
import { ExecutivePieChart, PieChart } from '../../../../../models/chart/pie-chart';
import { BarData } from '../../../../shared/components/shared-market-report/models/bar-data';
import {LangEntryService} from '../../../../../services/lang-entry/lang-entry.service';
import {UmiusMultilingInterface} from '@umius/umi-common-component';

@Component({
  selector: 'app-print-report-section',
  templateUrl: './report-section.component.html',
  styleUrls: ['./report-section.component.scss']
})

export class ReportSectionComponent implements OnChanges {

  @Input() currentSection = 0;

  @Input() answers: Array<Answer> = [];

  @Input() report: OldExecutiveReport | ExecutiveReport = <OldExecutiveReport | ExecutiveReport>{};

  private _section: ExecutiveSection = <ExecutiveSection>{};

  private _content: SectionKpi | SectionQuote | SectionRanking | SectionPie | SectionBar | SectionLikertScale
    = <SectionKpi | SectionQuote | SectionRanking | SectionPie | SectionBar | SectionLikertScale>{};

  private _pieChart: ExecutivePieChart = {
    data: [],
    colors: [],
    labels: [],
    labelPercentage: []
  };

  constructor(private _responseService: ResponseService,
              private _langEntryService: LangEntryService) { }

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
    const _report: OldExecutiveReport = <OldExecutiveReport>this.report;
    this._initSection(_report);
  }

  /***
   * this functions is to initialize the section value for the old ER.
   * @param report
   * @private
   */
  private _initSection(report: OldExecutiveReport) {
    if (report.sections[this.currentSection] && report.questions.length > 0 && this.answers.length > 0) {
      const _quesId = report.sections[this.currentSection].quesId || '';
      const _question = report.questions.find((ques) => ques._id === _quesId);
      const _titleFrench = _question.title && _question.title['fr'];
      const _titleEnglish = _question.title && _question.title['en'];
      const _abstract = this._getAbstract(_question._id);
      const _answers = this._responseService.answersToShow(this.answers, _question);

      if (_question && _question.controlType) {

        switch (_question.controlType) {

          case 'checkbox':
            this._section = {
              questionId: _quesId,
              title: this.report.lang === 'fr' ? _titleFrench : _titleEnglish,
              abstract: _abstract,
              questionType: 'BAR',
              content: <SectionBar>{}
            };
            this._content = this._initBarContent(ResponseService.barsData(_question, _answers));
            break;

          case 'radio':
            this._section = {
              questionId: _quesId,
              title: this.report.lang === 'fr' ? _titleFrench : _titleEnglish,
              abstract: _abstract,
              questionType: 'PIE',
              content: <SectionPie>{}
            };
            const _barsData = ResponseService.barsData(_question, _answers);
            this._content = this._initPieContent(ResponseService.pieChartData(_barsData, _answers));
            this._initPieChartData();
            break;

          case 'likert-scale':

            this._section = {
              questionId: _quesId,
              title: this.report.lang === 'fr' ? _titleFrench : _titleEnglish,
              abstract: _abstract,
              questionType: 'LIKERT-SCALE',
              content: <SectionLikertScale>{}
            };
            this._content = this._initLikertScaleContent(ResponseService.tagsList(_answers, _question), _question.title);
            break;

          case 'stars':
            this._section = {
              questionId: _quesId,
              title: this.report.lang === 'fr' ? _titleFrench : _titleEnglish,
              abstract: _abstract,
              questionType: 'BAR',
              content: <SectionBar>{}
            };
            this._content = this._initStarContent(ResponseService.getStarsAnswers(_question, _answers));
            break;

          default:
            this._section = {
              questionId: _quesId,
              title: this.report.lang === 'fr' ? _titleFrench : _titleEnglish,
              abstract: _abstract,
              questionType: 'RANKING',
              content: <SectionRanking>{}
            };
            this._content = this._initRankingContent(ResponseService.tagsList(_answers, _question), _question.title);

        }
      }

    }
  }

  /***
   * returns the content of the Section Bar of type Checkbox
   * @param barData
   * @private
   */
  private _initBarContent(barData: Array<BarData>): SectionBar {
    const _content = <SectionBar>{};
    _content.showExamples = false;
    _content.values = [];
    if (barData.length > 0) {
      _content.showExamples = true;
      for (let i = 0; i < 3; i++) {
        const _percentage = (Number)(barData[i] && barData[i].absolutePercentage.substring(0, barData[i].absolutePercentage.length - 1))
          || 0;
        _content.values.push({
          name: barData[i] && barData[i].label && barData[i].label[this.report.lang] || '',
          percentage: _percentage,
          legend: this._barLegend(barData[i] && barData[i].answers),
          visibility: _percentage !== 0
        });
      }
    }
    return _content;
  }

  /***
   * returns the professional company.
   * @param answers
   * @private
   */
  private _barLegend(answers: Array<Answer>): string {
    let _string = '';
    if (answers.length > 0) {
      for (let i = 0; i < 2; i++) {
        if (answers[i].professional && answers[i].professional.company) {
          _string += answers[i].professional.company;
          if (i === 0 && _string) {
            _string += ', ';
          }
        }
      }
    }
    return _string;
  }

  /***
   * returns the content of the Section Bar of type Stars
   * @param notesData
   * @private
   */
  private _initStarContent(notesData: Array<{label: UmiusMultilingInterface, sum: number, percentage: string}>): SectionBar {
    const _content = <SectionBar>{};
    _content.showExamples = false;
    _content.values = [];
    if (notesData.length > 0) {
      for (let i = 0; i < 3; i++) {
        const _percentage = (Number)(notesData[i] && notesData[i].percentage.substring(0, notesData[i].percentage.length - 1))
          || 0;
        _content.values.push({
          name: notesData[i] && notesData[i].label && notesData[i].label[this.report.lang] || '',
          percentage: _percentage,
          legend: '',
          visibility: _percentage !== 0
        });
      }
    }
    return _content;
  }

  /***
   * returns the content of the Section Pie
   * @param pieData
   * @private
   */
  private _initPieContent(pieData: PieChart): SectionPie {
    const _content = <SectionPie>{};
    _content.values = [];
    _content.favorable_answers = {
      percentage: pieData.percentage,
      visibility: pieData.percentage !== 0
    };

    if (pieData.data) {
      for (let i = 0; i < pieData.data.length; i++) {
        _content.values[i] = {
          percentage: (Number)(pieData.labelPercentage[i].substring(0, pieData.labelPercentage[i].length - 1))
            || 0,
          answers: pieData.data[i],
          legend: this._langEntryService.pieChartLabel(pieData, this.report.lang, i),
          color: pieData.colors[i],
        };
      }
    }
    return _content;
  }

  /***
   * returns the content of the Section Ranking
   * @param tagsData
   * @param title
   * @private
   */
  private _initRankingContent(tagsData: Array<Tag>, title: UmiusMultilingInterface): SectionRanking {
    const _content = <SectionRanking>{};
    _content.values = [];
    if (tagsData.length > 0) {
      for (let i = 0; i < 3; i++) {
        const label = this._langEntryService.tagEntry(tagsData[i], 'label', this.report.lang) || '';
        _content.values[i] = {
          name: label,
          visibility: true,
          legend: tagsData[i].count > 1 ? tagsData[i].count + 'X' : '',
          color: this._getRankingColor(title)
        };
      }
    }
    return _content;
  }

  /***
   * returns the label color for Ranking content
   * @param title
   * @private
   */
  private _getRankingColor(title: UmiusMultilingInterface): string {
    if (title) {
      if (title['en'].toLowerCase().indexOf('objections') !== -1) {
        return '#EA5858';
      } else if (title['en'].toLowerCase().indexOf('strengths') !== -1 || title['fr'].toLowerCase().indexOf('points forts') !== -1) {
        return '#2ECC71';
      }
    }
    return '#4F5D6B';
  }

  /***
   * return the abstract for the Old ER.
   * @param id
   * @private
   */
  private _getAbstract(id: string): string {
    if (id && this.report['abstracts'] && this.report['abstracts'].length > 0) {
      const index = this.report['abstracts'].findIndex((abstract: { quesId: string, value: string }) => abstract.quesId === id);
      if (index !== -1) {
        return this.report['abstracts'][index].value;
      }
    }
    return '';
  }


  /***
   * returns the label color for Likert-scale content
   * @param title
   * @private
   */
  private _getLikertScaleColor(title: UmiusMultilingInterface): string {
    if (title) {
      if (title['en'].toLowerCase().indexOf('objections') !== -1) {
        return '#EA5858';
      } else if (title['en'].toLowerCase().indexOf('strengths') !== -1 || title['fr'].toLowerCase().indexOf('points forts') !== -1) {
        return '#2ECC71';
      }
    }
    return '#4F5D6B';
  }

  /***
   * if the object type is Executive report
   * @private
   */
  private _typeExecutive() {
    const data: ExecutiveReport = <ExecutiveReport>this.report;
    this._section = data.sections[this.currentSection];
    this._content = <SectionKpi | SectionQuote | SectionRanking | SectionPie | SectionBar | SectionLikertScale>this._section.content;
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


  /*** TODO remove multiling
   * Returns the content of the SectionLikertScale
   * @private
   * @param tagsData : Array<Tag>
   * @param title : Multiling
   * @example
   * return {
      color: '#BBC7D6',
      legend: '',
      name: 'UNCERTAIN',
      visibility: false
    };
   */
  private _initLikertScaleContent(tagsData: Array<Tag>, title: UmiusMultilingInterface): SectionLikertScale {
    if (tagsData.length > 0) {
      return {
        name: this._langEntryService.tagEntry(tagsData[0], 'label', this.report.lang) || '',
        // name: tagsData[0].label[this.report.lang] || '',
        visibility: true,
        legend: tagsData[0].count > 1 ? tagsData[0].count + 'X' : '',
        color: this._getLikertScaleColor(title)
      };
    }
    return {
      color: '#BBC7D6',
      legend: '',
      name: 'UNCERTAIN',
      visibility: false
    };
  }

  get section(): ExecutiveSection {
    return this._section;
  }

  get content(): SectionKpi | SectionQuote | SectionRanking | SectionPie | SectionBar | SectionLikertScale {
    return this._content;
  }

  get pieChart(): ExecutivePieChart {
    return this._pieChart;
  }

}


