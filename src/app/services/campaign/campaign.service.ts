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

  public put(campaignObj: Campaign): Observable<Campaign> {
    return this._http.put('/campaign/' + campaignObj._id, campaignObj)
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

  public createNewBatch(campaignId: string, batch: any): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/createNewBatch`, batch)
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.text()));
  }

  public AutoBatch(campaignId: string): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/AutoBatch`)
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.text()));
  }

  // DEBUG AUTOBATCH => Creation de pro a la volée
  public creerpro(campaignId: string): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/creerPro`)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public startABtesting(campaignId: string,
                        nameA: string,
                        nameB: string,
                        sizeA: number,
                        sizeB: number): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/startAB`, { nameA, nameB, sizeA, sizeB })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public freezeStatus(batch: any): Observable<any> {
    return this._http.get( `/batch/${batch._id}/freezeStatus`)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public updateBatchStats(batchID: string): Observable<any> {
    return this._http.put(`/batch/${batchID}/updateStats`)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public updateBatch(batch: any): Observable<any> {
    return this._http.put(`/batch/${batch._id}`, batch)
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.text()));
  }

  public deleteBatch(batchId: string): Observable<any> {
    return this._http.delete(`/batch/${batchId}`)
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.text()));
  }

  public sendTestEmails(campaignId: string, batchStatus: number): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/sendTestEmailsNew`, {batchStatus: batchStatus})
        .map((res: Response) => res.json())
        .catch((error: Response) => Observable.throw(error.text()));
  }
}
