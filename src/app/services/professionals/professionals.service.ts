/**
 * Created by bastien on 19/12/2017.
 */
import { Injectable } from '@angular/core';
import { Http } from '../http.service';
import { Observable } from 'rxjs';
import { Professional } from '../../models/professional';

@Injectable()
export class ProfessionalsService {

  constructor(private _http: Http) {
  }

  public create(professionalArray: Array<Professional>, campaignId: string, innovationId: string): Observable<any> {
    return this._http.post(`/professional/create/${campaignId}/${innovationId}`, {professionals: professionalArray});
  }

  public get(id: string): Observable<any> {
    return this._http.get('/professional/' + id);
  }

  public getAll(config: any): Observable<any> {
    return this._http.get('/professional/', {params: config});
  }

  public remove(professionalId: string): Observable<any> {
    return this._http.delete('/professional/' + professionalId);
  }

  public save(professionalId: string, professionalObj: Professional): Observable<any> {
    return this._http.put('/professional/' + professionalId, professionalObj);
  }

  public addFromRequest(config: any): Observable<any> {
    return this._http.post(`/professional/addFromRequest/${config.newCampaignId}/${config.newInnovationId}`, config);
  }

  public export(config: any): Observable<any> {
    return this._http.post(`/professional/exportCSV`, config);
  }
}
