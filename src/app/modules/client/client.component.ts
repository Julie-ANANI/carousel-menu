import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})

export class ClientComponent {

  constructor (private _authService: AuthService) {}

  get authService(): AuthService {
    return this._authService;
  }

}
