/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Answer } from '../../../../../models/answer';

@Component({
  selector: 'market-item-list',
  templateUrl: 'shared-market-item-list.component.html',
  styleUrls: ['shared-market-item-list.component.scss']
})

export class SharedMarketItemListComponent {

  @Input() public list: any;
  @Input() public answers: Array<Answer>;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() { }

  public getAnswers(commentsList: Array<any>): Array<any> {
    if (this.answers) {
      let answers = _.map(commentsList, comment => _.find(this.answers, (answer: any) => answer.id === comment.answerId));
      return _.filter(answers, a => a);
    } else {
      return [];
    }
  }

  public seeAnswer(event: any) {
    this.modalAnswerChange.emit(event);
  }

}
