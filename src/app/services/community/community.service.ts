import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {CommunityCircle} from '../../models/community';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CommunityService {

  constructor(private _http: HttpClient) { }

  public getAllCircles(): Observable<Array<CommunityCircle>> {
    return this._http.get<Array<CommunityCircle>>(`/community/circle`);
  }

}
