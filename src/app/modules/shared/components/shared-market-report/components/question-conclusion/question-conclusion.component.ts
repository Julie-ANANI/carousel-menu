import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tag } from '../../../../../../models/tag';
import { FilterService } from '../../services/filters.service';
import { environment } from "../../../../../../../environments/environment";

@Component({
  selector: 'app-question-conclusion',
  templateUrl: './question-conclusion.component.html',
  styleUrls: ['./question-conclusion.component.scss']
})

export class QuestionConclusionComponent implements OnInit, OnDestroy {

  @Input() set executiveReport(value: boolean) {
    this.executiveReportView = value;
  }

  @Input() set tags(value: Array<Tag>) {
    this.receivedTags = value;
  }

  @Input() set originAnswers(value: any) {
    this.answersOrigin = value;
  }

  @Input() readonly = true;

  @Input() pieChart: any;

  @Input() innovation: Innovation;

  @Input() question: Question;

  @Input() stats: { nbAnswers: number, percentage: number };

  private ngUnsubscribe: Subject<any> = new Subject();

  private _domSectionId: string;

  private _lang: string;

  executiveReportView = false;

  receivedTags: Array<Tag> = [];

  tagId = '';

  answersOrigin: {[c: string]: number} = null;

  constructor(private innovationService: InnovationService,
              private translateService: TranslateService,
              private filterService: FilterService) { }

  ngOnInit() {
    if (this.question && this.question.identifier) {
      this._domSectionId = `${this.question.identifier.replace(/\\s/g, '')}-conclusion`;
      this.tagId = this.question.identifier + (this.question.controlType !== 'textarea' ? 'Comment' : '');
    }

    if (this.innovation && !this.innovation.marketReport) {
      this.innovation.marketReport = {};
    }

    this._lang = this.translateService.currentLang || 'en';

    this.translateService.onLangChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((e: LangChangeEvent) => {
        this._lang = e.lang || 'en';
      });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  keyupHandlerFunction(event: any) {
    const objToSave = {};
    objToSave[this.question.identifier] = {
      conclusion: event['content']
    };
    this.innovationService.updateMarketReport(this.innovation._id, objToSave)
      .subscribe((data: any) => {
        this.innovation.marketReport = data;
      });
  }

  addTagFilter(event: Event, tag: Tag) {
    event.preventDefault();
    this.filterService.addFilter({
      status: 'TAG',
      questionId: this.question.identifier,
      value: tag._id
    });
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  get domSectionId(): string {
    return this._domSectionId;
  }

  get lang() {
    return this._lang;
  }

}
