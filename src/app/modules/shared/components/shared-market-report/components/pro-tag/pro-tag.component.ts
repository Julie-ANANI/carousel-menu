import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilterService } from '../../services/filters.service';
import { Answer } from '../../../../../../models/answer';
import { Tag } from '../../../../../../models/tag';

@Component({
  selector: 'app-pro-tag',
  templateUrl: 'pro-tag.component.html',
  styleUrls: ['pro-tag.component.scss']
})

export class ProfessionalTagComponent {

  @Input() answer: Answer;

  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor(private filterService: FilterService) {}

  seeAnswer(event: Event, answer: Answer) {
    event.preventDefault();
    this.modalAnswerChange.emit(answer);
  }

  public newFilter(event: Event, tag: Tag) {
    event.preventDefault();

    this.filterService.addFilter({
      status: 'TAG',
      questionTitle: tag.label,
      value: tag._id
    });
  }

}
