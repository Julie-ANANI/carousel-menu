import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent {

  private _companyName: string = environment.companyName;

  constructor (private _translateService: TranslateService) { }

  public get copyrightDate(): string {
    return (new Date()).getFullYear().toString();
  }

  private static _checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  public get companyName(): string {
    return `${ this._companyName } ${ FooterComponent._checkIsMainDomain() ? '' : ' by United Motion Ideas' }`;
  }

  public getTermsLink(): string {
    return this._translateService.currentLang === 'en' ? 'https://www.umi.us/terms/' : 'https://www.umi.us/fr/mentions-legales/';
  }

  public getPrivacyLink(): string {
    return this._translateService.currentLang === 'en' ? 'https://www.umi.us/privacy/' : 'https://www.umi.us/fr/confidentialite/';
  }

}
