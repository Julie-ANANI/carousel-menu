/**
 * Created by bastien on 19/12/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SearchService {

  constructor(private _http: Http) {
  }

  public getEmailStats(daysCount: number): Observable<any> {
    const query = {
      params: {daysCount: daysCount},
      path: '/stats/email'
    };
    return this._http.get('/search/get', {params: query})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }
}
