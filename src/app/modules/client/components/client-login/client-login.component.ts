import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { User } from '../../../../models/user.model';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';
import { Compozer } from '../../../../utils/dynamic-form-compozer/classes/compozer';
import { TextboxCompozerComponent } from '../../../../utils/dynamic-form-compozer/classes/compozer-textbox';

@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.styl']
})
export class ClientLoginComponent implements OnInit {

  public compozerComponents: Compozer = new Compozer([
    [
      new TextboxCompozerComponent({
        key: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'john.doe@gmail.com',
        validators: [Validators.required, Validators.email]
      })
    ],
    [
      new TextboxCompozerComponent({
        key: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••••',
        validators: [Validators.required, Validators.minLength(4)]
      })
    ]
  ]);

  constructor(private _authService: AuthService,
              private _router: Router,
              private _translateService: TranslateService,
              private _titleService: Title,
              private _notificationsService: NotificationsService) { }

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('Log in'); // TODO translate
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
    this._authService.linkedinLogin()
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
