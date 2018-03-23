import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  
  @Input() backOffice: boolean;

  constructor(private _authService: AuthService) {}

  public logoName(): string {
    return `logo-${environment.domain || 'umi.us'}.png`;
  }

  public canShow(reqLevel: number): boolean {
    return reqLevel && (this._authService.adminLevel & reqLevel) === reqLevel;
  }

  get authService (): AuthService {
    return this._authService;
  }
}
