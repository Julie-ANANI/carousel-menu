import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Question} from '../../../../../../models/question';
import {Multiling} from '../../../../../../models/multiling';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {DataService} from '../../services/data.service';
import {takeUntil} from 'rxjs/operators';
import {Answer} from '../../../../../../models/answer';
import {ResponseService} from '../../services/response.service';
import * as _ from 'lodash';
import {MissionQuestionService} from '../../../../../../services/mission/mission-question.service';

@Component({
  selector: 'app-ranks',
  templateUrl: './ranks.component.html',
})
export class RanksComponent implements OnInit, OnDestroy {

  @Input() question: Question = <Question>{};

  @Input() reportingLang = this._translateService.currentLang;

  private _ranksData: Array<{label: Multiling, sum: number, identifier: string, percentage: string}> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _translateService: TranslateService,
              private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((answers: Array<Answer>) => {
        this._ranksData = ResponseService.getRanksAnswers(this.question, answers, this.reportingLang);
      });
  }

  public optionLabel(identifier: string) {
    const option = _.find(this.question.options, (o: any) => o.identifier === identifier);
    return MissionQuestionService.label(option, 'label', this.reportingLang);
  }

  get ranksData(): Array<{ label: Multiling; sum: number; identifier: string; percentage: string }> {
    return this._ranksData;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }


}
