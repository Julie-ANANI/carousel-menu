import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})

export class ClientComponent {

  constructor (private authService1: AuthService) {}

  get authService(): AuthService {
    return this.authService1;
  }

}
