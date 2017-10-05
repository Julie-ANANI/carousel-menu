import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CampaignService {

  constructor(private _http: Http) {
  }

  public create(campaignObj: any): Observable<any> {
    return this._http.post('/campaign/', campaignObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<any> {
    return this._http.get('/campaign/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(): Observable<any> {
    return this._http.get('/campaign/')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(campaignId: string): Observable<any> {
    return this._http.delete('/campaign/' + campaignId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }
}
