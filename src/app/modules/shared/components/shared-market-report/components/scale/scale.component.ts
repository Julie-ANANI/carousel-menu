import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../../../../services/common/common.service';
import { Answer } from '../../../../../../models/answer';
import { Question } from '../../../../../../models/question';

@Component({
  selector: 'app-scale',
  templateUrl: 'scale.component.html',
  styleUrls: ['scale.component.scss']
})
export class ScaleComponent implements OnInit {

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this.updateAnswersData();
  }

  @Input() public question: Question;

  private _answers: Array<Answer>;
  private _barsData: {[prop: string]: {count: number, percentage: string}} = {};
  private _bars: Array<number> = [];
  private _maxCount: number;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.updateAnswersData();
  }

  private updateAnswersData(): void {
    if (this.question && this.question.identifier) {

      if (this.question.parameters) {
        this._bars = this.commonService.range(
          this.question.parameters.min || 1,
          this.question.parameters.max || 11,
          this.question.parameters.step || 1);
      } else {
        this._bars = this.commonService.range(1, 11, 1);
      }

      this._barsData = this._answers
        .reduce((acc, val) => {
          if (!acc[val.answers[this.question.identifier]]) {
            acc[val.answers[this.question.identifier]] = {count: 1};
          } else {
            acc[val.answers[this.question.identifier]].count++;
          }
          return acc;
        }, {});

      this._maxCount = Object
        .keys(this._barsData)
        .map(key => this._barsData[key])
        .reduce(function (prev: number, current: { count: number, percentage: string }) {
          return (prev > current.count) ? prev : current.count
        }, 0);

      Object.keys(this._barsData).forEach((k) => {
        this._barsData[k].percentage = `${Math.round(this._barsData[k].count / this._maxCount * 100)}%`
      });
    }
  }

  get barsData() {
    return this._barsData
  };

  get bars() {
    return this._bars
  };

}
