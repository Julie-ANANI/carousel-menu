import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Question} from '../../../../../../models/question';
import {Multiling} from '../../../../../../models/multiling';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {DataService} from '../../services/data.service';
import {takeUntil} from 'rxjs/operators';
import {Answer} from '../../../../../../models/answer';
import {ResponseService} from '../../services/response.service';

@Component({
  selector: 'app-ranks',
  templateUrl: './ranks.component.html',
  styleUrls: ['./ranks.component.scss']
})
export class RanksComponent implements OnInit, OnDestroy {

  @Input() question: Question = <Question>{};
  @Input() reportingLang = this._translateService.currentLang;

  private _ranksData: Array<{label: Multiling, sum: number, percentage: string}> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _currentLang = this._translateService.currentLang;

  constructor(private _translateService: TranslateService,
              private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((answers: Array<Answer>) => {
        this._ranksData = ResponseService.getRanksAnswers(this.question, answers);
      });
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get ranksData(): Array<{ label: Multiling; sum: number; percentage: string }> {
    return this._ranksData;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }


}
