import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FilterService } from '../../services/filters.service';
import { Answer } from '../../../../../../models/answer';
import { Tag } from '../../../../../../models/tag';

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

  constructor(private filterService: FilterService) {}

  ngOnInit() {
    if (this.tagId) {
      this._tags = this.answer.answerTags[this.tagId];
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

    this.filterService.addFilter({
      status: 'TAG',
      questionId: this.tagId,
      value: tag._id
    });
  }

  get tags() {
    return this._tags;
  }

}
