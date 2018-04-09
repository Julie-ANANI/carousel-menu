/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Answer } from '../../../../../../models/answer';
import { Question } from '../../../../../../models/question';

@Component({
  selector: 'market-item-list',
  templateUrl: 'shared-market-item-list.component.html',
  styleUrls: ['shared-market-item-list.component.scss']
})

export class SharedMarketItemListComponent implements OnInit {

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this.updateAnswersData();
  }
  @Input() public question: Question;
  @Output() modalAnswerChange = new EventEmitter<any>();

  private _answers: Array<Answer>;
  private _listItems: Array<{rating: number, count: number, value: string, answers: Array<Answer>}>;

  constructor() { }

  ngOnInit() {
    this.updateAnswersData();
  }

  private updateAnswersData(): void {
    if (this.question && this.question.identifier) {

      const answerItems: {[value: string]: {rating: number, count: number, answers: Array<Answer>}} = {};

      this._answers.forEach((answer) => {
        if (answer.answers[this.question.identifier] && Array.isArray(answer.answers[this.question.identifier])) {
          answer.answers[this.question.identifier].forEach((item: any) => {
            const key = this.question.controlType !== 'clearbit' ? item.text : item.name;
            if (answerItems[key]) {
              answerItems[key].count += 1;
              answerItems[key].answers.push(answer);
            } else {
              answerItems[key] = {rating: 1, count: 1, answers: [answer]};
            }
          });
        }
      });

      this._listItems = Object.keys(answerItems)
        .map((key) => {
          return {
            value: key,
            rating: answerItems[key].rating,
            count: answerItems[key].count,
            answers: answerItems[key].answers,
          }
        })
        .sort((a, b) => {
          if ((b.count || 1) - (a.count || 1) === 0) {
            return b.value.length - a.value.length;
          } else {
            return (b.count || 1) - (a.count || 1);
          }
        });
    }
  }

  public seeAnswer(event: any) {
    this.modalAnswerChange.emit(event);
  }

  get listItems() { return this._listItems; }

}
