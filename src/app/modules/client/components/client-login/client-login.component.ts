import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../models/user.model';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.scss']
})
export class ClientLoginComponent implements OnInit {

  public formData: FormGroup;
  public passwordMinLength = 5;

  constructor(private _authService: AuthService,
              private _userService: UserService,
              private _router: Router,
              private _formBuilder: FormBuilder,
              private _titleService: TranslateTitleService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit(): void {
    this._titleService.setTitle('LOG_IN.TITLE');

    this.formData = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]]
    });

  }

  onSubmit() {
    if (this.formData.valid) {
      const user = new User(this.formData.value);
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
          this._notificationsService.error('ERROR.ERROR', err.message);
        });
    }
    else {
      this._notificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
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

  public changePassword(event: Event) {
    event.preventDefault();
    if (!this.formData.get('email')!.value) {
      this._notificationsService.error('ERROR.LOGIN.EMPTY_EMAIL', 'ERROR.LOGIN.EMAIL_PLEASE');
    }
    else {
      this._userService.changePassword(this.formData.get('email')!.value)
        .first()
        .subscribe(_ => {
          this._notificationsService.success('ERROR.LOGIN.EMAIL_SENT', 'ERROR.LOGIN.CHANGE_PASSWORD');
        }, _ => {
          this._notificationsService.error('ERROR.ERROR', 'ERROR.LOGIN.EMAIL_NOT_FOUND');
        });
    }
  }

  get authService (): AuthService {
    return this._authService;
  }

  public isMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  public logoName(): string {
    return environment.logoURL;
  }

  public backgroundImage(): string {
    return environment.background;
  }

}
