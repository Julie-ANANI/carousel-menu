import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IndexService {

  constructor(private _http: Http) { }


  public getCountriesForAutoComplete(): Observable<any> {
    return this._http.post('/index/getSuggestions/countries', {resource: 'countries', fields: 'name,code,isoCode,label,uri', txt: 'r'})
      .map((res: Response) => {
        const response = res.json();
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

}
