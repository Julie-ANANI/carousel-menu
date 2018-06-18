import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../models/user.model';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.scss']
})

export class ClientLoginComponent implements OnInit {

  private _formData: FormGroup;

  constructor(private _authService: AuthService,
              private _userService: UserService,
              private _router: Router,
              private _formBuilder: FormBuilder,
              private _titleService: TranslateTitleService,
              private _notificationsService: TranslateNotificationsService) {
  }

  ngOnInit(): void {
    this._titleService.setTitle('LOG_IN.TITLE');

    this._formData = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

  }

  onSubmit() {
    if (this._formData.valid) {
      const user = new User(this._formData.value);

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

            this._notificationsService.success('ERROR.LOGIN.WELCOME', 'ERROR.LOGIN.LOGGED_IN');
            // Redirect the user
            this._router.navigate([redirect], navigationExtras);
          }
        },
        err => {
          this._notificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
        });
    } else {
      if (this._formData.untouched && this._formData.pristine) {
        this._notificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
      }
    }

  }

  public linkedInSignIn(event: Event) {
    event.preventDefault();

    const domain = environment.domain;

    this._authService.linkedinLogin(domain)
      .first()
      .subscribe(
        url => {
          window.location.href = url;
        },
        error => {
          this._notificationsService.error('ERROR.ERROR', error.message);
        }
      );

  }

  get authService(): AuthService {
    return this._authService;
  }

  get formData(): FormGroup {
    return this._formData;
  }

  public checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  public getCompanyUrl(): string {
    return environment.companyURL || "";
  }

  // getting the logo of the company
  public getLogo(): string {
    return environment.logoURL;
  }

  // getting the background image of the company
  public getBackgroundImage(): string {
    return environment.background;
  }

}
