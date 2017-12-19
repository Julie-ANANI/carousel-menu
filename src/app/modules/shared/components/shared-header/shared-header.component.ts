import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss']
})
export class SharedHeaderComponent implements OnInit {

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
  }

  public logoName(): string {
    return `logo-${environment.domain||'umi'}.png`;
  }

  get authService (): AuthService {
    return this._authService;
  }
}
