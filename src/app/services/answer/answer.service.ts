import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Answer } from '../../models/answer';
import { Tag } from '../../models/tag';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AnswerService {

  private baseUrl = '/answers'

  constructor(private _http: HttpClient) { }

  public get(id: string): Observable<Answer> {
    return this._http.get<Answer>(`${this.baseUrl}/${id}`);
  }

  public getAll(config: {[header: string]: string | string[]}): Observable<{result: Array<Answer>, _metadata: any}> {
    return this._http.get<{result: Array<Answer>, _metadata: any}>(`${this.baseUrl}`, {params: config});
  }

  public getSectorAnswer(tags: Array<string>): Observable<{result: Array<Answer>, _metadata: any}> {
    return this._http.get<{result: Array<Answer>, _metadata: any}>(`${this.baseUrl}/sectors`, {params: {tags: tags}});
  }

  public remove(answerId: string): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${answerId}`);
  }

  public save(answerId: string, answerObj: any): Observable<any> {
    return this._http.put(`${this.baseUrl}/${answerId}`, answerObj);
  }

  public addTag(answerId: string, tag: Tag, questionId?: string): Observable<any> {
    const params: {tag: Tag} = {tag: tag };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.post(`${this.baseUrl}/${answerId}/tag`, { params: params});
  }

  public removeTag(answerId: string, tagId: string, questionId?: string): Observable<any> {
    const params: {[param: string]: string | string[]} = {tag: tagId };
    if (questionId) { params['questionId'] = questionId; }
    return this._http.delete(`${this.baseUrl}/${answerId}/tag`, { params: params});
  }

  public exportAsCsvByCampaign(campaignId: string, client: Boolean): void {
    const url = environment.apiUrl + '/campaign/' + campaignId + '/exportAnswers' + (client ? '?client=true' : '');
    window.open(url);
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
    return this._http.post('/answer/followUp', {status: newStatus, answers: arrayAnswers});
  }

  public exportAsPDF(innovationId: string, lang: string) {
    return `${environment.apiUrl}/reporting/job/answers/${innovationId}?lang=${lang}&print=1`;
  }

}
