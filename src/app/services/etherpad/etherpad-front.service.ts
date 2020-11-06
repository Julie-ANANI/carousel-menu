import {Injectable} from '@angular/core';
import {Session} from '../../models/session';

@Injectable({providedIn: 'root'})
export class EtherpadFrontService {

  constructor() {
  }

  /***
   * sort the sessions by the authors name.
   * @param sessions
   */
  public static sortSessions(sessions: Array<Session> = []): Array<Session> {
    if (sessions.length) {
      return sessions.sort((a, b) => {
        return a.author.name.localeCompare(b.author.name);
      });
    }
    return sessions;
  }


  public static getGroupPadId(groupID: string, padID: string): string {
    return `${groupID}$${padID}`;
  }

}
