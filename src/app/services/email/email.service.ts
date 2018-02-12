import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EmailService {

  constructor(private _http: Http) { }

  public stopBatch(batchId: string): Observable<any> {
    return this._http.post( '/mail/queue/' + batchId, {newStatus: 'CANCELED'} )
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public getBatch(batchId: string): Observable<any> {
    return this._http.get( '/mail/queue/' + batchId )
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public getQueue(params: any): Observable<any> {
    let paramStr = Object.keys(params).map(key => {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(params[key]);
    }).join('&');
    if (paramStr.length) {
      paramStr = '?' + paramStr;
    }
    return this._http.get('/mail/queue' + paramStr)
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

}
