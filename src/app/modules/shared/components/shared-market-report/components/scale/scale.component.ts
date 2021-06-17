import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonService } from '../../../../../../services/common/common.service';
import { DataService } from '../../services/data.service';
import { Answer } from '../../../../../../models/answer';
import { Question } from '../../../../../../models/question';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {MissionQuestion} from '../../../../../../models/mission';

@Component({
  selector: 'app-scale',
  templateUrl: 'scale.component.html',
  styleUrls: ['scale.component.scss']
})

export class ScaleComponent implements OnInit, OnDestroy {

  @Input() question: Question | MissionQuestion = <Question | MissionQuestion>{};

  private _barsData: {[prop: string]: {count: number, percentage?: string}} = {};

  private _bars: Array<number> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _commonService: CommonService,
              private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((answers: Array<Answer>) => {

        if (this.question.parameters) {
          this._bars = this._commonService.range(
            this.question.parameters.min || 1,
            this.question.parameters.max || 11,
            this.question.parameters.step || 1);
        } else {
          this._bars = this._commonService.range(1, 11, 1);
        }

        this._barsData = answers.reduce((acc, val) => {
          if (!acc[val.answers[this.question.identifier]]) {
            acc[val.answers[this.question.identifier]] = {count: 1};
          } else {
            acc[val.answers[this.question.identifier]].count++;
          }
          return acc;
        }, {} as {[prop: string]: {count: number}});

        const maxCount = Object.keys(this._barsData)
          .map(key => this._barsData[key])
          .reduce(function (prev: number, current: { count: number, percentage: string }) {
            return (prev > current.count) ? prev : current.count;
            }, 0);

        Object.keys(this._barsData).forEach((k) => {
          this._barsData[k].percentage = `${Math.round(this._barsData[k].count / maxCount * 100)}%`
        });

    });
  }

  get barsData(): {[prop: string]: {count: number, percentage?: string}} {
    return this._barsData;
  }

  get bars(): Array<number> {
    return this._bars;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
