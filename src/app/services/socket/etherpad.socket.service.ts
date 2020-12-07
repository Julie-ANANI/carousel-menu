import {Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {AbstractSocketService} from './abstract.socket.service';

@Injectable({
  providedIn: 'root'
})

export class EtherpadSocketService extends AbstractSocketService {

  constructor() {
    super();
  }

  getAuthorPadUpdates(groupPadID: string, authorID: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`etherpad/${groupPadID}/update`,
        (data: {text: string}) => {
          subscriber.next(data);
        });
    });
  }

  getServerStatusMessages(): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`etherpad/status`,
        (data: {serverUp: boolean}) => {
          subscriber.next(data);
        });
    });
  }

  getGroupSessionUpdate(groupID: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`etherpad/${groupID}/sessions`,
        () => {
          subscriber.next();
        });
    });
  }

}
