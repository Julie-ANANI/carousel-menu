import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';
import { Filter } from '../../models/filter';

@Component({
  selector: 'app-market-comment-2',
  templateUrl: 'professional-comment-2.component.html',
  styleUrls: ['professional-comment-2.component.scss']
})

export class SharedMarketComment2Component {

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
