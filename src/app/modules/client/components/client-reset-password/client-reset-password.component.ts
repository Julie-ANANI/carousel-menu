import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { UserService } from '../../../../services/user/user.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-client-reset-password',
  templateUrl: './client-reset-password.component.html',
  styleUrls: ['./client-reset-password.component.scss']
})
export class ClientResetPasswordComponent implements OnInit {

  public formData: FormGroup;
  public passwordMinLength = 8;

  constructor(private _authService: AuthService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _notificationsService: TranslateNotificationsService,
              private _userService: UserService,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formData = this._formBuilder.group({
      email: [{
        value: this._authService.isAuthenticated ? this._authService.user.email : '',
        disabled: this._authService.isAuthenticated && this._authService.user.email
      }, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(this.passwordMinLength)]]
    });
  }

  onSubmit() {
    if (this.formData.valid && this.formData.get('email')!.value) {
      if (this.formData.get('password')!.value === this.formData.get('passwordConfirm')!.value) {
        this._activatedRoute.params.first().subscribe((params: any) => {
          const tokenEmail = params['tokenEmail'];
          this._userService.updatePassword({
            email: this.formData.get('email')!.value,
            password: this.formData.get('password')!.value,
            passwordConfirm: this.formData.get('passwordConfirm')!.value,
            tokenEmail: tokenEmail
          }).first().subscribe((_: any) => {
              this._notificationsService.success('ERROR.ACCOUNT.PASSWORD_UPDATED', 'ERROR.ACCOUNT.PASSWORD_UPDATED_TEXT');
              this._router.navigate(['/account']);
            }, (err: any) => {
              this._notificationsService.error('ERROR.ERROR', err.message);
            });
        });
      } else {
        this._notificationsService.error('ERROR.ERROR', 'ERROR.ACCOUNT.SAME_PASSWORD');
      }
    }
    else {
      this._notificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }
}
