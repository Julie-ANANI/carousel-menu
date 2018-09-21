import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FilterService } from '../../services/filters.service';
import { Answer } from '../../../../../../models/answer';
import { Innovation } from '../../../../../../models/innovation';
import { Multiling } from '../../../../../../models/multiling';
import { Question } from '../../../../../../models/question';
import { Tag } from '../../../../../../models/tag';

export interface BarData {
  label: Multiling,
  answers: Array<Answer>,
  absolutePercentage: string,
  relativePercentage: string,
  color: string,
  count: number,
  positive: boolean,
  identifier: string
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: 'bar-chart.component.html',
  styleUrls: ['bar-chart.component.scss']
})

export class BarChartComponent implements OnInit {

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this.updateAnswersData();
  }
  @Input() public tags: Array<Tag>;
  @Input() public innovation: Innovation;
  @Input() public question: Question;
  @Input() public readonly: boolean;
  @Input() public stats: any;
  @Input() showDetails: boolean;

  @Output() modalAnswerChange = new EventEmitter<any>();
  @Output() answerButtonClicked = new EventEmitter<boolean>();

  private _answers: Array<Answer>;
  private _barsData: Array<BarData> = [];
  private _pieChart: {data: Array<number>, colors: Array<string>, labels: {[prop: string]: Array<string>}, percentage?: number, labelPercentage?: Array<string>};
  public showAnswers: {[index: string]: string} = {};

  constructor(private _translateService: TranslateService,
              private filterService: FilterService) {}

  ngOnInit() {
    this.updateAnswersData();
  }

  private updateAnswersData(): void {
    if (this.question && this.question.identifier && Array.isArray(this.question.options)) {

      // Calcul bar Data
      this._barsData = this.question.options.map((q) => {
        let answers: Array<Answer> = [];
        if (this.question.controlType === 'checkbox') {
          answers = this._answers.filter((a) =>
            a.answers[this.question.identifier]
            && a.answers[this.question.identifier][q.identifier]
            && a.answers[this.question.identifier + 'Quality'] !== 0);

        } else if (this.question.controlType === 'radio')  {
          answers = this._answers.filter((a) =>
            a.answers[this.question.identifier] === q.identifier
            && a.answers[this.question.identifier + 'Quality'] !== 0 )

        }
        answers = answers.sort((a, b) => {
          if ((b.answers[this.question.identifier + 'Quality'] || 1) - (a.answers[this.question.identifier + 'Quality'] || 1) === 0) {
            const a_length = a.answers[this.question.identifier + 'Comment'] ? a.answers[this.question.identifier + 'Comment'].length : 0;
            const b_length = b.answers[this.question.identifier + 'Comment'] ? b.answers[this.question.identifier + 'Comment'].length : 0;
            return b_length - a_length;
          } else {
            return (b.answers[this.question.identifier + 'Quality'] || 1) - (a.answers[this.question.identifier + 'Quality'] || 1);
          }
        });
        return {
          label: q.label,
          answers: answers,
          absolutePercentage: '0%',
          relativePercentage: '0%',
          color: q.color,
          count: answers.length,
          positive: q.positive,
          identifier: q.identifier
        }
      });

      // Then calcul percentages
      const maxAnswersCount = this._barsData.reduce((acc, bd) => {
        return (acc < bd.count) ? bd.count : acc;
      }, 0);
      this._barsData.forEach((bd) => {
        bd.absolutePercentage = `${((bd.count * 100) / this._answers.length) >> 0}%`;
        bd.relativePercentage = `${((bd.count * 100) / maxAnswersCount) >> 0}%`;
      });

      // If we have a radio question, we should also calculate the pieChart data.
      if (this.question.controlType === 'radio') {
        let positiveAnswersCount = 0;
        const pieChartData: {data: Array<number>, colors: Array<string>, labels: {fr: Array<string>, en: Array<string>}, percentage?: number, labelPercentage?: Array<string>} = {
          data: [],
          colors: [],
          labels: {fr: [], en: []},
          labelPercentage: []
        };
        this._barsData.forEach((barData) => {
          if (barData.positive) {
            positiveAnswersCount += barData.count;
          }
          pieChartData.data.push(barData.count);
          pieChartData.colors.push(barData.color);
          pieChartData.labels.fr.push(barData.label.fr);
          pieChartData.labels.en.push(barData.label.en);
          pieChartData.labelPercentage.push(barData.absolutePercentage);
        });
        pieChartData.percentage = Math.round((positiveAnswersCount * 100) / this._answers.length);
        this._pieChart = pieChartData;
      }
    }
  }

  public filterAnswer(data: BarData, event: Event) {
    event.preventDefault();
    this.filterService.addFilter({
      status: this.question.controlType === 'radio' ? 'RADIO' : 'CHECKBOX',
      questionId: this.question.identifier,
      questionTitle: this.question.title,
      value: data.identifier
    });
  }

  public seeAnswer(event: Answer) {
    this.modalAnswerChange.emit(event);
  }

  toggleAnswer(event: Event) {
    event.preventDefault();
    this.showDetails = !this.showDetails;
    this.answerButtonClicked.emit(this.showDetails);
  }

  public addTagFilter(event: Event, tag: Tag) {
    event.preventDefault();
    this.filterService.addFilter({
      status: 'TAG',
      questionId: this.question.identifier + 'Comment',
      questionTitle: tag.label,
      value: tag._id
    });
  }

  get barsData(): Array<BarData> {
    return this._barsData;
  }

  get lang(): string {
    return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';
  }

  get pieChart() {
    return this._pieChart;
  }

}
