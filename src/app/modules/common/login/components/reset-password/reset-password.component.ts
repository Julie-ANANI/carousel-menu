import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { UserService } from '../../../../../services/user/user.service';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from '../../../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'forget-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {

  private _formData: FormGroup;

  private _companyName: string = environment.companyShortName;

  constructor(private translateTitleService: TranslateTitleService,
              private formBuilder: FormBuilder,
              private translateNotificationsService: TranslateNotificationsService,
              private userService: UserService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.translateTitleService.setTitle('RESET_PASSWORD.TITLE');
    this.buildForm();
  }


  private buildForm() {
    this._formData = this.formBuilder.group({
      email: [{ value: this.authService.isAuthenticated ? this.authService.user.email : '', disabled: this.authService.isAuthenticated && this.authService.user.email },
        [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(9)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(9)]]
    });
  }


  onSubmit() {
    if (this._formData.valid && this._formData.get('email')!.value) {
      if (this._formData.get('password')!.value === this._formData.get('passwordConfirm')!.value) {
        this.activatedRoute.params.first().subscribe(params => {
          const tokenEmail = params['tokenEmail'];
          this.userService.updatePassword({
            email: this._formData.get('email')!.value,
            password: this._formData.get('password')!.value,
            passwordConfirm: this._formData.get('passwordConfirm')!.value,
            tokenEmail: tokenEmail
          }).pipe(first()).subscribe(_ => {
              this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PASSWORD_UPDATED_TEXT');
              this.router.navigate(['/']);
            },
            err => {
              this.translateNotificationsService.error('ERROR.ERROR', err.message);
            });
        });
      } else {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.ACCOUNT.SAME_PASSWORD');
      }
    }
    else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }

  }


  get formData(): FormGroup {
    return this._formData;
  }


  getLogo(): string {
    return environment.logoURL;
  }

  get companyName(){
    return (this._companyName || 'umi').toLocaleUpperCase();
  }

}
