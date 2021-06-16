import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TrackingService {

  constructor(private _http: HttpClient) {
  }

  public getSubscriptionTrackingTimelines(month: string, year: string): Observable<any> {
    return this._http.get('/tracking/timelines', {params: {month: month, year: year}});
  }

  public getTrackers(month: string, year: string, page: string, link: string): Observable<any> {
    return this._http.get('/tracking/trackers', {params: {month: month, year: year, page: page, link: link}});
  }

}
