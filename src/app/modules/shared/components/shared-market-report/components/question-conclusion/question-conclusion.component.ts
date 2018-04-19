import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-question-conclusion',
  templateUrl: './question-conclusion.component.html',
  styleUrls: ['./question-conclusion.component.scss']
})

export class QuestionConclusionComponent implements OnInit, OnDestroy {

  @Input() public readonly = true;
  @Input() public pieChart: any;
  @Input() public innovation: Innovation;
  @Input() public question: Question;
  @Input() public stats: {nbAnswers: number, percentage: number};
  @Input() public infographic: any;

  private ngUnsubscribe: Subject<any> = new Subject();
  private _domSectionId: string;
  private _chartValues: any;
  private _lang: string;

  constructor(private innovationService: InnovationService,
              private translateService: TranslateService) { }

  ngOnInit() {
    this._domSectionId = `${this.question.identifier.replace(/\\s/g, '')}-conclusion`;

    if (this.innovation && !this.innovation.marketReport) {
      this.innovation.marketReport = {};
    }

    this._lang = this.translateService.currentLang || 'en';
    this.translateService.onLangChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe((e: LangChangeEvent) => {
        this._lang = e.lang || 'en';
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public keyupHandlerFunction(event: any) {
    const objToSave = {};
    objToSave[this.question.identifier] = {
      conclusion: event['content']
    };
    this.innovationService.updateMarketReport(this.innovation._id, objToSave)
      .first()
      .subscribe((data) => {
        this.innovation.marketReport = data;
      });
  }

  public get chartValues() { return this._chartValues; }
  public get domSectionId(): string { return this._domSectionId; }
  public get lang() { return this._lang; }

}
