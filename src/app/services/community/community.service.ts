import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {CommunityCircle} from '../../models/community';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const COMMUNITY_API = environment.communityApiUrl;

@Injectable({providedIn: 'root'})
export class CommunityService {

  constructor(private _http: HttpClient) { }

  public getAllCircles(): Observable<Array<CommunityCircle>> {
    return this._http.get<Array<CommunityCircle>>(`${COMMUNITY_API}/circle/?fields=name`);
  }

}
