import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../models/user.model';

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

  /***
   * returns the total users list subscribed with the specific group
   * @param groupId
   */
  public subscribedUsers(groupId: string): Observable<Array<User>> {
    const _data = { groupId: groupId }
    return this._http.get<Array<User>>(`/etherpad/users/subscribed`, {params: _data});
  }

}
