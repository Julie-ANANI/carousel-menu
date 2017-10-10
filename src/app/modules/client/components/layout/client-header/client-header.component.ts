import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/auth/auth.service';
import { initTranslation, TranslateService } from './i18n/i18n';

@Component({
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.scss']
})
export class ClientHeaderComponent implements OnInit {

  constructor(private _translateService: TranslateService,
              private _authService: AuthService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
  }

  get authService (): AuthService {
    return this._authService;
  }

  get translate (): TranslateService {
    return this._translateService;
  }
}
