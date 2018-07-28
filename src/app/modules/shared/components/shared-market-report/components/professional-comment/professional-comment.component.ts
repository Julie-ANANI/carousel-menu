import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FilterService } from '../../services/filters.service';
import { Answer } from '../../../../../../models/answer';
import { Tag } from '../../../../../../models/tag';

@Component({
  selector: 'app-market-comment',
  templateUrl: 'professional-comment.component.html',
  styleUrls: ['professional-comment.component.scss']
})

export class SharedMarketCommentComponent {

  @Input() public answer: Answer;
  @Input() public questionId: string;

  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor(private filterService: FilterService) { }

  public seeAnswer(event: any, answer: Answer) {
    event.preventDefault();
    this.modalAnswerChange.emit(answer);
  }

  public newFilter(event: any, tag: Tag) {
    event.preventDefault();
    this.filterService.addFilter({
      status: 'TAG',
      questionTitle: tag.label,
      value: tag._id
    });
  }

}
