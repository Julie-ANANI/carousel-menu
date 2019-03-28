import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TagsFiltersService } from '../../services/tags-filter.service';
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

  constructor(private tagService: TagsFiltersService) {}

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

  public checkTag(event: Event, tag: Tag) {
    event.preventDefault();
    if (this.questionId) {
      this.tagService.checkAnswerTag(this.questionId, tag._id, false);
    } else {
      this.tagService.checkTag(tag._id, false);
    }
  }

  get tags() {
    return this._tags;
  }

}
