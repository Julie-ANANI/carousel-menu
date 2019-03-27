import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FilterService } from '../../services/filters.service';
import { Answer } from '../../../../../../models/answer';
import { Tag } from '../../../../../../models/tag';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pro-tag',
  templateUrl: 'pro-tag.component.html',
  styleUrls: ['pro-tag.component.scss']
})

export class ProfessionalTagComponent implements OnInit {

  @Input() answer: Answer;

  @Input() tagId: string;

  @Output() modalAnswerChange = new EventEmitter<any>();

  private _tags: Array<Tag>;

  constructor(private _filterService: FilterService,
              private _translateService: TranslateService) { }

  ngOnInit() {
    if (this.tagId) {
      this._tags = this.answer.answerTags[this.tagId];
    } else {
      this._tags = this.answer.tags;
    }
  }

  public seeAnswer(event: Event, answer: Answer) {
    event.preventDefault();
    this.modalAnswerChange.emit(answer);
  }

  public newFilter(event: Event, tag: Tag) {
    event.preventDefault();

    this._filterService.addFilter({
      status: 'TAG',
      questionId: this.tagId,
      questionTitle: tag.label,
      value: tag._id
    });
  }

  get tags() {
    return this._tags;
  }

  get userLang() {
    return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';
  }

}
