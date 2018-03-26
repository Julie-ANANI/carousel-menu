/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Answer } from '../../../../../models/answer';

@Component({
  selector: 'market-comment',
  templateUrl: 'shared-market-comment.component.html',
  styleUrls: ['shared-market-comment.component.scss', '../shared-market-report.component.scss']
})

export class SharedMarketCommentComponent implements OnInit {

  @Input() public comment: string;
  @Input() public answer: Answer;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log(this.comment);
  }

  public seeAnswer(event: any) {
    this.modalAnswerChange.emit(event);
  }

}
