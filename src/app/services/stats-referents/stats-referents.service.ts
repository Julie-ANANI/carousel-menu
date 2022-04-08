import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StatsReferents} from '../../models/stats-referents';
import {CacheType} from '../../models/cache';

@Injectable({providedIn: 'root'})
export class StatsReferentsService {

  constructor(private _http: HttpClient) {
  }

  public get(cache: CacheType = ''): Observable<StatsReferents> {
    return this._http.get<StatsReferents>('/statsreferents', {headers: new HttpHeaders().set('cache', cache)});
  }

}
