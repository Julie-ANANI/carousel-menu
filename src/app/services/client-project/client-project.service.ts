import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientProject } from '../../models/client-project';
import { Mission } from '../../models/mission';
import {Innovation, NewInnovation} from '../../models/innovation';
import {Config} from '../../models/config';

interface CreateResponse {
  clientProject: ClientProject;
  mission: Mission;
  innovation: Innovation;
}

@Injectable({providedIn: 'root'})
export class ClientProjectService {

  constructor(private _http: HttpClient) { }

  public create(clientObj: ClientProject, missionObj: Mission, innovationObj: NewInnovation):
    Observable<CreateResponse> {
    const _data = {
      clientProjectObj: clientObj,
      missionObj: missionObj,
      innovationObj: innovationObj
    };
    return this._http.post<CreateResponse>('/clientProject/create', _data);
  }

  public get(clientProjectId: string, config?: Config): Observable<ClientProject> {
    return this._http.get<ClientProject>(`/clientProject/${clientProjectId}`, { params: config });
  }

  public save(clientProjectId: string, clientObj: ClientProject): Observable<ClientProject> {
    return this._http.put<ClientProject>(`/clientProject/${clientProjectId}`, clientObj);
  }

}
