import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface AutocompleteObject {_id: string; name: string; domain: string; flag: string; logo: string}

@Injectable()
export class AutocompleteService {

  constructor(private _http: HttpClient) { }

  public get(params: {query: string, type: string, tagType?: string}): Observable<AutocompleteObject[]> {
    return this._http.get<AutocompleteObject[]>('/misc/suggestions', {params: params})
    .pipe(map((res: any) => res.result));
  }
}
