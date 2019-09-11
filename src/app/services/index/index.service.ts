import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class IndexService {

  constructor(private _http: HttpClient) { }

  public getWholeSet(config: { type: 'countries', fields?: Array<string>, filterBy?: any }): Observable<any> {
    return this._http.post('/index/getWholeSet', { query: config });
  }

}
