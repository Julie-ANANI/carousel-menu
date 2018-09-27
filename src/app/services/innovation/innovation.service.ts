import { Injectable } from '@angular/core';
import { Http, Response } from '../http.service';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campaign } from '../../models/campaign';
import { Innovation } from '../../models/innovation';
import { InnovCard } from '../../models/innov-card';
import { User } from '../../models/user.model';
import { Media, Video } from '../../models/media';
import { QuestionReport } from '../../models/market-report';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class InnovationService {

  constructor(private _http: Http) {
  }

  public create(innovationObj: Innovation): Observable<Innovation> {
    return this._http.post('/innovation', innovationObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public get(id: string): Observable<Innovation> {
    return this._http.get('/innovation/' + id)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getAll(config: any): Observable<{result: Array<Innovation>, _metadata: any}> {
    return this._http.get('/innovation/', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public createInnovationCard(innovationId: string, innovationCardObj: InnovCard): Observable<InnovCard> {
    return this._http.post('/innovation/' + innovationId + '/innovationCard', innovationCardObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public campaigns(innovationId: string): Observable<{result: Array<Campaign>}> {
    return this._http.get('/innovation/' + innovationId + '/campaigns')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public changePrincipalCard(innovationId: string, newPrincipalInnovationCardId: string): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/newPrincipalInnovationCard/' + newPrincipalInnovationCardId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public addNewMediaVideoToInnovationCard(innovationId: string, innovationCardId: string, videoInfos: Video): Observable<Media> {
    return this._http.post('/innovation/' + innovationId + '/innovationCard/' + innovationCardId + '/media/video', videoInfos)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public deleteMediaOfInnovationCard(innovationId: string, innovationCardId: string, mediaId: string): Observable<Innovation> {
    return this._http.delete('/innovation/' + innovationId + '/innovationCard/' + innovationCardId + '/media/' + mediaId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public setPrincipalMediaOfInnovationCard(innovationId: string, innovationCardId: string, mediaId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/innovationCard/' + innovationCardId + '/media/' + mediaId + '/principal')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public removeInnovationCard(innovationId: string, innovationCardId: string): Observable<any> {
    return this._http.delete('/innovation/' + innovationId + '/innovationCard/' + innovationCardId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getInnovationCard(innovationCardId: string): Observable<InnovCard> {
    return this._http.get('/innovation/card/' + innovationCardId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getInnovationCardByLanguage(innovationId: string, lang: string): Observable<InnovCard> {
    return this._http.get('/innovation/' + innovationId + '/card', { params: {lang: lang }})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public remove(innovationId: string): Observable<any> {
    return this._http.delete('/innovation/' + innovationId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public save(innovationId: string, innovationObj: Innovation): Observable<Innovation> {
    return this._http.put('/innovation/' + innovationId, innovationObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public updateMarketReport(innovationId: string, data: QuestionReport): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/marketReport', { payload: data })
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public updatePreset(innovationId: string, data: any): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/updatePreset', {preset: data})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public updateStatus(innovationId: string, status: 'EDITING' | 'SUBMITTED' | 'EVALUATING' | 'DONE'): Observable<Innovation> {
    return this._http.put('/innovation/' + innovationId, {status: status})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public submitProjectToValidation (innovationId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/submit')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public sendMailToOwner(innovationId: string, mail: any): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/sendMailToOwner', {mail: mail})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public validate(innovationId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/changeStatus?status=EVALUATING')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public askRevision(innovationId: string): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/changeStatus?status=EDITING')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public inviteCollaborators(innovationId: string, collaboratorsEmails: string): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/invite', {
      collaborators: collaboratorsEmails
    }).pipe(
      map((res: Response) => res.json()),
      catchError((error: Response) => throwError(error.text()))
    );
  }


  public removeCollaborator(innovationId: string, collaborator: User): Observable<any> {
    return this._http.delete('/innovation/' + innovationId + '/collaborator/' + collaborator.id)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }


  public createQuiz(innovationId: string): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/quiz')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  /**
   * URL sent to people when we invite them to sign in to UMI
   * When we want to add them as Collaborator
   */
  public getInvitationUrl (): string {
    return encodeURIComponent(`${environment.innovationUrl}/#/signup?invitation=true`);
  }

}
