import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FilterService } from '../../services/filters.service';
import { TagsService } from '../../services/tags.service';
import { Answer } from '../../../../../../models/answer';
import { Tag } from '../../../../../../models/tag';

@Component({
  selector: 'app-pro-tag',
  templateUrl: 'pro-tag.component.html',
  styleUrls: ['pro-tag.component.scss']
})

export class ProfessionalTagComponent implements OnInit {

  @Input() answer: Answer;
  @Input() questionId: string;

  @Output() modalAnswerChange = new EventEmitter<any>();

  private _tags: Array<Tag>;

  constructor(private filterService: FilterService,
              private tagService: TagsService) {}

  ngOnInit() {
    if (this.questionId) {
      this._tags = this.answer.answerTags[this.questionId];
    } else {
      this._tags = this.answer.tags;
    }
  }

  seeAnswer(event: Event, answer: Answer) {
    event.preventDefault();
    this.modalAnswerChange.emit(answer);
  }

  public newFilter(event: Event, tag: Tag) {
    event.preventDefault();
    if (this.questionId) {
      this.filterService.addFilter({
        status: 'TAG',
        questionId: this.questionId,
        value: tag._id
      });
    } else {
      this.tagService.checkTag(tag._id, false);
    }
  }

  get tags() {
    return this._tags;
  }

}
