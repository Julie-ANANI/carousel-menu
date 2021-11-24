import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { UserService } from '../../../../../services/user/user.service';
import { environment } from '../../../../../../environments/environment';
import { first } from 'rxjs/operators';
import {emailRegEx} from '../../../../../utils/regex';

@Component({
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})

export class ForgetPasswordComponent implements OnInit {

  private _formData: FormGroup = this.formBuilder.group({});

  private _companyName = environment.companyShortName || 'umi';

  private _emailSent = false;

  private _companyLogo = environment.logoURL;

  constructor(private translateTitleService: TranslateTitleService,
              private formBuilder: FormBuilder,
              private translateNotificationsService: TranslateNotificationsService,
              private userService: UserService) {
    this.translateTitleService.setTitle('COMMON.PAGE_TITLE.FORGET');
  }

  ngOnInit() {
    this.buildForm();
  }


  private buildForm() {
    this._formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailRegEx)]]
    });
  }


  onClickSubmit() {
    if (this._formData.valid) {
      this.userService.resetPassword(this._formData.get('email').value).pipe(first()).subscribe(() => {
        this._emailSent = true;
      }, () => {
        this._emailSent = true;
      });
    } else {
      if (this._formData.untouched && this._formData.pristine) {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.LOGIN.EMAIL_PLEASE');
      }
    }

  }

  get companyLogo(): string {
    return this._companyLogo;
  }

  get formData(): FormGroup {
    return this._formData;
  }

  get emailSent(): boolean {
    return this._emailSent;
  }

  get companyName(): string {
    return this._companyName;
  }

}
