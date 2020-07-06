import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mission } from '../../models/mission';
import { Observable } from 'rxjs';
import { Innovation } from '../../models/innovation';

@Injectable({providedIn: 'root'})
export class MissionService {

  constructor(private _http: HttpClient) { }

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

  public save(missionId: string, missionObj: Mission): Observable<Mission> {
    return this._http.put<Mission>('/mission/' + missionId, missionObj);
  }

  public updateMainObjective(missionId: string, missionObj: Mission): Observable<Innovation> {
    return this._http.put<Innovation>(`/mission/${missionId}/updateMainObjective`, missionObj);
  }

}
