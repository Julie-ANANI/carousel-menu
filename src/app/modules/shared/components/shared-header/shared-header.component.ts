import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss']
})
export class SharedHeaderComponent {

  constructor(private _authService: AuthService) {}

  public logoName(): string {
    return `logo-${environment.domain || 'umi.us'}.png`;
  }

  get authService (): AuthService {
    return this._authService;
  }
}
