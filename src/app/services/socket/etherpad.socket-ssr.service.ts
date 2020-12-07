import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {EtherpadSocketService} from './etherpad.socket.service';

/*
 * This class override the EtherpadSocketService on server side
 */
@Injectable()
export class EtherpadSocketSsrService implements EtherpadSocketService {

  socket: any = null;

  getAuthorPadUpdates(groupPadID: string, authorID: string): Observable<any> {
    return EMPTY;
  }

  getGroupSessionUpdate(groupID: string): Observable<any> {
    return EMPTY;
  }

  getServerStatusMessages(): Observable<any> {
    return EMPTY;
  }

  sendDataToApi(e: any) {
  }

}
