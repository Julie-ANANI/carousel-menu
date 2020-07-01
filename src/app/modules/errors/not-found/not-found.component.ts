import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {TranslateTitleService} from "../../../services/title/title.service";
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})

export class NotFoundComponent implements OnInit {

  private _isLoading = true;

  private _logo = environment.logoURL;

  private _companyShortName = environment.companyShortName;

  private _currentLang = this._translateService.currentLang;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.NOT_FOUND');

  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get logo(): string {
    return this._logo;
  }

  get companyShortName(): string {
    return this._companyShortName;
  }

  get currentLang(): string {
    return this._currentLang;
  }

}
