import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class MonitoringService {

  constructor(private _http: HttpClient) {
  }

  public getService(): Observable<any> {
    return this._http.get('/monitoring/service');
  }

}
