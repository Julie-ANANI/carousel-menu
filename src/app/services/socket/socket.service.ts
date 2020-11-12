import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';
import { Innovation } from '../../models/innovation';
import { Mission } from '../../models/mission';
import {ExecutiveReport} from '../../models/executive-report';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(environment.apiUrl.slice(0, -4), {path: '/api/socket-io'});
  }

  listenToSocket(): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on('hello', (data: any) => {
        subscriber.next(data);
      });
    });
  }

  getProjectUpdates(projectId: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`projectUpdate_${projectId}`,
        (data: {userName: string, userId: string, data: { [P in keyof Innovation]?: Innovation[P]; }}) => {
        subscriber.next(data);
      });
    });
  }

  getMissionUpdates(missionId: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`missionUpdate_${missionId}`,
        (data: {userName: string, userId: string, data: { [P in keyof Mission]?: Mission[P]; }}) => {
        subscriber.next(data);
      });
    });
  }

  getReportUpdates(executiveReportId: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`erUpdate_${executiveReportId}`,
        (data: {userName: string, userId: string, data: { [P in keyof ExecutiveReport]?: ExecutiveReport[P]; }}) => {
        subscriber.next(data);
      });
    });
  }

  getNewReport(innovationId: string): Observable<any> {
    return new Observable((subscriber: Subscriber<any>) => {
      this.socket.on(`erCreation_${innovationId}`,
        (data: {userName: string, userId: string, data: ExecutiveReport}) => {
        subscriber.next(data);
      });
    });
  }

  sendDataToApi(name: string, data: any) {
    this.socket.emit(name, data);
  }
}
