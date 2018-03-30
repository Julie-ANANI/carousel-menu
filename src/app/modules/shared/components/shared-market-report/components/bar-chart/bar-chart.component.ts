/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../../models/answer';
import { Multiling } from '../../../../../../models/multiling';
// import { Question } from '../../../../../../models/question';

export interface BarData {
  label: Multiling,
  answers: Array<Answer>,
  percentage: string,
  color: string,
  count: number
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: 'bar-chart.component.html',
  styleUrls: ['bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  @Input() public question: any;
  @Input() public answers: Array<Answer>;

  private _barsData: Array<BarData> = [];
  public showAnswers: {[index: string]: string} = {};

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    this._barsData = this.question.options.map((q: any) => {
      // TODO: when getting real Question (not the one from infographic), change question.id to question.identifier
      let answers = [];
      if (this.question.controlType === 'checkbox') {
        answers = this.answers.filter((a) => a.answers[this.question.id] && a.answers[this.question.id][q.identifier]);
      } else {
        answers = this.answers.filter((a) => a.answers[this.question.id] === q.identifier);
      }
      const percentage = `${((answers.length * 100) / this.answers.length) >> 0}%`;
      return {
        label: q.label,
        answers: answers,
        percentage: percentage,
        color: q.color,
        count: answers.length
      }
    });
  }

  get barsData(): Array<BarData> { return this._barsData; }
  get lang(): string { return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en'; }
}
