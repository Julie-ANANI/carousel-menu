import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateTitleService } from '../../../services/title/title.service';
import { environment } from '../../../../environments/environment';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth/auth.service';
import { first } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { RandomUtil } from '../../../utils/randomUtil';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouteFrontService } from '../../../services/route/route-front.service';
import { MediaFrontService } from '../../../services/media/media-front.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  private _linkedInLink = '';

  private _baseApi = environment.apiUrl;

  private _clientUrl = environment.clientUrl;

  private _domain = environment.domain;

  private _linkedInState = Date.now().toString();

  private _backgroundImage = '';

  private _nbTentatives = 5;

  private _isShowModal = false;

  private _companyUrl = environment.companyURL;

  private _logo = environment.logoSynthURL;

  private _isDomainUMI = environment.domain === 'umi';

  constructor(
    @Inject(PLATFORM_ID) protected _platformId: Object,
    private _translateTitleService: TranslateTitleService,
    private _authService: AuthService,
    private _routeFrontService: RouteFrontService,
    private _translateNotificationsService: TranslateNotificationsService,
    private _router: Router
  ) {
    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.LOG_IN');
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._backgroundImage = MediaFrontService.customDefaultImageSrc(environment.background, '480', '2000');
      this.linkedInUrl();
    }
  }

  private linkedInUrl() {
    const linkedinConfig = {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      clientID: '77283cf7nmchg3',
      callbackURL: `${environment.apiUrl}/auth/linkedin/callback`,
      scope: 'r_emailaddress r_liteprofile w_member_social',
    };

    this._linkedInState = RandomUtil.generateUUID();
    this._linkedInLink = `${
      linkedinConfig.url
    }?response_type=code&redirect_uri=${encodeURIComponent(
      linkedinConfig.callbackURL
    )}&scope=${encodeURIComponent(linkedinConfig.scope)}&state=${
      this._linkedInState
    }&client_id=${linkedinConfig.clientID}`;
  }

  get logo(): string {
    return this._logo;
  }

  get isDomainUMI(): boolean {
    return this._isDomainUMI;
  }

  get backgroundImage(): string {
    return this._backgroundImage;
  }

  get nbTentatives(): number {
    return this._nbTentatives;
  }

  showContactUMIModal() {
    this._isShowModal = true;
  }

  get isShowModal(): boolean {
    return this._isShowModal;
  }

  set isShowModal(value: boolean) {
    this._isShowModal = value;
  }

  get companyUrl(): string {
    return this._companyUrl;
  }

  get baseApi(): string {
    return this._baseApi;
  }

  get clientUrl(): string {
    return this._clientUrl;
  }

  get domain(): string {
    return this._domain;
  }

  loginOnChange(event: any) {
    if (event && event.status) {
      const user = new User(event.message);
      this._authService
        .login(user)
        .pipe(first())
        .subscribe(
          () => {
            if (this._authService.isAuthenticated) {
              // Get the redirect URL from our auth service. If no redirect has been set, use the default.
              const redirect = this._authService.redirectUrl
                ? this._authService.redirectUrl
                : this._authService.isAdmin
                  ? this._routeFrontService.adminDefaultRoute()
                  : '/';

              this._authService.redirectUrl = '';

              // Set our navigation extras object that passes on our global query params and fragment
              const navigationExtras: NavigationExtras = {
                queryParamsHandling: 'merge',
                preserveFragment: true,
              };

              // Redirect the user
              this._router.navigate([redirect], navigationExtras);
            }
          },
          () => {
            this._nbTentatives -= 1;
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              'ERROR.INVALID_FORM_DATA'
            );
          }
        );
    }
  }

  loginWithLinkedin(event: any) {
    if (event && event.status) {
      const data = {
        domain: environment.domain,
        state: this._linkedInState,
      };
      this._authService
        .preRegisterDataOAuth2('linkedin', data)
        .pipe(first())
        .subscribe(
          (_) => {
            console.log(_);
          },
          (err: HttpErrorResponse) => {
            console.error(err);
          },
          () => {
            window.open(this._linkedInLink, '_self');
          }
        );
    }
  }

  contactUMIOnChange(event: any) {
    if (event && event.status) {
      this._translateNotificationsService.success(
        'Success',
        'We received your email, we will contact you soon.'
      );
    } else {
      this._translateNotificationsService.error(
        'ERROR.ERROR',
        'An error occurred'
      );
    }
  }

  forgetPasswordEventOnChange(event: any) {
    if (event) {
      switch (event.action) {
        case 'signUp':
          this._router.navigate(['/register']);
          break;
      }
    }
  }
}
