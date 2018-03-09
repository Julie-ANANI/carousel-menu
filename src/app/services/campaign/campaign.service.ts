import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import { Answer } from '../../models/answer';
import { Campaign } from '../../models/campaign';
import { Professional } from '../../models/professional';

@Injectable()
export class CampaignService {

  constructor(private _http: Http) {}

  public create(campaignObj: Campaign): Observable<Campaign> {
    return this._http.post('/campaign/', campaignObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<Campaign> {
    return this._http.get('/campaign/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(config: any): Observable<Array<Campaign>> {
    return this._http.get('/campaign/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getPros(campaignId: string, config: any): Observable<{result: Array<Professional>, _metadata: any}> {
    return this._http.get('/campaign/' + campaignId + '/pros', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAnswers(campaignId: string): Observable<{answers: {draftAnswers: Array<Answer>, localAnswers: Array<Answer>}}> {
    return this._http.get('/campaign/' + campaignId + '/answer')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(campaignId: string): Observable<any> {
    return this._http.delete('/campaign/' + campaignId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public updateStats(campaignId: string): Observable<any> {
    return this._http.put(`/campaign/${campaignId}/stats`)
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.text()));
  }

  public messagesStats(campaignId: string): Observable<any> {
    return this._http.get(`/campaign/${campaignId}/messagesStats`)
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.text()));
  }
}
