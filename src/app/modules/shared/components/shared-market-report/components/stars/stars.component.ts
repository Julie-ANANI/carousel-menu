import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Answer } from '../../../../../../models/answer';
import { Multiling } from '../../../../../../models/multiling';
import { Question } from '../../../../../../models/question';
import { DataService } from '../../services/data.service';
import { ResponseService } from '../../services/response.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-stars',
  templateUrl: 'stars.component.html',
  styleUrls: ['stars.component.scss']
})

export class StarsComponent implements OnInit, OnDestroy {

  @Input() question: Question = <Question>{};

  private _notesData: Array<{label: Multiling, sum: number, percentage: string}> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _currentLang = this._translateService.currentLang;

  constructor(private _translateService: TranslateService,
              private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.getAnswers(this.question).pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((answers: Array<Answer>) => {
        this._notesData = ResponseService.getStarsAnswers(this.question, answers);
      });
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get notesData(): Array<{ label: Multiling; sum: number; percentage: string }> {
    return this._notesData;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
