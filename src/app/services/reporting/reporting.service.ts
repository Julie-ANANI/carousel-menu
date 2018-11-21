import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReportingService {

  constructor(private _http: HttpClient) { }

  public createHtmlSnapshot(data: any): Observable<any> {
    return this._http.post('/reporting/job', data/*, {responseType: 3}*/);
  }

  public getPdf(body: any): Observable<any> {
    return this._http.post('/reporting/job', body/*, {responseType: 3}*/);
  }

}
