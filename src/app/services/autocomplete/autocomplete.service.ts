import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AutocompleteService {

  constructor(private _http: Http) { }


  public get(keyword: string): Observable<any> {

    return this._http.get('/misc/suggestions', {params: {type: 'companies', query: keyword}})
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }
}
