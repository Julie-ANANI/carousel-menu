import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AutocompleteService {

  constructor(private _http: Http) { }


  public get(params: {keyword: string, type: string}): Observable<{_id: string, name: string, domain: string, flag: string}[]> {
    return this._http.get('/misc/suggestions', {params: {type: params.type, query: params.keyword}})
      .map((res: Response) => {
        const response = res.json();
        return response.result;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }
}
