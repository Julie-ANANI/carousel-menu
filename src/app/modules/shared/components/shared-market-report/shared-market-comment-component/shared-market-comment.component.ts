/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../models/answer';

@Component({
  selector: 'market-comment',
  templateUrl: 'shared-market-comment.component.html',
  styleUrls: ['shared-market-comment.component.scss', '../shared-market-report.component.scss']
})

export class SharedMarketCommentComponent {

  @Input() public answer: Answer;
  @Input() public commentId: string;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  public seeAnswer(event: any) {
    this.modalAnswerChange.emit(event);
  }

}
