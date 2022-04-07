import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CollaborativeComment, Reply} from '../../models/collaborative-comment';
import {Etherpad} from '../../models/etherpad';
import {Session} from '../../models/session';

const BASE_PATH = '/authorized/access/etherpad';

@Injectable({providedIn: 'root'})
export class EtherpadService {

  constructor(private _http: HttpClient) {
  }

  public pingServer() {
    return this._http.get(`${BASE_PATH}/`);
  }

  /***
   *
   * @param innovationId is the only innovationId
   * @param padID = pad-description-sectionName || pad-workflow-workflowId || pad-synthesis-questionId
   * @param content : html content of pad
   */
  public createPad(innovationId: string, padID: string, content: string): Observable<Etherpad> {
    const _data = {padID: padID, html: content};
    return this._http.post<Etherpad>(`${BASE_PATH}/group/${innovationId}/pad`, _data);
  }

  /***
   * Get the users with actual active session with the specific group
   * @param innovationId
   */
  public subscribedUsersSessions(innovationId: string): Observable<Array<Session>> {
    return this._http.get<Array<Session>>(`${BASE_PATH}/group/${innovationId}/sessions`);
  }

  public getAllCommentsOfPad(innovationId: string, padID: string): Observable<CollaborativeComment[]> {
    return this._http.get<CollaborativeComment[]>(`${BASE_PATH}/group/${innovationId}/pad/${padID}/comments`);
  }

  public getAllRepliesOfPad(innovationId: string, padID: string): Observable<Reply[]> {
    return this._http.get<Reply[]>(`${BASE_PATH}/group/${innovationId}/pad/${padID}/commentReplies`);
  }

  public addRepliesToComment(innovationId: string, padID: string, replies: Reply[]) {
    const _data = {replies: replies};
    return this._http.post(`${BASE_PATH}/group/${innovationId}/pad/${padID}/commentReplies`, _data);
  }

}
