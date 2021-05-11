import { environment } from '../../../environments/environment';
import { io } from 'socket.io-client';

export class AbstractSocketService {
  socket: any;

  constructor() {
    this.socket = io(environment.apiUrl.slice(0, -4), {
      path: '/api/socket-io',
    });
  }

  sendDataToApi(name: string, data: any) {
    this.socket.emit(name, data);
  }
}
