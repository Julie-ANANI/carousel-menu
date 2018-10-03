import { Component, OnInit } from '@angular/core';
import { initTranslation, TranslateService } from '../../../../i18n/i18n';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {

  private _companyName: string = environment.companyName;

  private _langs: Array<string>;

  private _currentLang: string;

  constructor (private translateService: TranslateService,
               private cookieService: CookieService) { }

  ngOnInit(): void {
    initTranslation(this.translateService);
    this.lang();
  }

  private lang () {
    this._langs = this.translate.getLangs();
    this._currentLang = this.translateService.currentLang;
  }

  /***
   * This is to change the lang, it is called when the user select an option.
   * @param event
   */
  changeLanguage(event: any) {
    if (event.target.value === 'French') {
      this.propagateTranslation('fr');
      this._currentLang = 'fr';
    } else {
      this.propagateTranslation('en');
      this._currentLang = 'en';
    }
  }

  /***
   * Setting the lang and the cookie.
   * @param {string} lang
   */
  private propagateTranslation(lang: string) {
    this.cookieService.put('user_lang', lang || 'en');
    this.translate.use(lang || 'en');
  }

  checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  get companyName(): string {
    return `${ this._companyName } ${ this.checkIsMainDomain() ? '' : ' by United Motion Ideas' }`;
  }

  getLogo(): string {
    return environment.logoURL;
  }

  get translate(): TranslateService {
    return this.translateService;
  }

  get copyrightDate(): string {
    return (new Date()).getFullYear().toString();
  }

  get langs(): Array<string> {
    return this._langs;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  set currentLang(value: string) {
    this._currentLang = value;
  }

}
