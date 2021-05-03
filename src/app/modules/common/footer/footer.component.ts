import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent {

  private _companyName = environment.companyName;

  private _termsLink = this._translateService.currentLang === 'fr'
    ? 'https://www.umi.us/fr/conditions-generales/' : 'https://www.umi.us/terms-and-conditions/';

  private _privacyLink = this._translateService.currentLang === 'fr'
    ? 'https://www.umi.us/fr/protection-des-donnees/' : 'https://www.umi.us/privacy/';

  private _ideasLink = 'https://unitedmotionideas.aha.io/settings/account/idea_portals/6777639094795433405';

  constructor (private _translateService: TranslateService) { }

  private static _checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  get copyrightDate(): string {
    return (new Date()).getFullYear().toString();
  }

  get companyName(): string {
    return `${ this._companyName } ${ FooterComponent._checkIsMainDomain() ? '' : ' by United Motion Ideas' }`;
  }

  get termsLink(): string {
    return this._termsLink;
  }

  get privacyLink(): string {
    return this._privacyLink;
  }

  get ideasLink(): string {
    return this._ideasLink;
  }

}
