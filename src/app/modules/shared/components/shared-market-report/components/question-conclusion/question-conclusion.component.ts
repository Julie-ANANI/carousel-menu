import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Tag } from '../../../../../../models/tag';
import { FilterService } from '../../services/filters.service';
import { environment } from "../../../../../../../environments/environment";

@Component({
  selector: 'app-question-conclusion',
  templateUrl: './question-conclusion.component.html',
  styleUrls: ['./question-conclusion.component.scss']
})

export class QuestionConclusionComponent implements OnInit {

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

  private _domSectionId: string;

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

  }


  keyupHandlerFunction(event: {content: string}) {
    const objToSave = {};
    objToSave[this.question.identifier] = { conclusion: event['content'] };

    this._innovationService.updateMarketReport(this.innovation._id, objToSave).subscribe((data: any) => {
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
    return this._translateService.currentLang;
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

}
