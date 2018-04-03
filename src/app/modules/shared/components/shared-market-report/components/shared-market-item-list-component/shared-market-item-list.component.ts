/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Answer } from '../../../../../../models/answer';

@Component({
  selector: 'market-item-list',
  templateUrl: 'shared-market-item-list.component.html',
  styleUrls: ['shared-market-item-list.component.scss']
})

export class SharedMarketItemListComponent implements OnInit {

  @Input() public list: any;
  @Input() public answers: Array<Answer>;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.list = this.list
      .sort((a: any, b: any) => {
        if ((b.count || 1) - (a.count || 1) === 0) {
          return b.value.length - a.value.length;
        } else {
          return (b.count || 1) - (a.count || 1);
        }
      });
  }

  public getAnswers(commentsList: Array<any>): Array<Answer> {
    if (this.answers) {
      const answers = _.map(commentsList, (comment: any) => _.find(this.answers, (answer: Answer) => answer._id === comment.answerId));
      return _.filter(answers, (a: Answer) => a);
    } else {
      return [];
    }
  }

  public seeAnswer(event: any) {
    this.modalAnswerChange.emit(event);
  }

}
