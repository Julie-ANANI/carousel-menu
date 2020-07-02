import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(environment.apiUrl.replace('/api', ''));
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
      this.socket.on(`projectUpdate_${projectId}`, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  sendDataToApi(name: string, data: any) {
    this.socket.emit(name, data);
  }
}
