import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { Tag } from '../../../../../../models/tag';
import { TagsFiltersService } from '../../services/tags-filter.service';
import { environment } from "../../../../../../../environments/environment";
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { PieChart } from '../../../../../../models/pie-chart';

@Component({
  selector: 'app-question-conclusion',
  templateUrl: './question-conclusion.component.html',
  styleUrls: ['./question-conclusion.component.scss']
})

export class QuestionConclusionComponent implements OnInit {

  @Input() set tags(value: Array<Tag>) {
    this._receivedTags = value;
  }

  @Input() set originAnswers(value: any) {
    this._answersOrigin = value;
  }

  @Input() readonly = true;

  @Input() pieChart: PieChart;

  @Input() innovation: Innovation;

  @Input() question: Question;

  @Input() stats: { nbAnswers: number, percentage: number };

  private _domSectionId: string;

  private _lang: string;

  private _receivedTags: Array<Tag> = [];

  private _tagId = '';

  private _answersOrigin: {[c: string]: number} = null;

  constructor(private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _tagService: TagsFiltersService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {

    if (this.question && this.question.identifier) {
      this._domSectionId = `${this.question.identifier.replace(/\\s/g, '')}-conclusion`;
      this._tagId = this.question.identifier + (this.question.controlType !== 'textarea' ? 'Comment' : '');
    }

    if (this.innovation && !this.innovation.marketReport) {
      this.innovation.marketReport = {};
    }

    this._lang = this._translateService.currentLang || 'en';

  }


  public keyupHandlerFunction(event: {content: string}) {
    const objToSave = {};

    objToSave[this.question.identifier] = { conclusion: event['content'] };

    this._innovationService.updateMarketReport(this.innovation._id, objToSave).pipe(first()).subscribe(() => {
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });

  }

  public addTagFilter(event: Event, tag: Tag) {
    event.preventDefault();
    this._tagService.checkAnswerTag(this.tagId, tag._id, false);
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

  get receivedTags(): Array<Tag> {
    return this._receivedTags;
  }

  get tagId(): string {
    return this._tagId;
  }

  get answersOrigin(): { [p: string]: number } {
    return this._answersOrigin;
  }

}
