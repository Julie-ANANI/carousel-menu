import { Injectable } from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { Tag } from '../../../../../models/tag';
import { Observable, BehaviorSubject } from 'rxjs';
import { ResponseService } from './response.service';

@Injectable({ providedIn: 'root' })
export class DataService {

  private answersToShow: {[questionId: string]: BehaviorSubject<Array<Answer>>} = {};

  public answersTagsLists: {[questionId: string]: Array<Tag>} = {};

  public getAnswers(question: any): Observable<Array<Answer>> {
    return this.answersToShow[question.identifier].asObservable();
  }

  public setAnswers(question: any, answers: Array<Answer>): void {
    if (!this.answersToShow[question.identifier]) {
      this.answersToShow[question.identifier] = new BehaviorSubject(answers);
    } else {
      this.answersToShow[question.identifier].next(answers);
    }

    /* Update tags */
    this.updateTagsList(question);
  }

  public updateTagsList(question: any) {
    const answers = this.answersToShow[question.identifier].getValue();
    this.answersTagsLists[question.identifier] = ResponseService.tagsList(answers, question);
  }

}
