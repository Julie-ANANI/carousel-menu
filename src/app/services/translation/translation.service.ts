import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TranslationService {

  constructor(private _http: HttpClient) {}

  public translate(text: string, lang: string): Observable<any> {
    return this._http.get('/misc/translate', {params: {text: text, lang: lang}});
  }

}
