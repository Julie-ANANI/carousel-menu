import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {TranslateTitleService} from "../../../services/title/title.service";
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {RouteFrontService} from '../../../services/route/route-front.service';
import {Router} from '@angular/router';

@Component({
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss']
})

export class NotAuthorizedComponent implements OnInit {

  private _isLoading = true;

  private _logo = environment.logoURL;

  private _companyShortName = environment.companyShortName;

  private _currentLang = this._translateService.currentLang;

  private _isReloading = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _routeFrontService: RouteFrontService,
              private _router: Router,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.NOT_AUTHORIZED');

  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
    }
  }

  public onClickReload() {
    this.isReloading = true;
    this._router.navigate([this._routeFrontService.adminDefaultRoute()]);
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

  get isReloading(): boolean {
    return this._isReloading;
  }

  set isReloading(value: boolean) {
    this._isReloading = value;
  }

}
