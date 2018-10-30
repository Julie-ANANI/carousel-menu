import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Answer } from '../../models/answer';
import { Tag } from '../../models/tag';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AnswerService {

  constructor(private _http: HttpClient) {
  }

  public create(answerObj: Answer): Observable<any> {
    return this._http.post('/answer', answerObj);
  }

  public get(id: string): Observable<Answer> {
    return this._http.get<Answer>('/answer/' + id);
  }

  public getAll(config: {[header: string]: string | string[]}): Observable<{result: Array<Answer>, _metadata: any}> {
    return this._http.get<{result: Array<Answer>, _metadata: any}>('/answer/', {params: config});
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
    return this._http.get<{answers: Array<Answer>}>('/innovation/' + innovationId + '/validAnswers');
  }

  public exportAsCsv(campaignId: string, client: Boolean): void {
    const url = environment.apiUrl + '/campaign/' + campaignId + '/exportAnswers' + (client ? '?client=true' : '');
    window.open(url);
  }

  public importFromGmail(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this._http.post('/innovation/importAnswers', formData);
  }

  public importAsCsv(campaignId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this._http.post('/campaign/' + campaignId + '/importAnswers', formData);
  }

  public importFromQuiz(answer: any): Observable<any> {
    return this._http.post(`/campaign/${answer.campaignId}/answer`, answer);
  }
}
