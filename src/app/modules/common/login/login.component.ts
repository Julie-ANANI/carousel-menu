import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateTitleService } from '../../../services/title/title.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth/auth.service';
import { first } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { RandomUtil } from "../../../utils/randomUtil";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  private _formData: FormGroup;

  private _linkedInLink: string;

  private _linkedInState: string = Date.now().toString();

  private _displayLoading = false;

  private _displayLoadingLinkedIn = false;

  private _backgroundImage: string;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateTitleService: TranslateTitleService,
              private _formBuilder: FormBuilder,
              private _authService: AuthService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _router: Router) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.LOG_IN');
    this.buildForm();
    this.linkedInUrl();

    if (isPlatformBrowser(this._platformId)) {
      this._backgroundImage = environment.background;
    }

  }


  ngOnInit() {
  }

  private buildForm() {
    this._formData = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  private linkedInUrl() {
    const linkedinConfig = {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      clientID: '77283cf7nmchg3',
      callbackURL: `${environment.apiUrl}/auth/linkedin/callback`,
      scope: 'r_emailaddress r_liteprofile w_member_social'
    };

    this._linkedInState = RandomUtil.generateUUID();

    this._linkedInLink = `${linkedinConfig.url}?response_type=code&redirect_uri=${encodeURIComponent(linkedinConfig.callbackURL)}&scope=${encodeURIComponent(linkedinConfig.scope)}&state=${this._linkedInState}&client_id=${linkedinConfig.clientID}`;

  }

  public onClickLinkedIn() {
    this._displayLoadingLinkedIn = true;

    const data = {
      domain: environment.domain,
      state: this._linkedInState
    };

    this._authService.preRegisterDataOAuth2('linkedin', data).subscribe(_=>{console.log(_);
      }, (err) => {
      this._displayLoadingLinkedIn = false;
      console.error(err);
      }, () => {
        window.open(this._linkedInLink, '_self');
    });

  }

  public onClickContinue() {
    if (this._formData.valid) {

      this._displayLoading = true;

      const user = new User(this._formData.value);
      user.domain = environment.domain;

      this._authService.login(user).pipe(first()).subscribe(() => {

        if (this._authService.isAuthenticated) {

          // Get the redirect URL from our auth service. If no redirect has been set, use the default.
          const redirect = this._authService.redirectUrl ? this._authService.redirectUrl : '/';
          this._authService.redirectUrl = '';

          // Set our navigation extras object that passes on our global query params and fragment
          const navigationExtras: NavigationExtras = {
            queryParamsHandling: 'merge',
            preserveFragment: true
          };

          // Redirect the user
          this._router.navigate([redirect], navigationExtras);

        }
      }, () => {
        this._displayLoading = false;
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
        this._formData.get('password').reset();
      });
    } else {
      if (this._formData.untouched && this._formData.pristine) {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
      }
    }
  }

  getCompanyUrl(): string {
    return environment.companyURL || '';
  }

  getLogoWBG(): string {
    return environment.logoSynthURL;
  }

  checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  get formData(): FormGroup {
    return this._formData;
  }

  get linkedInLink(): string {
    return this._linkedInLink;
  }

  get displayLoading(): boolean {
    return this._displayLoading;
  }

  get displayLoadingLinkedIn(): boolean {
    return this._displayLoadingLinkedIn;
  }

  get backgroundImage(): string {
    return this._backgroundImage;
  }

}
