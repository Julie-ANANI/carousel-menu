import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Mission} from '../../models/mission';
import { Observable } from 'rxjs';
import { Innovation } from '../../models/innovation';
import { Multiling } from '../../models/multiling';
import {Response} from '../../models/response';
import {Config} from '../../models/config';

@Injectable({providedIn: 'root'})
export class MissionService {

  constructor(private _http: HttpClient) { }

  /**
   * will return the list of all the questions defined by us for a mission.
   * @param config
   */
  public getAllQuestions(config?: Config): Observable<Response> {
    const _config = !!config ? config : {
      limit: '-1'
    };
    return this._http.get<Response>('/mission/questions', {params: _config});
  }

  /**
   * will return all the use cases templates we have defined for a mission.
   * @param config
   */
  public getAllTemplates(config?: Config): Observable<Response> {
    return this._http.get<Response>('/mission/templates', {params: config});
  }

  public create(missionObj: Mission): Observable<Mission> {
    return this._http.post<Mission>('/mission', missionObj);
  }

  public get(id: string): Observable<Mission> {
    return this._http.get<Mission>('/mission/' + id);
  }

  public getAll(config: {[header: string]: string | string[]}): Observable<{result: Array<Mission>, _metadata: any}> {
    return this._http.get<{result: Array<Mission>, _metadata: any}>('/mission/', {params: config});
  }

  public remove(missionId: string): Observable<Mission> {
    return this._http.delete<Mission>('/mission/' + missionId);
  }

  public save(missionId: string, missionObj: { [P in keyof Mission]?: Mission[P]; }): Observable<Mission> {
    return this._http.put<Mission>('/mission/' + missionId, missionObj);
  }

  public updateMainObjective(
    missionId: string,
    objective: { principal: Multiling; secondary: Array<Multiling>; comment: string }): Observable<Innovation> {
    return this._http.put<Innovation>(`/mission/${missionId}/updateMainObjective`, {objective: objective});
  }

}
