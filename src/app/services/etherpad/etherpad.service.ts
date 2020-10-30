import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CollaborativeComment, Reply} from '../../models/collaborative-comment';
import {Etherpad} from '../../models/etherpad';
import {Session} from '../../models/session';

const BASE_PATH = '/etherpad';

@Injectable({providedIn: 'root'})
export class EtherpadService {

  constructor(private _http: HttpClient) {
  }

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
  public subscribedUsersSessions(innovationId: string): Observable<Array<Session>> {
    const _data = {innovationId: innovationId};
    return this._http.get<Array<Session>>(`/${BASE_PATH}/group/sessions`, {params: _data});
  }

  getAllCommentsOfPad(padId: string): Observable<CollaborativeComment[]> {
    return this._http.get<CollaborativeComment[]>(`${BASE_PATH}/pad/${padId}/comments`);
  }

  getAllRepliesOfPad(padId: string): Observable<Reply[]> {
    return this._http.get<Reply[]>(`${BASE_PATH}/pad/${padId}/commentReplies`);
  }

  addRepliesToComment(padId: string, replies: Reply[]) {
    return this._http.post(`${BASE_PATH}/pad/${padId}/commentReplies`, replies);
  }

}
