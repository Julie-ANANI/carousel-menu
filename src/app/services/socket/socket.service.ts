import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';
import { Innovation } from '../../models/innovation';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  socket: SocketIOClient.Socket;

  constructor() {
    console.log(environment.apiUrl);
    this.socket = io(environment.apiUrl.replace('/api', ''), {path: '/api/socket-io'});
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

  sendDataToApi(name: string, data: any) {
    this.socket.emit(name, data);
  }
}
