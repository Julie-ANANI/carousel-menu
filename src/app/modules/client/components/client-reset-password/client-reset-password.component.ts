import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService, initTranslation } from './i18n/i18n';


@Component({
  selector: 'app-client-reset-password',
  templateUrl: './client-reset-password.component.html',
  styleUrls: ['./client-reset-password.component.scss']
})
export class ClientResetPasswordComponent implements OnInit {

  public formData: FormGroup;
  public passwordMinLength = 5;

  constructor(private _authService: AuthService,
              private _notificationsService: NotificationsService,
              private _translateService: TranslateService,
              private _userService: UserService,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    initTranslation(this._translateService);
    this.formData = this._formBuilder.group({
      email: [{value: this._authService.user.email || '', disabled: !!this._authService.user.email}, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]]
    });
  }

  onSubmit(form) {
    if (form.valid && form) {
      this._userService.updatePassword(form).subscribe(() => { // TODO Antoine

        },
        err => {
          this._notificationsService.error('Erreur', err.message); // TODO translate
        });
    }
    else {
      this._notificationsService.error('Erreur', 'Formulaire non valide'); // TODO translate
    }
  }

}
