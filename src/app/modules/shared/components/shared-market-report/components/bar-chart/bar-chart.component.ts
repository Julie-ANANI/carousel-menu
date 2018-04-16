/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../../models/answer';
import { Multiling } from '../../../../../../models/multiling';
import { Question } from '../../../../../../models/question';

export interface BarData {
  label: Multiling,
  answers: Array<Answer>,
  percentage: string,
  color: string,
  count: number,
  positive: boolean
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
  @Input() public question: Question;
  @Output() modalAnswerChange = new EventEmitter<any>();
  @Output() updatePieChart = new EventEmitter<any>();

  private _answers: Array<Answer>;
  private _barsData: Array<BarData> = [];
  public showAnswers: {[index: string]: string} = {};

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    this.updateAnswersData();
  }

  private updateAnswersData(): void {
    if (this.question && this.question.identifier && Array.isArray(this.question.options)) {

      this._barsData = this.question.options.map((q) => {
        let answers: Array<Answer> = [];
        if (this.question.controlType === 'checkbox') {
          answers = this._answers.filter((a) => a.answers[this.question.identifier] && a.answers[this.question.identifier][q.identifier]);
        } else if (this.question.controlType === 'radio')  {
          answers = this._answers.filter((a) => a.answers[this.question.identifier] === q.identifier);
        }
        const percentage = `${((answers.length * 100) / this._answers.length) >> 0}%`;
        return {
          label: q.label,
          answers: answers,
          percentage: percentage,
          color: q.color,
          count: answers.length,
          positive: q.positive
        }
      });

      if (this.question.controlType === 'radio') {
        let positiveAnswersCount = 0;
        const pieChartData: {data: Array<number>, colors: Array<string>, labels: {[prop: string]: Array<string>}, percentage?: number} = {
          data: [],
          colors: [],
          labels: {fr: [], en: []}
        };
        this._barsData.forEach((barData) => {
          if (barData.positive) {
            positiveAnswersCount += barData.count;
          }
          pieChartData.data.push(barData.count);
          pieChartData.colors.push(barData.color);
          pieChartData.labels.fr.push(barData.label.fr);
          pieChartData.labels.en.push(barData.label.en);
        });
        pieChartData.percentage = Math.round((positiveAnswersCount * 100) / this._answers.length);
        this.updatePieChart.emit(pieChartData);
      }
    }
  }

  public seeAnswer(event: Answer) {
    this.modalAnswerChange.emit(event);
  }

  get barsData(): Array<BarData> { return this._barsData; }
  get lang(): string { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
