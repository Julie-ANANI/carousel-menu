import { Injectable } from '@angular/core';
import { Http, Response } from '../http.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AutocompleteService {

  constructor(private _http: Http) { }


  public get(params: {query: string, type: string, tagType?: string}): Observable<{_id: string, name: string, domain: string, flag: string}[]> {
    return this._http.get('/misc/suggestions', {params: params})
    .pipe(
        map((res: any) => res.result),
        catchError((error: Response) => throwError(error.text()))
      );
  }
}
