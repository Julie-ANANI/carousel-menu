import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { TranslateService, initTranslation } from '../../i18n/i18n';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.scss']
})
export class FooterComponent implements OnInit {
  private _companyName: string = environment.companyName;
  public displayLangChoices = false;

  constructor (private _translateService: TranslateService,
               private _cookieService: CookieService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  public propagateTranslation(lang: string) {
    this._cookieService.put('user_lang', lang||'en');
    this.translate.use(lang||'en');
  }

  get companyName(): string {
    return `${this._companyName} ${this.isMainDomain() ? '' : ' by United Motion Ideas'}`;
  }

  get translate (): TranslateService {
    return this._translateService;
  }

  get copyrightDate (): string {
    return (new Date()).getFullYear().toString();
  }

}
