import { Component } from '@angular/core';
import { TranslateNotificationsService } from '../../../../../services/translate-notifications/translate-notifications.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { UserService } from '../../../../../services/user/user.service';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from '../../../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {emailRegEx} from '../../../../../utils/regex';
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorFrontService } from "../../../../../services/error/error-front.service";

@Component({
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent {

  get companyName(): string {
    return this._companyName;
  }

  get companyLogo(): string {
    return this._companyLogo;
  }

  get companyUrl(): string {
    return this._companyUrl;
  }

  private _formData: FormGroup = this.formBuilder.group({
    email: [{
      value: this.authService.isAuthenticated ? this.authService.user.email : '',
      disabled: this.authService.isAuthenticated && this.authService.user.email
    },
      [Validators.required, Validators.pattern(emailRegEx)]
    ],
    password: ['', [Validators.required, Validators.minLength(9)]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(9)]]
  });

  private _companyName: string = environment.companyShortName;

  private _companyUrl = environment.companyURL;

  private _companyLogo = environment.logoURL;

  constructor(private translateTitleService: TranslateTitleService,
              private formBuilder: FormBuilder,
              private translateNotificationsService: TranslateNotificationsService,
              private userService: UserService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.translateTitleService.setTitle('COMMON.PAGE_TITLE.RESET');
  }

  onClickSubmit() {
    if (this._formData.valid && this._formData.get('email')!.value) {

      if (this._formData.get('password')!.value === this._formData.get('passwordConfirm')!.value) {

        this.activatedRoute.params.subscribe(params => {
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
            (error: HttpErrorResponse) => {
              this.translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
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

}
