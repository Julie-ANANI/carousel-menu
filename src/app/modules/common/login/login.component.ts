import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateTitleService } from '../../../services/title/title.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { UserService } from '../../../services/user/user.service';
import {MediaFrontService} from '../../../services/media/media-front.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private _formData: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  private _helpMessageForm: FormGroup = this._formBuilder.group({
    contactEmail: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required]],
  });

  private _linkedInLink = '';

  private _linkedInState = Date.now().toString();

  private _displayLoading = false;

  private _displayLoadingLinkedIn = false;

  private _backgroundImage = '';

  private _nbTentatives = 5;

  private _isShowModal = false;

  private _companyUrl = environment.companyURL;

  private _logo = environment.logoSynthURL;

  private _isDomainUMI = environment.domain === 'umi';

  constructor(
    @Inject(PLATFORM_ID) protected _platformId: Object,
    private _translateTitleService: TranslateTitleService,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _routeFrontService: RouteFrontService,
    private _translateNotificationsService: TranslateNotificationsService,
    private _router: Router,
    private _userService: UserService
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

  public onClickLinkedIn() {
    this._displayLoadingLinkedIn = true;

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
          this._displayLoadingLinkedIn = false;
          console.error(err);
        },
        () => {
          window.open(this._linkedInLink, '_self');
        }
      );
  }

  public onClickLogin() {
    if (this._formData.valid) {
      this._displayLoading = true;
      const user = new User(this._formData.value);
      user.domain = environment.domain;

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
            this._displayLoading = false;
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              'ERROR.INVALID_FORM_DATA'
            );
            this._formData.get('password').reset();
          }
        );
    } else {
      if (this._formData.untouched && this._formData.pristine) {
        this._translateNotificationsService.error(
          'ERROR.ERROR',
          'ERROR.INVALID_FORM_DATA'
        );
      }
    }
  }

  get logo(): string {
    return this._logo;
  }

  get isDomainUMI(): boolean {
    return this._isDomainUMI;
  }

  get formData(): FormGroup {
    return this._formData;
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

  get helpMessageForm(): FormGroup {
    return this._helpMessageForm;
  }

  get companyUrl(): string {
    return this._companyUrl;
  }

  cancelMessage() {
    this._isShowModal = false;
    this._helpMessageForm.reset();
  }

  sendMessageToUMISupport() {
    const data = {
      umi: {
        email: 'support@umi.us',
      },
      user: {
        email: this._helpMessageForm.get('contactEmail').value,
        message: this._helpMessageForm.get('message').value,
      },
    };
    this._userService.contactUMISupport(data).subscribe(
      (next) => {
        this._isShowModal = false;
        if (next.status === 200) {
          this._translateNotificationsService.success(
            'Success',
            'We received your email, we will contact you soon.'
          );
        } else {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            'Sorry, an error occurred.'
          );
        }
      },
      (error) => {
        this._translateNotificationsService.error(
          'ERROR.ERROR',
          'An error occurred'
        );
        console.error(error);
      }
    );
  }
}
