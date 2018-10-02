import { Component, OnInit } from '@angular/core';
import { initTranslation, TranslateService } from '../../../../i18n/i18n';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {

  private _companyName: string = environment.companyName;

  private _displayLangChoices: boolean; // to toggle the lang button

  constructor (private _translateService: TranslateService,
               private _cookieService: CookieService,
               private _authService: AuthService) {
  }

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._displayLangChoices = false;
  }

  /***
   * We are checking user is authenticated or not.
   * @returns {AuthService}
   */
  get authService(): AuthService {
    return this._authService;
  }

  checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  propagateTranslation(lang: string) {
    this._cookieService.put('user_lang', lang || 'en');
    this.translate.use(lang || 'en');
  }

  get companyName(): string {
    return `${ this._companyName } ${ this.checkIsMainDomain() ? '' : ' by United Motion Ideas' }`;
  }

  get translate(): TranslateService {
    return this._translateService;
  }

  get copyrightDate(): string {
    return (new Date()).getFullYear().toString();
  }

  set displayLangChoices(value: boolean) {
    this._displayLangChoices = value;
  }

  get displayLangChoices(): boolean {
    return this._displayLangChoices;
  }

}
