import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';
import { Filter } from '../../models/filter';

@Component({
  selector: 'app-market-comment',
  templateUrl: 'professional-comment.component.html',
  styleUrls: ['professional-comment.component.scss']
})

export class SharedMarketCommentComponent {

  @Input() public answer: Answer;
  @Input() public questionId: string;
  @Input() selectedTag: any;

  @Output() addFilter = new EventEmitter<Filter>();
  @Output() modalAnswerChange = new EventEmitter<any>();


  constructor() { }

  public seeAnswer(event: any, answer: Answer) {
    event.preventDefault();
    this.modalAnswerChange.emit(answer);
  }

  public newFilter(filter: any) {
    this.selectedTag = filter.questionTitle;
    this.addFilter.emit(filter);
  }

}
