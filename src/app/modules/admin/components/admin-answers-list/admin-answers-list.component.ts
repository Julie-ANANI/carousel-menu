import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../models/answer';

@Component({
  selector: 'app-admin-answers-list',
  templateUrl: './admin-answers-list.component.html',
  styleUrls: ['./admin-answers-list.component.scss']
})
export class AdminAnswersListComponent {

  @Input() answers: Array<Answer>;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() {}

  public seeAnswer(event: Event, answer: Answer) {
    event.preventDefault();
    this.modalAnswerChange.emit(answer);
  }

  public buildImageUrl(country: any): string {
    if (country && country.flag) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country.flag}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }
}
