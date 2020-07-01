import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  constructor(public socket: Socket) { }

  getProjectUpdates(projectId: string) {
    return this.socket
      .fromEvent<any>(`projectUpdate_${projectId}`);
  }

  sendMessage(eventName: string, message: string) {
    this.socket.emit(eventName, message);
  }
}
