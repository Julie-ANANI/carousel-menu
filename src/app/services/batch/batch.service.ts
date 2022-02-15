import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Batch} from '../../models/batch';

@Injectable({providedIn: 'root'})
export class BatchService {

  constructor(private _http: HttpClient) {
  }

  public update(batch: Batch): Observable<Batch> {
    return this._http.put<Batch>(`/batch/${batch._id}`, batch);
  }

  public delete(batchId: string): Observable<any> {
    return this._http.delete(`/batch/${batchId}`);
  }

  public updateStatus(batchId: string, status: number): Observable<any> {
    return this._http.get(`/batch/${batchId}/updateStatus?status=${status}`);
  }

  public freezeStatus(batch: Batch): Observable<any> {
    return this._http.get(`/batch/${batch._id}/freezeStatus`);
  }

  public getNextDateSend(date: String) {
    return this._http.post('/batch/nextMails', {date: date});
  }

}
