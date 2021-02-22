import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { EMPTY, Observable } from 'rxjs';

/*
 * This class override the SocketService on server side
 */
@Injectable()
export class SocketSsrService implements SocketService {

  socket: any = null;

  listenToSocket(): Observable<Notification> {
    return EMPTY;
  }

  getProjectUpdates(): Observable<Notification> {
    return EMPTY;
  }

  getProjectFieldUpdates(): Observable<Notification> {
    return EMPTY;
  }

  getMissionUpdates(): Observable<Notification> {
    return EMPTY;
  }

  getNewReport(): Observable<Notification> {
    return EMPTY;
  }

  getNewCampaign(): Observable<Notification> {
    return EMPTY;
  }

  getReportUpdates(): Observable<Notification> {
    return EMPTY;
  }

  getAnswersUpdates(): Observable<Notification> {
    return EMPTY;
  }

  getProsRepartition(): Observable<any> {
    return EMPTY;
  }

  sendDataToApi(e: any) { }

}
