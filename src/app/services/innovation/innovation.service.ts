import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campaign } from '../../models/campaign';
import { Innovation } from '../../models/innovation';
import { InnovCard } from '../../models/innov-card';
import { User } from '../../models/user.model';
import { Video } from '../../models/media';
import { QuestionReport } from '../../models/market-report';
import {Professional} from "../../models/professional";

@Injectable()
export class InnovationService {

  constructor(private _http: HttpClient) {
  }

  public create(innovationObj: Innovation): Observable<any> {
    return this._http.post('/innovation', innovationObj);
  }

  public get(id: string, config?: any): Observable<Innovation> {
    return this._http.get('/innovation/' + id, {params: config});
  }

  public getAll(params: {[header: string]: string | string[]}): Observable<{result: Array<Innovation>, _metadata: any}> {
    return this._http.get<{result: Array<Innovation>, _metadata: any}>('/innovation/', {params: params});
  }

  public createInnovationCard(innovationId: string, innovationCardObj: InnovCard): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/innovationCard', innovationCardObj);
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

  public getInnovationCardByLanguage(innovationId: string, lang: string): Observable<InnovCard> {
    return this._http.get<InnovCard>('/innovation/' + innovationId + '/card', { params: {lang: lang }});
  }

  public remove(innovationId: string): Observable<any> {
    return this._http.delete('/innovation/' + innovationId);
  }

  public save(innovationId: string, innovationObj: Innovation): Observable<any> {
    return this._http.put('/innovation/' + innovationId, innovationObj);
  }

  public updateMarketReport(innovationId: string, data: QuestionReport): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/marketReport', { payload: data });
  }

  public updatePreset(innovationId: string, data: any): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/updatePreset', {preset: data});
  }

  public submitProjectToValidation (innovationId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/submit', {});
  }

  public sendMailToOwner(innovationId: string, mail: any): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/sendMailToOwner', {mail: mail});
  }

  public validate(innovationId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/changeStatus?status=EVALUATING', {});
  }

  public endProject(innovationId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/changeStatus?status=DONE', {});
  }

  public askRevision(innovationId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/changeStatus?status=EDITING', {});
  }

  public inviteCollaborators(innovationId: string, collaboratorsEmails: string): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/invite', {
      collaborators: collaboratorsEmails
    });
  }


  public removeCollaborator(innovationId: string, collaborator: User): Observable<any> {
    return this._http.delete('/innovation/' + innovationId + '/collaborator/' + collaborator.id);
  }


  public createQuiz(innovationId: string): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/quiz', {});
  }

  /**
   * URL sent to people when we invite them to sign in to UMI
   * When we want to add them as Collaborator
   */
  public getInvitationUrl (): string {
    return encodeURIComponent(`${environment.clientUrl}/signup?invitation=true`);
  }

  public getSharedSynthesis(id: string, sharedKey: string): Observable<any> {
    return this._http.get(`/sharing/synthesis/${id}/${sharedKey}`);
  }

  public getRecommendation(innovationId: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/match');
  }

  public getRecommendedInnovations(innovationId: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/similar');
  }

  public addProsFromCommunity(professionalArray: Array<Professional>, innovationId: string): Observable<any> {
    return this._http.post(`/innovation/${innovationId}/addAmbassador`, {
      selectedProfessionals: professionalArray
    });
  }

}
