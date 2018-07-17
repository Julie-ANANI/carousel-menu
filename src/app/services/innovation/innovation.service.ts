import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Campaign } from '../../models/campaign';
import { Innovation } from '../../models/innovation';
import { InnovCard } from '../../models/innov-card';
import { User } from '../../models/user.model';
import { Media, Video } from '../../models/media';
import { QuestionReport } from '../../models/market-report';

@Injectable()
export class InnovationService {

  constructor(private _http: Http) {
  }

  public create(innovationObj: Innovation): Observable<Innovation> {
    return this._http.post('/innovation', innovationObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<Innovation> {
    return this._http.get('/innovation/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(config: any): Observable<{result: Array<Innovation>, _metadata: any}> {
    return this._http.get('/innovation/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public createInnovationCard(innovationId: string, innovationCardObj: InnovCard): Observable<InnovCard> {
    return this._http.post('/innovation/' + innovationId + '/innovationCard', innovationCardObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public campaigns(innovationId: string): Observable<{result: Array<Campaign>}> {
    return this._http.get('/innovation/' + innovationId + '/campaigns')
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.text()));
  }

  public changePrincipalCard(innovationId: string, newPrincipalInnovationCardId: string): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/newPrincipalInnovationCard/' + newPrincipalInnovationCardId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public addNewMediaVideoToInnovationCard(innovationId: string, innovationCardId: string, videoInfos: Video): Observable<Media> {
    return this._http.post('/innovation/' + innovationId + '/innovationCard/' + innovationCardId + '/media/video', videoInfos)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public deleteMediaOfInnovationCard(innovationId: string, innovationCardId: string, mediaId: string): Observable<Innovation> {
    return this._http.delete('/innovation/' + innovationId + '/innovationCard/' + innovationCardId + '/media/' + mediaId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public setPrincipalMediaOfInnovationCard(innovationId: string, innovationCardId: string, mediaId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/innovationCard/' + innovationCardId + '/media/' + mediaId + '/principal')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public removeInnovationCard(innovationId: string, innovationCardId: string): Observable<any> {
    return this._http.delete('/innovation/' + innovationId + '/innovationCard/' + innovationCardId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getInnovationCard(innovationCardId: string): Observable<InnovCard> {
    return this._http.get('/innovation/card/' + innovationCardId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getInnovationCardByLanguage(innovationId: string, lang: string): Observable<InnovCard> {
    return this._http.get('/innovation/' + innovationId + '/card', { params: {lang: lang }})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public addTag(innovationId: string, tagId: string): Observable<Innovation> {
    return this._http.post('/innovation/' + innovationId + '/tag', { params: {tag: tagId }})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public removeTag(innovationId: string, tagId: string): Observable<Innovation> {
    return this._http.delete('/innovation/' + innovationId + '/tag', { params: {tag: tagId }})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(innovationId: string): Observable<any> {
    return this._http.delete('/innovation/' + innovationId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public save(innovationId: string, innovationObj: Innovation): Observable<Innovation> {
    return this._http.put('/innovation/' + innovationId, innovationObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public updateMarketReport(innovationId: string, data: QuestionReport): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/marketReport', { payload: data })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public updatePreset(innovationId: string, data: any): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/updatePreset', {data})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }
  public updateSettingsDomain(innovationId: string, domain: any): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/updateSettingsDomain', {domain})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public updateStatus(innovationId: string, status: 'EDITING' | 'SUBMITTED' | 'EVALUATING' | 'DONE'): Observable<Innovation> {
    return this._http.put('/innovation/' + innovationId, {status: status})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public exportSynthesis(innovationId: string, lang: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/exportSynthesis?lang=' + lang)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public submitProjectToValidation (innovationId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/submit')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public exportPDF(innovationId: string, innovationCardId: string, jobOptions: any): Observable<any> {
    return this._http.get(`/innovation/${innovationId}/exportInventionCard/${innovationCardId}`, jobOptions)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public setOperator(innovationId: string, operatorId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/operator', {operatorId: operatorId})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public validate(innovationId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/changeStatus?status=EVALUATING')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public askRevision(innovationId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/changeStatus?status=EDITING')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public inviteCollaborators(innovationId: string, collaboratorsEmails: string): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/invite', {
      collaborators: collaboratorsEmails
    }).map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }


  public removeCollaborator(innovationId: string, collaborator: User): Observable<any> {
    return this._http.delete('/innovation/' + innovationId + '/collaborator/' + collaborator.id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }


  public createQuiz(innovationId: string): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/quiz')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  /**
   * URL sent to people when we invite them to sign in to UMI
   * When we want to add them as Collaborator
   */
  public getInvitationUrl (): string {
    return encodeURIComponent(`${environment.innovationUrl}/#/signup?invitation=true`);
  }

}
