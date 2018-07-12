/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';
import { Filter } from '../../models/filter';

@Component({
  selector: 'market-comment',
  templateUrl: 'professional-comment.component.html',
  styleUrls: ['professional-comment.component.scss', '../../shared-market-report.component.scss']
})

export class SharedMarketCommentComponent {

  @Input() public answer: Answer;
  @Input() public questionId: string;

  @Output() addFilter = new EventEmitter<Filter>();
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  public seeAnswer(event: any) {
    this.modalAnswerChange.emit(event);
  }

  public newFilter(filter: Filter) {
    this.addFilter.emit(filter);
  }

}
