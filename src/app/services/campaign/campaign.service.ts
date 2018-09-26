import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable, throwError } from 'rxjs';
import { Answer } from '../../models/answer';
import { Campaign } from '../../models/campaign';
import { Professional } from '../../models/professional';
import {Batch} from '../../models/batch';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CampaignService {

  constructor(private _http: Http) {}

  public create(campaignObj: Campaign): Observable<Campaign> {
    return this._http.post('/campaign/', campaignObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public get(id: string): Observable<Campaign> {
    return this._http.get('/campaign/' + id)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public put(campaignObj: Campaign): Observable<Campaign> {
    return this._http.put('/campaign/' + campaignObj._id, campaignObj)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getAll(config: any): Observable<Array<Campaign>> {
    return this._http.get('/campaign/', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getPros(campaignId: string, config: any): Observable<{result: Array<Professional>, _metadata: any}> {
    return this._http.get('/campaign/' + campaignId + '/pros', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getAnswers(campaignId: string): Observable<{answers: {draftAnswers: Array<Answer>, localAnswers: Array<Answer>}}> {
    return this._http.get('/campaign/' + campaignId + '/answer')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public remove(campaignId: string): Observable<any> {
    return this._http.delete('/campaign/' + campaignId)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public updateStats(campaignId: string): Observable<any> {
    return this._http.put(`/campaign/${campaignId}/stats`)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public messagesStats(campaignId: string): Observable<any> {
    return this._http.get(`/campaign/${campaignId}/messagesStats`)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public createNewBatch(campaignId: string, batch: Batch): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/createNewBatch`, batch)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public AutoBatch(campaignId: string): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/AutoBatch`)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  // DEBUG AUTOBATCH => Creation de pro a la volée
  public creerpro(campaignId: string): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/creerPro`)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public startABtesting(campaignId: string,
                        nameA: string,
                        nameB: string,
                        sizeA: number,
                        sizeB: number): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/startAB`, { nameA, nameB, sizeA, sizeB })
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public freezeStatus(batch: Batch): Observable<any> {
    return this._http.get( `/batch/${batch._id}/freezeStatus`)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  // Update A/B test stats. (MailService / No NLP)
  public updateBatchesStats(campaign: string): Observable<any> {
    return this._http.post(`/campaign/${campaign}/updateBatchesStats`)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public updateBatch(batch: Batch): Observable<any> {
    return this._http.put(`/batch/${batch._id}`, batch)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public deleteBatch(batchId: string): Observable<any> {
    return this._http.delete(`/batch/${batchId}`)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public sendTestEmails(campaignId: string, batchStatus: number): Observable<any> {
    return this._http.post(`/campaign/${campaignId}/sendTestEmailsNew`, {batchStatus: batchStatus})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

}
