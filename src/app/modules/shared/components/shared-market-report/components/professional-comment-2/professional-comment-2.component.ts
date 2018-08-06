import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';

@Component({
  selector: 'app-market-comment-2',
  templateUrl: 'professional-comment-2.component.html',
  styleUrls: ['professional-comment-2.component.scss']
})

export class SharedMarketComment2Component {

  @Input() public answer: Answer;
  @Input() public questionId: string;

  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  public seeAnswer(answer: Answer) {
    this.modalAnswerChange.emit(answer);
  }

}
