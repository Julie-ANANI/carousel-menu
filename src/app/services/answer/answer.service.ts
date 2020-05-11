import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Answer } from '../../models/answer';
import { Tag } from '../../models/tag';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
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

  public getSectorAnswer(tags: Array<string>): Observable<{result: Array<Answer>, _metadata: any}> {
    return this._http.get<{result: Array<Answer>, _metadata: any}>('/answer/sectors', {params: {tags: tags}});
  }

  public remove(answerId: string): Observable<any> {
    return this._http.delete('/answer/' + answerId);
  }

  public save(answerId: string, answerObj: any): Observable<any> {
    return this._http.put('/answer/' + answerId, answerObj);
  }

  public addTag(answerId: string, tagId: string, questionId?: string): Observable<any> {
    const params: {[param: string]: string | string[]} = {tag: tagId };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.post('/answer/' + answerId + '/tag', { params: params});
  }

  public createTag(answerId: string, tag: Tag, questionId?: string): Observable<Tag> {
    const params: any = { tag: tag };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.post<Tag>('/answer/' + answerId + '/new-tag', { params: params});
  }

  public removeTag(answerId: string, tagId: string, questionId?: string): Observable<any> {
    const params: {[param: string]: string | string[]} = {tag: tagId };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.delete('/answer/' + answerId + '/tag', { params: params});
  }

  public getInnovationValidAnswers(innovationId: string, anonymous?: boolean): Observable<{answers: Array<Answer>}> {
    return this._http.get<{answers: Array<Answer>}>(`/innovation/${innovationId}/validAnswers${anonymous ? '?anonymous=' + !!anonymous : ''}`);
  }

  public exportAsCsvByCampaign(campaignId: string, client: Boolean): void {
    const url = environment.apiUrl + '/campaign/' + campaignId + '/exportAnswers' + (client ? '?client=true' : '');
    window.open(url);
  }

  public getExportUrl(innovationId: string, client: boolean, anonymous?: boolean): string {
    const query = [];
    if (client !== undefined) {
      query.push(`client=${!!client}`);
    }
    if (anonymous) {
      query.push(`anonymous=${!!anonymous}`);
    }
    const _query = query.join('&');
    return environment.apiUrl + '/innovation/' + innovationId + '/exportAnswers' + (_query.length ? '?' + _query : '');
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

  public answerReassign(campaignId: string, quizAnswerId: string, answerId: string, newPro: any): Observable<any> {
    const body = {
      answerId: quizAnswerId,
      answerUmiAppId: answerId,
      user: newPro
    };
    return this._http.post(`/campaign/${campaignId}/answerReassign`, body);
  }

  public updateLinkingStatus(arrayAnswers: Array<string>, newStatus: string): Observable<any> {
    return this._http.post('/answer/update/followUp', {status: newStatus, answers: arrayAnswers});
  }
}
