import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campaign } from '../../models/campaign';
import { Innovation } from '../../models/innovation';
import { InnovCard } from '../../models/innov-card';
import { Professional } from '../../models/professional';
import { User } from '../../models/user.model';
import { Video } from '../../models/media';
import { InnovCardComment } from '../../models/innov-card-comment';
import { Config } from '../../models/config';
import { Collaborator } from '../../models/collaborator';
import { Job, JobType } from '../../models/job';

@Injectable({providedIn: 'root'})
export class InnovationService {

  constructor(private _http: HttpClient) { }

  public create(innovationObj: Innovation): Observable<any> {
    return this._http.post('/innovation', innovationObj);
  }

  public get(id: string, config?: Config): Observable<Innovation> {
    return this._http.get<Innovation>('/innovation/' + id, {params: config});
  }

  public getAll(params: {[header: string]: string | string[]}): Observable<{result: Array<Innovation>, _metadata: any}> {
    return this._http.get<{result: Array<Innovation>, _metadata: any}>('/innovation/', {params: params});
  }

  public createInnovationCard(innovationId: string, innovationCardObj: InnovCard): Observable<InnovCard> {
    return this._http.post<InnovCard>('/innovation/' + innovationId + '/innovationCard', innovationCardObj);
  }

  public campaigns(innovationId: string): Observable<{result: Array<Campaign>}> {
    return this._http.get<{result: Array<Campaign>}>('/innovation/' + innovationId + '/campaigns');
  }

  public addNewMediaVideoToInnovationCard(innovationId: string, innovationCardId: string, videoInfos: Video): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/innovationCard/' + innovationCardId + '/media/video', videoInfos);
  }

  public deleteMediaOfInnovationCard(innovationId: string, innovationCardId: string, mediaId: string): Observable<any> {
    return this._http.delete('/innovation/' + innovationId + '/innovationCard/' + innovationCardId + '/media/' + mediaId);
  }

  public setPrincipalMediaOfInnovationCard(innovationId: string, innovationCardId: string, mediaId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/innovationCard/' + innovationCardId + '/media/' + mediaId + '/principal', {});
  }

  public removeInnovationCard(innovationId: string, innovationCardId: string): Observable<any> {
    return this._http.delete('/innovation/' + innovationId + '/innovationCard/' + innovationCardId);
  }

  public getInnovationCard(innovationCardId: string): Observable<InnovCard> {
    return this._http.get<InnovCard>('/innovation/card/' + innovationCardId);
  }

  public remove(innovationId: string): Observable<any> {
    return this._http.delete('/innovation/' + innovationId);
  }

  /*public save(innovationId: string, innovationObj: { [P in keyof Innovation]?: Innovation[P]; }): Observable<Innovation> {
    return this._http.put('/innovation/' + innovationId, innovationObj);
  }*/

  public save(innovationId: string, innovationObj: Innovation): Observable<Innovation> {
    return this._http.put<Innovation>('/innovation/' + innovationId, innovationObj);
  }

  public saveInnovationCardComment(innovationId: string, innovationCardId: string, commentObj: InnovCardComment): Observable<any> {
    return this._http.post(`/innovation/${innovationId}/card/${innovationCardId}/comment`, commentObj);
  }

  public saveConsent(innovationId: string, date: number) { /* FIXME */
    return this._http.put(`/innovation/${innovationId}/ownerConsent`, {ownerConsent: {date: date, value: true}});
  }

  public saveFilter(innovationId: string, data: { name: string, answers: Array<string>}): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/filter', data);
  }

  public getFiltersList(innovationId: string): Observable<any> {
    return this._http.get('/filter/innovation/' + innovationId);
  }

  public getFilter(innovationId: string, filterName: string): Observable<any> {
    return this._http.get('/filter/innovation/' + innovationId + '/' + filterName);
  }

  public deleteFilter(innovationId: string, filterName: string): Observable<any> {
    return this._http.delete('/filter/innovation/' + innovationId + '/' + filterName);
  }

  public sendMailToOwner(innovationId: string, mail: any): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/sendMailToOwner', {mail: mail});
  }

  public inviteCollaborators(innovationId: string, collaboratorsEmails: string): Observable<Collaborator> {
    return this._http.post<Collaborator>('/innovation/' + innovationId + '/invite', {
      collaborators: collaboratorsEmails
    });
  }

  public removeCollaborator(innovationId: string, collaborator: User): Observable<Array<User>> {
    return this._http.delete<Array<User>>('/innovation/' + innovationId + '/collaborator/' + collaborator.id);
  }

  public createQuiz(innovationId: string): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/quiz', {});
  }

  /**
   * URL sent to people when we invite them to sign in to UMI
   * When we want to add them as Collaborator
   */
  public getInvitationUrl (): string {
    return encodeURIComponent(`${environment.clientUrl}/register?invitation=true`);
  }

  public getSharedSynthesis(id: string, sharedKey: string): Observable<any> {
    return this._http.get(`/sharing/synthesis/${id}/${sharedKey}?fields=innovationCards`); //TODO I don't like hardcoded things
  }

  public getRecommendation(innovationId: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/match');
  }

  public addProsFromCommunity(professionalArray: Array<Professional>, innovationId: string): Observable<any> {
    return this._http.post(`/innovation/${innovationId}/addAmbassador`, {
      selectedProfessionals: professionalArray
    });
  }

  public shareSynthesis(projectId: string): Observable<any> {
    return this._http.post('/sharing', {id: projectId, type: 'synthesis'});
  }

  public static export(innovationId: string, params: string): string {
    return environment.apiUrl + `/innovation/${innovationId}/export?${params}`;
  }

  public import(file:File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, 'import_project');
    return this._http.post('/innovation/import/', formData);
  }

  public publishToCommunity(innovationId: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/communityPublish');
  }

  public updateFollowUpEmails(innovationId: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/updateFollowUpEmails');
  }

  public finishLinking(innovationId: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/linking');
  }

  public sendFollowUpEmails(innovationId: string, objective?: string): Observable<any> {
    const urlParams = objective ? `?objective=${objective}` : '';
    return this._http.get('/innovation/' + innovationId + '/sendFollowUpEmails' + urlParams);
  }

  public executiveReportPDF(innovationId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this._http.get(`/innovation/${innovationId}/executiveReportExport`, {headers: headers, responseType: 'blob'});
  }

  public getDeliverableJob(innovationId: string, type?: JobType): Observable<Array<Job>> {
    const config = { jobType: type };
    return this._http.get<Array<Job>>(`/innovation/${innovationId}/deliverables`, {params: config});
  }

  public updateStats(innovationId: string): Observable<any> {
    return this._http.put(`/innovation/${innovationId}/stats`, {});
  }

  public advancedSearch(params: {[header: string]: string | string[]}): Observable<{result: Array<Innovation>, _metadata: any}> {
    return this._http.get<{result: Array<Innovation>, _metadata: any}>('/innovation/advancedSearch', {params: params});
  }

}
