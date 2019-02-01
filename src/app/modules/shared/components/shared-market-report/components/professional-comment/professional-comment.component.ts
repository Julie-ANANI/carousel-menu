import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';

@Component({
  selector: 'app-market-comment',
  templateUrl: 'professional-comment.component.html',
  styleUrls: ['professional-comment.component.scss']
})

export class SharedMarketCommentComponent {

  @Input() public answer: Answer;
  @Input() public questionId: string;

  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  public seeAnswer(answer: Answer) {
    this.modalAnswerChange.emit(answer);
  }

}
