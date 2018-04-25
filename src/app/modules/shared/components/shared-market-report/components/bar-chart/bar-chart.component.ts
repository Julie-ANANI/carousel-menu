/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../../models/answer';
import { Innovation } from '../../../../../../models/innovation';
import { Multiling } from '../../../../../../models/multiling';
import { Question } from '../../../../../../models/question';

export interface BarData {
  label: Multiling,
  answers: Array<Answer>,
  absolutePercentage: string,
  relativePercentage: string,
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
  @Input() public infographic: any;
  @Input() public innovation: Innovation;
  @Input() public question: Question;
  @Input() public readonly: boolean;
  @Input() public stats: any;

  @Output() modalAnswerChange = new EventEmitter<any>();

  private _answers: Array<Answer>;
  private _barsData: Array<BarData> = [];
  private _pieChart: {data: Array<number>, colors: Array<string>, labels: {[prop: string]: Array<string>}, percentage?: number};
  public showAnswers: {[index: string]: string} = {};

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    this.updateAnswersData();
  }

  private updateAnswersData(): void {
    if (this.question && this.question.identifier && Array.isArray(this.question.options)) {

      // Calcul bar Data
      this._barsData = this.question.options.map((q) => {
        let answers: Array<Answer> = [];
        if (this.question.controlType === 'checkbox') {
          answers = this._answers.filter((a) => a.answers[this.question.identifier] && a.answers[this.question.identifier][q.identifier]);
        } else if (this.question.controlType === 'radio')  {
          answers = this._answers.filter((a) => a.answers[this.question.identifier] === q.identifier);
        }
        return {
          label: q.label,
          answers: answers,
          absolutePercentage: '0%',
          relativePercentage: '0%',
          color: q.color,
          count: answers.length,
          positive: q.positive
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
        this._pieChart = pieChartData;
      }
    }
  }

  public seeAnswer(event: Answer) {
    this.modalAnswerChange.emit(event);
  }

  get barsData(): Array<BarData> { return this._barsData; }
  get lang(): string { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
  get pieChart() { return this._pieChart; }
}
