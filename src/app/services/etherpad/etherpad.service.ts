import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CollaborativeComment, Reply} from '../../models/collaborative-comment';
import {Etherpad} from '../../models/etherpad';
import {Session} from '../../models/session';

const BASE_PATH = '/etherpad';

@Injectable({providedIn: 'root'})
export class EtherpadService {

  constructor(private _http: HttpClient) {}

  /***
   *
   * @param innovationId is the only innovationId
   * @param padID = pad-description-sectionName || pad-workflow-workflowId || pad-synthesis-questionId
   * @param content : html content of pad
   */
  public createPad(innovationId: string, padID: string, content: string): Observable<Etherpad> {
    const _data = {innovationId: innovationId, padID: padID, html: content};
    return this._http.post<Etherpad>(`${BASE_PATH}/pad`, _data);
  }

  public setPadHtml(innovationId: string, padID: string, html: string): Observable<any> {
    const _data = {innovationId: innovationId, html: html};
    return this._http.post(`${BASE_PATH}/pad/${padID}/html`, {params: _data});
  }

  /***
   * returns the total users list subscribed with the specific group
   * @param innovationId
   */
  public subscribedUsersSessions(innovationId: string): Observable<Array<Session>> {
    const _data = {innovationId: innovationId};
    return this._http.get<Array<Session>>(`${BASE_PATH}/group/sessions`, {params: _data});
  }

  public getAllCommentsOfPad(innovationId: string, padID: string): Observable<CollaborativeComment[]> {
    const _data = {innovationId: innovationId};
    return this._http.get<CollaborativeComment[]>(`${BASE_PATH}/pad/${padID}/comments`, {params: _data});
  }

  public getAllRepliesOfPad(innovationId: string, padID: string): Observable<Reply[]> {
    const _data = {innovationId: innovationId};
    return this._http.get<Reply[]>(`${BASE_PATH}/pad/${padID}/commentReplies`, {params: _data});
  }

  public addRepliesToComment(innovationId: string, padID: string, replies: Reply[]) {
    const _data = {innovationId: innovationId, replies: replies};
    return this._http.post(`${BASE_PATH}/pad/${padID}/commentReplies`, _data);
  }

  public pingServer() {
    return this._http.get(`${BASE_PATH}/`);
  }

}
