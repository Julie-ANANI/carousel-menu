import { Injectable } from '@angular/core';
import { Http, Response } from '../http.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Answer } from '../../models/answer';
import { Tag } from '../../models/tag';
import { environment } from '../../../environments/environment';

@Injectable()
export class AnswerService {

  constructor(private _http: Http) {
  }

  public create(answerObj: Answer): Observable<Answer> {
    return this._http.post('/answer', answerObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public get(id: string): Observable<Answer> {
    return this._http.get('/answer/' + id)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getAll(config: any): Observable<{result: Array<Answer>, _metadata: any}> {
    return this._http.get('/answer/', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public remove(answerId: string): Observable<any> {
    return this._http.delete('/answer/' + answerId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public save(answerId: string, answerObj: Answer): Observable<Answer> {
    return this._http.put('/answer/' + answerId, answerObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public addTag(answerId: string, tagId: string, questionId?: string): Observable<Answer> {
    const params = {tag: tagId };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.post('/answer/' + answerId + '/tag', { params: params})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public createTag(answerId: string, tag: Tag, questionId?: string): Observable<Answer> {
    const params = {tag: tag };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.post('/answer/' + answerId + '/new-tag', { params: params})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public removeTag(answerId: string, tagId: string, questionId?: string): Observable<Answer> {
    const params = {tag: tagId };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.delete('/answer/' + answerId + '/tag', { params: params})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getInnovationValidAnswers(innovationId: string): Observable<{answers: Array<Answer>}> {
    return this._http.get('/innovation/' + innovationId + '/validAnswers')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public exportAsCsv(campaignId: string): void {
    const url = environment.apiUrl + '/campaign/' + campaignId + '/exportAnswers';
    window.open(url);
  }

  public importFromGmail(file: File): Observable<any> {
    const url = environment.apiUrl + '/innovation/importAnswers';
    return this._http.upload(url, file)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public importAsCsv(campaignId: string, file: File): Observable<any> {
    const url = environment.apiUrl + '/campaign/' + campaignId + '/importAnswers';
    return this._http.upload(url, file)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public importFromQuiz(answer: any): Observable<any> {
    return this._http.post(`/campaign/${answer.campaignId}/answer`, answer)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }
}
