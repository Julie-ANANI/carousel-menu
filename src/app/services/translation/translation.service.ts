import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class TranslationService {

  constructor(private _http: Http) {}

  public translate(text: string, lang: string): Observable<{translation: string}> {
    return this._http.get('/misc/translate', {params: {text: text, lang: lang}})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

}
