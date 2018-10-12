import { Injectable } from '@angular/core';
import {Answer} from '../../../../../models/answer';
import {Subject} from 'rxjs/Subject';
import {Question} from '../../../../../models/question';
import {Section} from '../../../../../models/section';
import {Innovation} from '../../../../../models/innovation';

@Injectable()
export class ResponseService {

  executiveAnswersReceived = new Subject <Array<Answer>>();

  questions: Array<Question> = [];

  constructor() {
  }

  setExecutiveAnswers(value: Array<Answer>) {
    this.rectifyAnswerData();
    this.executiveAnswersReceived.next(value);
  }

  getExecutiveAnswers(): Subject <Array<Answer>> {
    return this.executiveAnswersReceived;
  }


  /***
   * This function is to get and returns the questions from the innovation.
   */
   getPresets(innovation: Innovation): Array<Question> {

    innovation.preset.sections.forEach((section: Section) => {
      this.questions = this.questions.concat(section.questions);
    });

    return this.questions;

  }

  rectifyAnswerData() {

  }

}
