import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class InnovationService {

  constructor(private _http: Http) {
  }

  public create(innovationObj: any): Observable<any> {
    return this._http.post('/innovation', innovationObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<any> {
    return this._http.get('/innovation/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(): Observable<any> {
    return this._http.get('/innovation/')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public createInnovationCard(innovationId: string, innovationCardObj: any): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/innovationCard', innovationCardObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public changePrincipalCard(innovationId: string, newPrincpalInnovationCardId: string): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/newPrincipalInnovationCard/' + newPrincpalInnovationCardId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public addMediaToInnovationCard(innovationId: string, innovationCardId: string, mediaId: string): Observable<any> {
    return this._http.post('/innovation/' + innovationId + '/innovationCard/' + innovationCardId + '/media/' + mediaId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public deleteMediaOfInnovationCard(innovationId: string, innovationCardId: string, mediaId: string): Observable<any> {
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

  public getInnovationCard(innovationCardId: string): Observable<any> {
    return this._http.get('/innovation/card/' + innovationCardId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getInnovationCardByLanguage(innovationId: string, lang: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/card', { params: {lang: lang }})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getInnovationSythesis(innovationId: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/synthesis')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(innovationId: string): Observable<any> {
    return this._http.delete('/innovation/' + innovationId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public save(innovationId: string, delta: any, innovationCardId?: any): Observable<any> {
    return this._http.put('/innovation/' + innovationId, { delta: delta, innovationCardId: innovationCardId })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public updateSynthesis(innovationId: string, data: any): Observable<any> {
    return this._http.put('/innovation/' + innovationId + '/synthesis', { payload: data })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public recalculateSynthesis(innovationId: string): Observable<any> {
    return this._http.get('/innovation/' + innovationId + '/recalculateSynthesis')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public submitProjectToValidation (innovationId: string) {
    return this._http.put('/innovation/' + innovationId + '/submit')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public exportPDF(innovationId: string, innovationCardId: string, jobOptions: any) {
    return this._http.get(`/innovation/${innovationId}/exportInventionCard/${innovationCardId}`, jobOptions)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

}
