import { Injectable } from '@angular/core';
import { Http } from '../http.service';
import { Observable } from 'rxjs';
import { Answer } from '../../models/answer';
import { Tag } from '../../models/tag';
import { environment } from '../../../environments/environment';

@Injectable()
export class AnswerService {

  constructor(private _http: Http) {
  }

  public create(answerObj: Answer): Observable<any> {
    return this._http.post('/answer', answerObj);
  }

  public get(id: string): Observable<Answer> {
    return this._http.get('/answer/' + id);
  }

  public getAll(config: any): Observable<{result: Array<Answer>, _metadata: any}> {
    return this._http.get('/answer/', {params: config});
  }

  public remove(answerId: string): Observable<any> {
    return this._http.delete('/answer/' + answerId);
  }

  public save(answerId: string, answerObj: Answer): Observable<any> {
    return this._http.put('/answer/' + answerId, answerObj);
  }

  public addTag(answerId: string, tagId: string, questionId?: string): Observable<any> {
    const params = {tag: tagId };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.post('/answer/' + answerId + '/tag', { params: params});
  }

  public createTag(answerId: string, tag: Tag, questionId?: string): Observable<any> {
    const params = {tag: tag };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.post('/answer/' + answerId + '/new-tag', { params: params});
  }

  public removeTag(answerId: string, tagId: string, questionId?: string): Observable<any> {
    const params = {tag: tagId };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.delete('/answer/' + answerId + '/tag', { params: params});
  }

  public getInnovationValidAnswers(innovationId: string): Observable<{answers: Array<Answer>}> {
    return this._http.get('/innovation/' + innovationId + '/validAnswers');
  }

  public exportAsCsv(campaignId: string): void {
    const url = environment.apiUrl + '/campaign/' + campaignId + '/exportAnswers';
    window.open(url);
  }

  public importFromGmail(file: File): Observable<any> {
    const url = environment.apiUrl + '/innovation/importAnswers';
    return this._http.upload(url, file);
  }

  public importAsCsv(campaignId: string, file: File): Observable<any> {
    const url = environment.apiUrl + '/campaign/' + campaignId + '/importAnswers';
    return this._http.upload(url, file);
  }

  public importFromQuiz(answer: any): Observable<any> {
    return this._http.post(`/campaign/${answer.campaignId}/answer`, answer);
  }
}
