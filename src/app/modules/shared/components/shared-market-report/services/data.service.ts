import { Injectable } from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { Question } from '../../../../../models/question';
import { Tag } from '../../../../../models/tag';
import { Observable, BehaviorSubject } from 'rxjs';
import { ResponseService } from './response.service';

@Injectable()
export class DataService {

  private answersToShow: {[questionId: string]: BehaviorSubject<Array<Answer>>} = {};

  public answersTagsLists: {[questionId: string]: Array<Tag>} = {};

  public getAnswers(question: Question): Observable<Array<Answer>> {
    return this.answersToShow[question._id].asObservable();
  }

  public setAnswers(question: Question, answers: Array<Answer>): void {
    if (!this.answersToShow[question._id]) {
      this.answersToShow[question._id] = new BehaviorSubject(answers);
    } else {
      this.answersToShow[question._id].next(answers);
    }

    /* Update tags */
    this.updateTagsList(question);
  }

  public updateTagsList(question: Question) {
    const answers = this.answersToShow[question._id].getValue();
    this.answersTagsLists[question._id] = ResponseService.getTagsList(answers, question);
  }

}
