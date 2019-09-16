import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Answer } from '../../../../../../models/answer';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';

export interface Item {
  rating: number;
  count: number;
  value: string;
  domain: string;
  logo: string;
  answers: Array<Answer>;
}

@Component({
  selector: 'app-item-list',
  templateUrl: 'item-list.component.html',
  styleUrls: ['item-list.component.scss']
})

export class ItemListComponent implements OnInit {

  @Input() public innovation: Innovation;

  @Input() public question: Question;

  @Input() public readonly: boolean;

  @Input() set showDetails(value: boolean) {
    this._details = value;
  }

  @Input() stats: any;

  @Output() modalAnswerChange = new EventEmitter<any>();

  @Output() updateNumberOfItems = new EventEmitter<number>();

  private _details: boolean;

  private _listItems: Array<Item>;

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    /* Update Answers Data */
    this._dataService.getAnswers(this.question._id).subscribe((answers: Array<Answer>) => {

      const answerItems: {[value: string]: {rating: number, count: number, domain: string, logo: string, answers: Array<Answer>}} = {};

      answers.forEach((answer) => {
        if (answer.answers[this.question.identifier] && Array.isArray(answer.answers[this.question.identifier])) {
          answer.answers[this.question.identifier].forEach((item: any) => {
            const key = this.question.controlType !== 'clearbit' ? item.text : item.name;
            if (answerItems[key]) {
              answerItems[key].count += 1;
              if (!isNaN(Number.parseInt(item.rating)) && Number.parseInt(item.rating) !== 1) {
                answerItems[key].rating = item.rating;
              }
              answerItems[key].answers.push(answer);
            } else {
              answerItems[key] = {
                rating: !isNaN(Number.parseInt(item.rating)) ? Number.parseInt(item.rating) : 1,
                count: 1,
                domain: item.domain ? `http://${item.domain}` : null,
                logo: item.logo,
                answers: [answer]
              };
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
            domain: answerItems[key].domain,
            logo: answerItems[key].logo,
            answers: answerItems[key].answers,
          };
        })
        .filter((a) => (a.rating !== 0))
        .sort((a, b) => {
          if (b.rating - a.rating === 0) {
            if ((b.count || 1) - (a.count || 1) === 0) {
              return b.value.length - a.value.length;
            } else {
              return (b.count || 1) - (a.count || 1);
            }
          } else {
            return b.rating - a.rating;
          }
        });

      this.updateNumberOfItems.emit(this._listItems.length);
    });
  }

  public seeAnswer(event: Answer) {
    this.modalAnswerChange.emit(event);
  }

  get listItems() {
    return this._listItems;
  }

  get details() {
    return this._details;
  }

}
