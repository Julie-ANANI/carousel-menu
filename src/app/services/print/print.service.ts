import { Injectable } from '@angular/core';
import { Http } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PrintService {

  constructor(private _http: Http) { }

  public getPdf(body: any): Observable<any> {
    return this._http.post('/reporting/job', body, {responseType: 3});
  }

}
