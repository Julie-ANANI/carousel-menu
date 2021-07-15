import {Component} from '@angular/core';
import {TranslateTitleService} from '../../../services/title/title.service';
import {environment} from '../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})

export class NotFoundComponent {

  private _logo = environment.logoSynthURL;

  private _companyShortName = environment.companyShortName;

  constructor(private _translateService: TranslateService,
              private _translateTitleService: TranslateTitleService) {
    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.NOT_FOUND');
  }

  get logo(): string {
    return this._logo;
  }

  get companyShortName(): string {
    return this._companyShortName;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

}
