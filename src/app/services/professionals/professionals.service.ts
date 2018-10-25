/**
 * Created by bastien on 19/12/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import { Professional } from '../../models/professional';

@Injectable()
export class ProfessionalsService {

  constructor(private _http: Http) {
  }

  public create(professionalArray: Array<Professional>, campaignId: string, innovationId: string): Observable<any> {
    return this._http.post(`/professional/create/${campaignId}/${innovationId}`, {professionals: professionalArray})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<any> {
    return this._http.get('/professional/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(config: any): Observable<any> {
    return this._http.get('/professional/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(professionalId: string): Observable<any> {
    return this._http.delete('/professional/' + professionalId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public save(professionalId: string, professionalObj: Professional): Observable<any> {
    return this._http.put('/professional/' + professionalId, professionalObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public addFromRequest(config: any): Observable<any> {
    return this._http.post(`/professional/addFromRequest/${config.newCampaignId}/${config.newInnovationId}`, config)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public export(config: any): Observable<any> {
    return this._http.post(`/professional/exportCSV`, config)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public importProsFromCampaign(oldCampaignId: string, newCampaignId: string, oldInnovationId: string, newInnovationId: string): Observable<any> {
    const config = {
      professionals: "all",
      query: {}
    };
    return this._http.post(`/professional/clone/${oldCampaignId}/${newCampaignId}/${oldInnovationId}/${newInnovationId}`, config)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }
}
