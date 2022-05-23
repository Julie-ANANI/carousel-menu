import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
import {Campaign} from '../../models/campaign';
import {Innovation} from '../../models/innovation';
import {InnovCard, InnovCardComment} from '../../models/innov-card';
import {Professional} from '../../models/professional';
import {User} from '../../models/user.model';
import {Collaborator} from '../../models/collaborator';
import {Job, JobType} from '../../models/job';
import {SharedFilter} from '../../modules/shared/components/shared-market-report/models/shared-filter';
import {Community} from '../../models/community';
import { FamilyEnterprises } from '../../modules/sidebars/components/sidebar-blacklist/sidebar-blacklist.component';
import {Invitation} from '../../models/invitation';
import {Response} from '../../models/response';
import {UmiusConfigInterface, UmiusVideoInterface} from '@umius/umi-common-component';
import {CacheType} from '../../models/cache';
import {Consent} from '../../models/consent';
import { Language } from "../../models/static-data/language";

@Injectable({providedIn: 'root'})
export class InnovationService {

  public static export(innovationId: string, params: string): string {
    return environment.apiUrl + `/innovation/${innovationId}/export?${params}`;
  }

  constructor(private _http: HttpClient) { }

  public create(innovationObj: Innovation): Observable<any> {
    return this._http.post('/innovation', innovationObj);
  }

  public get(id: string, config?: UmiusConfigInterface, cache: CacheType = 'reset'): Observable<Innovation> {
    return this._http.get<Innovation>('/innovation/' + id, {params: config, headers: new HttpHeaders().set('cache', cache)});
  }

  public getAll(params: {[header: string]: string | string[]}): Observable<{result: Array<Innovation>, _metadata: any}> {
    return this._http.get<{result: Array<Innovation>, _metadata: any}>('/innovation/', {params: params});
  }

  public getMarketTests(params: {[header: string]: string | string[]}, cache: CacheType = 'reset'):
    Observable<{result: Array<Innovation>, _metadata: any}> {
    return this._http.get<{result: Array<Innovation>, _metadata: any}>('/innovation/queryable',
      {params: params, headers: new HttpHeaders().set('cache', cache)});
  }

  /**
   * create innovation card with several languages
   * @param innovationId
   * @param innovationCardObj
   * @param languagesToAdd
   */
  public createInnovationCard(innovationId: string, innovationCardObj: InnovCard, languagesToAdd: Array<Language> = []): Observable<Array<InnovCard>> {
    const body = {
      innovationCardObj: innovationCardObj,
      languages: languagesToAdd
    }
    return this._http.post<Array<InnovCard>>('/innovation/' + innovationId + '/innovationCard', body);
  }

  public campaigns(innovationId: string): Observable<{result: Array<Campaign>}> {
    // We specify the limit in the query to avoid the default value of 10
    // 50 should be enough, if one day the ops need more campaigns, please send me a mail it'll make me laugh
    return this._http.get<{result: Array<Campaign>}>('/innovation/' + innovationId + '/campaigns?limit=50');
  }

  public addNewMediaVideoToInnovationCard(innovationId: string, innovationCardId: string, videoInfos: UmiusVideoInterface): Observable<any> {
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

  public editLanguageStatus(innovationId: string, innovationCardId: string, body: object): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/innovationCard/' + innovationCardId + '/changeStatus', body);
  }

