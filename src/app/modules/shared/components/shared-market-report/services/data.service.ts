import { Injectable } from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { Tag } from '../../../../../models/tag';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DataService {

  private answersToShow: {[questionId: string]: Subject<Array<Answer>>} = {};

  public answersTagsLists: {[questionId: string]: Array<Tag>} = {};

  public getAnswers(questionId: string): Observable<Array<Answer>> {
    return this.answersToShow[questionId].asObservable();
  }

  public setAnswers(questionId: string, answers: Array<Answer>): void {
    if (!this.answersToShow[questionId]) {
      this.answersToShow[questionId] = new Subject();
    }
    this.answersToShow[questionId].next(answers);
  }

}
