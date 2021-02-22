import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StatsReferents} from '../../models/stats-referents';

@Injectable({providedIn: 'root'})
export class StatsReferentsService {

  constructor(private _http: HttpClient) {
  }

  public get(): Observable<StatsReferents> {
    return this._http.get<StatsReferents>('/statsreferents');
  }

}
