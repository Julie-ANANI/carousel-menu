import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../../../models/answer';

@Component({
  selector: 'app-answers-list',
  templateUrl: './shared-answers-list.component.html',
  styleUrls: ['./shared-answers-list.component.scss']
})
export class SharedAnswersListComponent {

  @Input() answers: Array<Answer>;
  @Output() modalAnswerChange = new EventEmitter<any>();

  constructor() {}

  public seeAnswer(event: Event, answer: Answer) {
    event.preventDefault();
    this.modalAnswerChange.emit(answer);
  }
}
