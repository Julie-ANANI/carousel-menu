import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import { Answer } from '../../models/answer';
import { Tag } from '../../models/tag';
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

  public addTag(answerId: string, tagId: string, questionId?: string): Observable<Answer> {
    const params = {tag: tagId };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.post('/answer/' + answerId + '/tag', { params: params})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public createTag(answerId: string, tag: Tag, questionId?: string): Observable<Answer> {
    const params = {tag: tag };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.post('/answer/' + answerId + '/new-tag', { params: params})
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

  public exportAsCsvByCampaign(campaignId: string, client: Boolean): void {
    const url = environment.apiUrl + '/campaign/' + campaignId + '/exportAnswers' + (client ? '?client=true' : '');
    window.open(url);
  }

  public getExportUrl(innovationId: string, client: Boolean): string {
    return environment.apiUrl + '/innovation/' + innovationId + '/exportAnswers' + (client ? '?client=true' : '');
  }

  public getReportUrl(innovationId: string, lang: string): string {
    //reporting/job/answers/5b61b37ed45f9857394a9a1f?lang=fr
    return environment.apiUrl + '/reporting/job/answers/' + innovationId + (lang ? `?lang=${lang}` : '?lang=en');
  }

  public importFromGmail(file: File): Observable<any> {
    const url = environment.apiUrl + '/innovation/importAnswers';
    return this._http.upload(url, file)
      .map((res: Response) => <string>res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public importAsCsv(campaignId: string, file: File): Observable<any> {
    const url = environment.apiUrl + '/campaign/' + campaignId + '/importAnswers';
    return this._http.upload(url, file)
      .map((res: Response) => <string>res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public importFromQuiz(answer: any): Observable<any> {
    return this._http.post(`/campaign/${answer.campaignId}/answer`, answer)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }
}
