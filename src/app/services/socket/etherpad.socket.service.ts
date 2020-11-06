import {Injectable} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {SocketService} from './socket.service';

@Injectable({
  providedIn: 'root'
})

export class EtherpadSocketService extends SocketService {

  constructor() {
    super();
  }

  getAuthorPadUpdates(groupPadID: string, authorID: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`etherpad/${groupPadID}/${authorID}/update`,
        (data: {text: string}) => {
          subscriber.next(data);
        });
    });
  }

  getServerStatusMessages(): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`etherpad/status/`,
        (data: {serverUp: boolean}) => {
          subscriber.next(data);
        });
    });
  }

}
