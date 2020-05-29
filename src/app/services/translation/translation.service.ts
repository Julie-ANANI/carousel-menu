import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslationService {

  constructor(private _http: HttpClient) {}

  public translate(text: string, lang: string): Observable<{translation: string}> {
    return this._http.get<{translation: string}>('/misc/translate', {params: {text: text, lang: lang}});
  }

}
