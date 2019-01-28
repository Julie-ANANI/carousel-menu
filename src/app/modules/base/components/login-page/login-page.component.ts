import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { User } from '../../../../models/user.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { environment } from '../../../../../environments/environment';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit {

  private _formData: FormGroup;
  private _linkedInLink: string;

  constructor(private _authService: AuthService,
              private router: Router,
              private formBuilder: FormBuilder,
              private translateTitleService: TranslateTitleService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit(): void {
    this.translateTitleService.setTitle('LOG_IN.TITLE');

    this._formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    const linkedinConfig = {
        url: 'https://www.linkedin.com/oauth/v2/authorization',
        clientID: '77283cf7nmchg3',
        callbackURL: `${environment.apiUrl}/auth/linkedin/callback`,
        scope: 'r_emailaddress r_liteprofile r_basicprofile'
    };
    this._linkedInLink = `${linkedinConfig.url}?response_type=code&redirect_uri=${encodeURIComponent(linkedinConfig.callbackURL)}&scope=${encodeURIComponent(linkedinConfig.scope)}&state=U3iqySrotWCW8e0xRZO9dOC2&client_id=${linkedinConfig.clientID}`;
  }

  onSubmit() {
    if (this._formData.valid) {
      const user = new User(this._formData.value);
      user.domain = environment.domain;

      this._authService.login(user).pipe(first()).subscribe(() => {
            if (this._authService.isAuthenticated) {
              // Get the redirect URL from our auth service
              // If no redirect has been set, use the default
              const redirect = this._authService.redirectUrl ? this._authService.redirectUrl : '/';

              // Set our navigation extras object
              // that passes on our global query params and fragment
              const navigationExtras: NavigationExtras = {
                queryParamsHandling: 'merge',
                preserveFragment: true
              };

              this.translateNotificationsService.success('ERROR.LOGIN.WELCOME', 'ERROR.LOGIN.LOGGED_IN');
              // Redirect the user
              this.router.navigate([redirect], navigationExtras);
            }
          },
        (err: any) => {
            this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
            this._formData.get('password').reset();
          });
    } else {
      if (this._formData.untouched && this._formData.pristine) {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
      }
    }

  }

  /*private linkedInUrl() {
    const domain = environment.domain;

    this._authService.linkedinLogin(domain).pipe(first()).subscribe(
      (url: string) => {
          this._linkedInLink = url;
      }, (error: any) => {
          this.translateNotificationsService.error('ERROR.ERROR', error.message);
      }
    );
  }*/

  checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  getCompanyUrl(): string {
    return environment.companyURL || '';
  }

  // getting the logo of the company
  getLogo(): string {
    return environment.logoURL;
  }

  getLogoWBG(): string {
    return environment.logoSynthURL;
  }

  // getting the background image of the company
  getBackgroundImage(): string {
    return environment.background;
  }

  get authService(): AuthService {
    return this._authService;
  }

  get formData(): FormGroup {
    return this._formData;
  }

  get linkedInLink(): string {
    return this._linkedInLink;
  }

}