  public removeLanguage(innovationId: string, languages: string[]): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/languages/', {languages: languages});
  }

  /**
   *
   * @param innovationCardId - get the card form the route '/innovation/card/:innovationCardId'
   */
  public getInnovationCard(innovationCardId: string): Observable<InnovCard> {
    return this._http.get<InnovCard>('/innovation/card/' + innovationCardId);
  }

  /**
   * getting the innovation cards by the innovation reference.
   *
   * @param innovationId
   */
  public getInnovCardsByReference(innovationId: string): Observable<Array<InnovCard>> {
    const params = {
      innovationId: innovationId
    };
    return this._http.get<Array<InnovCard>>('/innovation/innovationCard/', {params: params});
  }

  public remove(innovationId: string): Observable<any> {
    return this._http.delete('/innovation/' + innovationId);
  }

  public save(innovationId: string, innovationObj: { [P in keyof Innovation]?: Innovation[P]; }): Observable<Innovation> {
    const _fieldsToPopulate = ['tags', 'mission', 'owner', 'operator', 'collaborators', 'statusLogs', 'clientProject',
      'principalMedia', 'innovationCards', 'campaigns', 'settings', 'status', 'name', 'created'];
    return this._http.put<Innovation>(
      `/innovation/${innovationId}?fields=${_fieldsToPopulate.join(',')}`, innovationObj
    );
  }

  public saveInnovationCardComment(innovationId: string, innovationCardId: string, commentObj: InnovCardComment): Observable<any> {
    return this._http.post(`/innovation/${innovationId}/card/${innovationCardId}/comment`, commentObj);
  }

  public saveConsent(innovationId: string, data: Consent): Observable<Innovation> { /* FIXME */
    return this._http.put<Innovation>(`/innovation/${innovationId}/ownerConsent`, {ownerConsent: data});
  }

  public saveFilter(innovationId: string, data: { name: string, answers: Array<string>}): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/filter', data);
  }

  public updateFilter(innovationId: string, data: SharedFilter, filterName: string): Observable<any> {
    return this._http.put('/filter/innovation/' + innovationId + '/' + filterName, data);
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

  public getPendingCollaborators(innovationId: string): Observable<Response> {
    const config: UmiusConfigInterface = {
      limit: '-1',
      offset: '0',
      search: '{}',
      sort: '{ "created": -1 }',
      fields: 'invitee_email',
      $and: JSON.stringify([{innovation: innovationId}, {invitation_used: false}]),
    };
    return this._http.get<Response>('/invitation', {params: config});
  }

  public removePendingCollaborator(invitee_email: string, innovationId: string): Observable<Invitation> {
    const data = {invitee_email, innovationId};
    return this._http.put<Invitation>(`/invitation/removePendingCollaborator`, data);
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

  public getSharedSynthesis(id: string, sharedKey: string): Observable<Innovation> {
    return this._http.get<Innovation>(`/sharing/synthesis/${id}/${sharedKey}?fields=innovationCards,principalMedia,tags,mission,
    owner, operator,clientProject`); // TODO I don't like hardcoded things
  }

  public getRecommendation(innovationId: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/match');
  }

  public addProsFromCommunity(professionalArray: Array<Professional>, innovationId: string): Observable<any> {
    return this._http.post(`/innovation/${innovationId}/addAmbassador`, {
      selectedProfessionals: professionalArray
    });
  }

  public changeVisibility(innovationId: string, innovationCardId: string, body: object): Observable<any>{
    return this._http.put(`/innovation/${innovationId}/innovationCard/${innovationCardId}/changeLanguageVisibility`, body);
  }

  public shareSynthesis(projectId: string): Observable<any> {
    return this._http.post('/sharing', {id: projectId, type: 'synthesis'});
  }

  public import(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, 'import_project');
    return this._http.post('/innovation/import/', formData);
  }

  public publishToCommunity(innovationId: string, data: any): Observable<{community: Community, published: Date}> {
    return this._http.post<{community: Community, published: Date}>('/innovation/' + innovationId + '/communityPublish', data);
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

  public updateFollowUp(innovationId: string, answersId: Array<string>, newStatus: string): Observable<any> {
    return this._http.post<any>(`/innovation/${innovationId}/updateFollowUp`, {status: newStatus, answers: answersId});
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

  public updateStats(innovationId: string): Observable<Innovation> {
    return this._http.put<Innovation>(`/innovation/${innovationId}/stats`, {});
  }

  public advancedSearch(params: {[header: string]: string | string[]}): Observable<{result: Array<Innovation>, _metadata: any}> {
    return this._http.get<{result: Array<Innovation>, _metadata: any}>('/innovation/advancedSearch', {params: params});
  }

  public repartition(innovationId: string, config: any): Observable<any> {
    return this._http.get(`/innovation/${innovationId}/prosRepartition`, {params: config});
  }

  public autoBlacklist(innovationId: string): Observable<FamilyEnterprises> {
    return this._http.get<FamilyEnterprises>(`/innovation/${innovationId}/autoBlacklist`);
  }

}
