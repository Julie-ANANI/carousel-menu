import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.scss']
})
export class ClientHeaderComponent implements OnInit {

  constructor(private _translateService: TranslateService,
              private _authService: AuthService) {}

  ngOnInit(): void {
  }

  get authService (): AuthService {
    return this._authService;
  }

  get translate (): TranslateService {
    return this._translateService;
  }
}
