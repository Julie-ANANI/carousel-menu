import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { User } from '../../../../models/user.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { environment } from '../../../../../environments/environment';

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

    this.linkedInUrl();

  }

  onSubmit() {
    if (this._formData.valid) {
      const user = new User(this._formData.value);
      user.domain = environment.domain;

      this._authService.login(user)
        .first()
        .subscribe(() => {
            if (this._authService.isAuthenticated) {
              // Get the redirect URL from our auth service
              // If no redirect has been set, use the default
              const redirect = this._authService.redirectUrl ? this._authService.redirectUrl : '/';

              // Set our navigation extras object
              // that passes on our global query params and fragment
              const navigationExtras: NavigationExtras = {
                preserveQueryParams: true,
                preserveFragment: true
              };

              this.translateNotificationsService.success('ERROR.LOGIN.WELCOME', 'ERROR.LOGIN.LOGGED_IN');
              // Redirect the user
              this.router.navigate([redirect], navigationExtras);
            }
          },
          err => {
            this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
          });
    } else {
      if (this._formData.untouched && this._formData.pristine) {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
      }
    }

  }

  private linkedInUrl() {
    const domain = environment.domain;

    this._authService.linkedinLogin(domain).first().subscribe(
        url => {
          this._linkedInLink = url;
        },
        error => {
          this.translateNotificationsService.error('ERROR.ERROR', error.message);
        }
      );

  }

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
