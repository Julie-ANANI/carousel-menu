import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Reply} from '../../models/collaborative-comment';
import {User} from '../../models/user.model';
import {Etherpad} from '../../models/etherpad';

const BASE_PATH = '/etherpad';

@Injectable({providedIn: 'root'})
export class EtherpadService {

  constructor(private _http: HttpClient) {}

  /***
   *
   * @param innovationId is the only innovationId
   * @param padId = pad-description-sectionName || pad-workflow-workflowId || pad-synthesis-questionId
   */
  public createPad(innovationId: string, padId: string): Observable<Etherpad> {
    const _data = {innovationId: innovationId, padId: padId};
    return this._http.post<Etherpad>(`${BASE_PATH}/pad`, _data);
  }

  /***
   * returns the total users list subscribed with the specific group
   * @param innovationId
   */
  public subscribedUsers(innovationId: string): Observable<Array<User>> {
    const _data = { innovationId: innovationId }
    return this._http.get<Array<User>>(`/${BASE_PATH}/users/subscribed`, {params: _data});
  }

  getAllCommentsOfPad(padId: string): Observable<any> {
    return this._http.get(`${BASE_PATH}/pad/${padId}/comments`);
  }

  getAllRepliesOfPad(padId: string): Observable<any> {
    return this._http.get(`${BASE_PATH}/pad/${padId}/commentReplies`);
  }

  addRepliesToComment(padId: string, replies: Reply[]) {
    return this._http.post(`${BASE_PATH}/pad/${padId}/commentReplies`, replies);
  }

}
