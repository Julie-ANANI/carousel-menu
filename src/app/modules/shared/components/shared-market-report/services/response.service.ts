import { Injectable } from '@angular/core';
import {Answer} from '../../../../../models/answer';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Question} from '../../../../../models/question';
import {Innovation} from '../../../../../models/innovation';

@Injectable()
export class ResponseService {

  executiveAnswersReceived = new Subject <Array<Answer>>();

  question = new Subject<Array<Question>>();

  project = new BehaviorSubject<Innovation>(null);

  constructor() {
  }

  setProject(value: Innovation) {
    this.project.next(value);
  }

  getProject(): BehaviorSubject <Innovation> {
    return this.project;
  }

  setExecutiveAnswers(value: Array<Answer>) {
    this.executiveAnswersReceived.next(value);
  }

  getExecutiveAnswers(): Subject <Array<Answer>> {
    return this.executiveAnswersReceived;
  }

  setQuestions(value: Array<Question>) {
    this.question.next(value);
  }

  getQuestions(): Subject <Array<Question>> {
    return this.question;
  }

}
