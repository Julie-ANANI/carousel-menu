import { Injectable } from '@angular/core';
import { Http } from '../http.service';
import { Observable } from 'rxjs';

@Injectable()
export class PrintService {

  constructor(private _http: Http) { }

  public getPdf(body: any): Observable<any> {
    return this._http.post('/reporting/job', body, {responseType: 3});
  }

}
