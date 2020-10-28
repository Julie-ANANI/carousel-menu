import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class EtherpadService {

  constructor(private _http: HttpClient) { }

  /***
   *
   * @param groupId is the only innovationId
   * @param padId = pad-description-sectionName || pad-workflow-workflowId || pad-synthesis-questionId
   */
  public createPad(groupId: string, padId: string): Observable<any> {
    const _data = { groupId: groupId, padId: padId }
    return this._http.post<any>('/etherpad/pad', _data);
  }

}
