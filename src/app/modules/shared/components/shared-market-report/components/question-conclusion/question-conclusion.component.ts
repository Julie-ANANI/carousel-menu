import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Subject } from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
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
    this._executiveReportView = value;
  }

  @Input() set tags(value: Array<Tag>) {
    this._receivedTags = value;
  }

  @Input() set originAnswers(value: any) {
    this._answersOrigin = value;
  }

  @Input() readonly = true;

  @Input() pieChart: any;

  @Input() innovation: Innovation;

  @Input() question: Question;

  @Input() stats: { nbAnswers: number, percentage: number };

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _domSectionId: string;

  private _lang: string;

  private _executiveReportView = false;

  private _receivedTags: Array<Tag> = [];

  private _tagId = '';

  private _answersOrigin: {[c: string]: number} = null;

  constructor(private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _filterService: FilterService) { }

  ngOnInit() {

    if (this.question && this.question.identifier) {
      this._domSectionId = `${this.question.identifier.replace(/\\s/g, '')}-conclusion`;
      this._tagId = this.question.identifier + (this.question.controlType !== 'textarea' ? 'Comment' : '');
    }

    if (this.innovation && !this.innovation.marketReport) {
      this.innovation.marketReport = {};
    }

    this._lang = this._translateService.currentLang || 'en';

    this._translateService.onLangChange.pipe(takeUntil(this._ngUnsubscribe)).subscribe((e: LangChangeEvent) => {
      this._lang = e.lang || 'en';
    });

  }


  keyupHandlerFunction(event: any) {
    const objToSave = {};

    objToSave[this.question.identifier] = { conclusion: event['content'] };

    this._innovationService.updateMarketReport(this.innovation._id, objToSave).pipe(first()).subscribe((data: any) => {
      this.innovation.marketReport = data;
    });

  }

  addTagFilter(event: Event, tag: Tag) {
    event.preventDefault();
    this._filterService.addFilter({
      status: 'TAG',
      questionId: this._tagId,
      questionTitle: tag.label,
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

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  get executiveReportView(): boolean {
    return this._executiveReportView;
  }

  get receivedTags(): Array<Tag> {
    return this._receivedTags;
  }

  get tagId(): string {
    return this._tagId;
  }

  get answersOrigin(): { [p: string]: number } {
    return this._answersOrigin;
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
