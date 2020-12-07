import {environment} from '../../../environments/environment';
import * as io from 'socket.io-client';

export class AbstractSocketService {

  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io(environment.apiUrl.slice(0, -4), {path: '/api/socket-io'});
  }

  sendDataToApi(name: string, data: any) {
    this.socket.emit(name, data);
  }
}
