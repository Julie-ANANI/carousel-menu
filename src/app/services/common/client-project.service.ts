import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientProject } from '../../models/client-project';
import { Mission } from '../../models/mission';

@Injectable({providedIn: 'root'})
export class ClientProjectService {

  constructor(private _http: HttpClient) { }

  public create(clientObj: ClientProject, missionObj: Mission, innovationObj: { name: string, lang: string, domain: string }): Observable<any> {

    const data = {
      clientProjectObj: clientObj,
      missionObj: missionObj,
      innovationObj: innovationObj
    };

    return this._http.post<any>('/clientProject/create', data);
  }

}
