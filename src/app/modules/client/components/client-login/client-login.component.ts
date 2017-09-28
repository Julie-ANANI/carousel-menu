import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { EnvironmentService } from '../../../../services/common/environment.service';
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
              private _router: Router,
              private _formBuilder: FormBuilder,
              private _translateService: TranslateService,
              private _titleService: Title,
              private _notificationsService: NotificationsService,
              private _environmentService: EnvironmentService) { }

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('Log in'); // TODO translate

    this.formData = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]]
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
    const domain = this._environmentService.getDomain();
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

  get authService (): AuthService {
    return this._authService;
  }
}
