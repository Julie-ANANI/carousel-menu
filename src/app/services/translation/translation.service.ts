import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TranslationService {

  constructor(private _http: Http) {}

  public translate(text: string, lang: string): Observable<{translation: string}> {
    return this._http.get('/misc/translate', {params: {text: text, lang: lang}})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

}
