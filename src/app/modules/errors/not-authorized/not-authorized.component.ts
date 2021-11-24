import {Component} from '@angular/core';
import {TranslateTitleService} from '../../../services/title/title.service';
import {environment} from '../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {RouteFrontService} from '../../../services/route/route-front.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss']
})

export class NotAuthorizedComponent {

  private _logo = environment.logoSynthURL;

  private _companyShortName = environment.companyShortName;

  private _isReloading = false;

  constructor(private _translateService: TranslateService,
              private _routeFrontService: RouteFrontService,
              private _authService: AuthService,
              private _router: Router,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.NOT_AUTHORIZED');
  }

  public onClickReload() {
    this.isReloading = true;

    if (this.isAdmin) {
      this._router.navigate([this._routeFrontService.adminDefaultRoute()]);
    } else {
      this._router.navigate(['/user/projects']);
    }
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

  get isReloading(): boolean {
    return this._isReloading;
  }

  get isAdmin(): boolean {
    return this._authService.isAdmin;
  }

  set isReloading(value: boolean) {
    this._isReloading = value;
  }

}
