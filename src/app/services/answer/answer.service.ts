import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import {Answer} from '../../models/answer';

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

  public getAll(config: any): Observable<Array<Answer>> {
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
}
