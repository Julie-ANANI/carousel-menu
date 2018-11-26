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

  constructor(private authService: AuthService,
              private router: Router,
              private formBuilder: FormBuilder,
              private translateTitleService: TranslateTitleService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit(): void {
    this.translateTitleService.setTitle('LOG_IN.TITLE');
    this.buildForm();
    this.linkedInUrl();
  }


  private buildForm() {
    this._formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  private linkedInUrl() {
    const domain = environment.domain;

    this.authService.linkedinLogin(domain).pipe(first()).subscribe((url: string) => {
        this._linkedInLink = url;
      }, (error: any) => {
        this.translateNotificationsService.error('ERROR.ERROR', error.message);
      }
    );

  }


  onContinue() {
    if (this._formData.valid) {
      const user = new User(this._formData.value);
      user.domain = environment.domain;
      this.authService.login(user).pipe(first()).subscribe(() => {

        if (this.authService.isAuthenticated) {

          // Get the redirect URL from our auth service. If no redirect has been set, use the default.
          const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/';

          // Set our navigation extras object that passes on our global query params and fragment
          const navigationExtras: NavigationExtras = {
            queryParamsHandling: 'merge',
            preserveFragment: true
          };

          // Redirect the user
          this.router.navigate([redirect], navigationExtras);

        }
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
        this._formData.get('password').reset();
      });
    } else {
      if (this._formData.untouched && this._formData.pristine) {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
      }
    }
  }


  getBackgroundImage(): string {
    return environment.background;
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

}
