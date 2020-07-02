import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { EMPTY, Observable } from 'rxjs';

/*
 * This class override the SocketService on server side
 */
@Injectable({ providedIn: 'root' })
export class SocketSsrService implements SocketService {

  socket: any = null;

  listenToSocket(): Observable<Notification> {
    return EMPTY;
  }

  getProjectUpdates(): Observable<Notification> {
    return EMPTY;
  }

  sendDataToApi(e: any) { }

}
