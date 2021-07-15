import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Answer} from '../../../../../../models/answer';
import {ResponseService} from '../../services/response.service';
import {DataService} from '../../services/data.service';
import {Question} from '../../../../../../models/question';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';
import {MissionQuestionService} from '../../../../../../services/mission/mission-question.service';

@Component({
  selector: 'app-ranking-chart',
  templateUrl: './ranking-chart.component.html',
  styleUrls: ['./ranking-chart.component.scss']
})
export class RankingChartComponent implements OnInit, OnDestroy {

  @Input() question: Question = <Question>{};
  @Input() reportingLang = this._translateService.currentLang;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();
  private _rankingChart: any[] = [];

  constructor(private _dataService: DataService,
              private _translateService: TranslateService) {
  }

  ngOnInit() {
    this._createChart();
  }

  private _createChart() {
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((answers: Array<Answer>) => {
        this._rankingChart = ResponseService.rankingChartData(answers, this.question, this.reportingLang);
      });
  }

  public optionLabel(identifier: string) {
    const option = _.find(this.question.options, (o: any) => o.identifier === identifier);
    return MissionQuestionService.label(option, 'label', this.reportingLang);
  }

  get rankingChart() {
    return this._rankingChart;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
