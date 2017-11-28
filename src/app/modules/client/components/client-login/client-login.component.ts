import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../models/user.model';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';
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
              private _translateService: TranslateService,
              private _titleService: Title,
              private _notificationsService: NotificationsService) { }

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('Log in'); // TODO translate

    this.formData = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(this.passwordMinLength)]]
    });
  }

  onSubmit(form) {
    if (form.valid) {
      const user = new User(form.value);
      this._authService.login(user).subscribe(() => {
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

          this._notificationsService.success('Welcome back!', 'You now are logged in.'); // TODO translate

          // Redirect the user
          this._router.navigate([redirect], navigationExtras);
        }
      },
      err => {
        this._notificationsService.error('Erreur', err.message); // TODO translate
      });
    }
    else {
      this._notificationsService.error('Erreur', 'Formulaire non valide'); // TODO translate
    }
  }

  public linkedInSignIn() {
    const domain = environment.domain;
    this._authService.linkedinLogin(domain)
      .subscribe(
        url => {
          window.location.href = url;
        },
        error => {
          this._notificationsService.error('Erreur', error.message); // TODO translate
        }
      );
  }

  public changePassword() {
    if (!this.formData.get('email').value) {
      this._notificationsService.error('Empty email', 'Please enter your email before.'); // TODO translate
    }
    else {
      this._userService.changePassword(this.formData.get('email').value).subscribe(res => {
        console.log(res);
        this._notificationsService.success('We just sent you an email', 'To change your password, pease click on the link we just sent you by email.');
      });
    }
  }

  get authService (): AuthService {
    return this._authService;
  }
}
