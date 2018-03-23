import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private _authService: AuthService) {}

  public logoName(): string {
    return `logo-${environment.domain || 'umi.us'}.png`;
  }

  get authService (): AuthService {
    return this._authService;
  }
}
