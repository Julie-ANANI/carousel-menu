import { Component, OnInit } from '@angular/core';
import { TranslateService, initTranslation } from './i18n/i18n';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-client-footer',
  templateUrl: './client-footer.component.html',
  styleUrls: ['./client-footer.component.scss']
})
export class ClientFooterComponent implements OnInit {
  private _companyName: string = environment.companyName;

  constructor (private _translateService: TranslateService,
               private _authService: AuthService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
  }

  public changeLang (newLang) {
    this._translateService.use(newLang); // TODO retenir la préférence dans un cookie éventuellement
  }

  get companyName(): string {
    return this._companyName;
  }

  get authService (): AuthService {
    return this._authService;
  }

  get translate (): TranslateService {
    return this._translateService;
  }

}
