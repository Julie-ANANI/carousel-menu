import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Answer } from '../../models/answer';
import { Batch } from '../../models/batch';
import { Campaign } from '../../models/campaign';
import { Professional } from '../../models/professional';

@Injectable({providedIn: 'root'})
export class CampaignService {

  constructor(private _http: HttpClient) {}

  public create(campaignObj: Campaign) {
    return this._http.post('/campaign/', campaignObj);
  }

  public get(id: string): Observable<Campaign> {
    return this._http.get<Campaign>('/campaign/' + id);
  }

  public put(campaignObj: Campaign) {
    return this._http.put('/campaign/' + campaignObj._id, campaignObj);
  }

  public getAll(config: {[header: string]: string | string[]}): Observable<any> {
    return this._http.get<any>('/campaign/', {params: config});
  }

  public getPros(campaignId: string, config: {[header: string]: string | string[]}): Observable<{result: Array<Professional>, _metadata: any}> {
    return this._http
      .get<{result: Array<Professional>, _metadata: any}>
      ('/campaign/' + campaignId + '/pros', {params: config});
  }

  public getAnswers(campaignId: string): Observable<{answers: {draftAnswers: Array<Answer>, localAnswers: Array<Answer>}}> {
    return this._http
      .get<{answers: {draftAnswers: Array<Answer>, localAnswers: Array<Answer>}}>
      ('/campaign/' + campaignId + '/answer');
  }

  public remove(campaignId: string) {
    return this._http.delete('/campaign/' + campaignId);
  }

  public updateStats(campaignId: string): Observable<any> {
    return this._http.put(`/campaign/${campaignId}/stats`, {});
  }

  public messagesStats(campaignId: string): Observable<Array<Batch>> {
    return this._http.get<Array<Batch>>(`/campaign/${campaignId}/messagesStats`);
  }

  public createNewBatch(campaignId: string, batch: Batch): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/createNewBatch`, batch);
  }

  public AutoBatch(campaignId: string): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/AutoBatch`, {});
  }

  // DEBUG AUTOBATCH => Creation de pro a la volée
  public creerpro(campaignId: string): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/creerPro`, {});
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
    return this._http.post(`/campaign/${campaign}/updateBatchesStats`, {});
  }

  public updateBatch(batch: Batch): Observable<Batch> {
    return this._http.put<Batch>(`/batch/${batch._id}`, batch);
  }

  public updateBatchStatus(batchId: string, status: number): Observable<any> {
    return this._http.get(`/batch/${batchId}/updateStatus?status=${status}`);
  }

  public deleteBatch(batchId: string): Observable<any> {
    return this._http.delete(`/batch/${batchId}`);
  }

  public sendTestEmails(campaignId: string, batchStatus: number, userInfo: any): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/sendTestEmailsNew`, {batchStatus: batchStatus, user: userInfo});
  }

  public setNuggets(campaignId: string): Observable<any> {
    return this._http.get(`/campaign/${campaignId}/setNuggets`);
  }

  public addNuggets(campaignId: string, batchId: string): Observable<any> {
    return this._http.get(`/campaign/${campaignId}/addNuggets/${batchId}`);
  }

  /*
  public getPredictionsBatch(batchId: string):  Observable<any> {
    return this._http.post(`/batch/${batchId}/getPredictions`, {ID: batchId});
  }
  */
}
