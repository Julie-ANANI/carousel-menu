import { Injectable } from '@angular/core';
import { Http } from '../http.service';
import { Observable } from 'rxjs';
import { Answer } from '../../models/answer';
import { Campaign } from '../../models/campaign';
import { Professional } from '../../models/professional';
import {Batch} from '../../models/batch';

@Injectable()
export class CampaignService {

  constructor(private _http: Http) {}

  public create(campaignObj: Campaign) {
    return this._http.post('/campaign/', campaignObj);
  }

  public get(id: string): Observable<Campaign> {
    return this._http.get('/campaign/' + id);
  }

  public put(campaignObj: Campaign) {
    return this._http.put('/campaign/' + campaignObj._id, campaignObj);
  }

  public getAll(config: any): Observable<Array<Campaign>> {
    return this._http.get('/campaign/', {params: config});
  }

  public getPros(campaignId: string, config: any): Observable<{result: Array<Professional>, _metadata: any}> {
    return this._http.get('/campaign/' + campaignId + '/pros', {params: config});
  }

  public getAnswers(campaignId: string): Observable<{answers: {draftAnswers: Array<Answer>, localAnswers: Array<Answer>}}> {
    return this._http.get('/campaign/' + campaignId + '/answer');
  }

  public remove(campaignId: string): Observable<any> {
    return this._http.delete('/campaign/' + campaignId);
  }

  public updateStats(campaignId: string): Observable<any> {
    return this._http.put(`/campaign/${campaignId}/stats`);
  }

  public messagesStats(campaignId: string): Observable<any> {
    return this._http.get(`/campaign/${campaignId}/messagesStats`);
  }

  public createNewBatch(campaignId: string, batch: Batch): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/createNewBatch`, batch);
  }

  public AutoBatch(campaignId: string): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/AutoBatch`);
  }

  // DEBUG AUTOBATCH => Creation de pro a la volée
  public creerpro(campaignId: string): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/creerPro`);
  }

  public startABtesting(campaignId: string,
                        nameA: string,
                        nameB: string,
                        sizeA: number,
                        sizeB: number): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/startAB`, { nameA, nameB, sizeA, sizeB });
  }

  public freezeStatus(batch: Batch): Observable<any> {
    return this._http.get( `/batch/${batch._id}/freezeStatus`);
  }

  // Update A/B test stats. (MailService / No NLP)
  public updateBatchesStats(campaign: string): Observable<any> {
    return this._http.post(`/campaign/${campaign}/updateBatchesStats`);
  }

  public updateBatch(batch: Batch): Observable<any> {
    return this._http.put(`/batch/${batch._id}`, batch);
  }

  public deleteBatch(batchId: string): Observable<any> {
    return this._http.delete(`/batch/${batchId}`);
  }

  public sendTestEmails(campaignId: string, batchStatus: number): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/sendTestEmailsNew`, {batchStatus: batchStatus});
  }

}
