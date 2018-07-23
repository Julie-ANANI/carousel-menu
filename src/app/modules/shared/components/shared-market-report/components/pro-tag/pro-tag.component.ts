import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';
import { Filter } from '../../models/filter';
import { Tag } from '../../../../../../models/tag';

@Component({
  selector: 'app-pro-tag',
  templateUrl: 'pro-tag.component.html',
  styleUrls: ['pro-tag.component.scss']
})

export class ProfessionalTagComponent {

  @Input() answer: Answer;
  @Input() selectedTag: any;

  @Output() modalAnswerChange = new EventEmitter<any>();
  @Output() addFilter = new EventEmitter<Filter>();

  constructor() {}

  seeAnswer(event: Event, answer: Answer) {
    event.preventDefault();
    this.modalAnswerChange.emit(answer);
  }

  public newFilter(event: Event, tag: Tag) {
    event.preventDefault();

    this.selectedTag = tag.label;

    this.addFilter.emit({
      status: 'TAG',
      questionTitle: tag.label,
      value: tag._id
    });
  }

}
