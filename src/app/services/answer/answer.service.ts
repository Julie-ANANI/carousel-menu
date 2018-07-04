import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import { Answer } from '../../models/answer';
import { environment } from '../../../environments/environment';

@Injectable()
export class AnswerService {

  constructor(private _http: Http) {
  }

  public create(answerObj: Answer): Observable<Answer> {
    return this._http.post('/answer', answerObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<Answer> {
    return this._http.get('/answer/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(config: any): Observable<{result: Array<Answer>, _metadata: any}> {
    return this._http.get('/answer/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(answerId: string): Observable<any> {
    return this._http.delete('/answer/' + answerId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public save(answerId: string, answerObj: Answer): Observable<Answer> {
    return this._http.put('/answer/' + answerId, answerObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public changeStatus(answerId: string, status: string): Observable<any> {
    return this._http.post(`/answer/${answerId}/changeStatus`, { newStatus: status })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public addTag(answerId: string, tagId: string, questionId?: string): Observable<Answer> {
    const params = {tag: tagId };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.post('/answer/' + answerId + '/tag', { params: params})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public removeTag(answerId: string, tagId: string, questionId?: string): Observable<Answer> {
    const params = {tag: tagId };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.delete('/answer/' + answerId + '/tag', { params: params})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getInnovationValidAnswers(innovationId: string): Observable<{answers: Array<Answer>}> {
    return this._http.get('/innovation/' + innovationId + '/validAnswers')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public exportAsCsv(campaignId: string): void {
    const url = environment.apiUrl + '/campaign/' + campaignId + '/exportAnswers';
    window.open(url);
  }

  public importAsCsv(campaignId: string, file: File): Observable<any> {
    const url = environment.apiUrl + '/campaign/' + campaignId + '/importAnswers';
    return this._http.upload(url, file)
      .map((res: Response) => <string>res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }
}
