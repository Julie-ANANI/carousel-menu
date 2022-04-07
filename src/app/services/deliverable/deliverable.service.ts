import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../../models/job';

@Injectable({providedIn: 'root'})
export class DeliverableService {

  constructor(private _http: HttpClient) { }

  public registerJob(ownerId: string, innovationId: string, jobType: string): Observable<Job> {
    return this._http.post<Job>(`/authorize/access/deliverable/registerJob`, {owner: ownerId, innovationId: innovationId, jobType: jobType});
  }

  public getReportDeliverableStatus(reportId: string): Observable<any> {
    return this._http.get<any>(`/deliverable/registerJob`);
  }

}
