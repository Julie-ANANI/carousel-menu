import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { UserService } from '../../../../services/user/user.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-forget-password-page',
  templateUrl: './forget-password-page.component.html',
  styleUrls: ['./forget-password-page.component.scss']
})
export class ForgetPasswordPageComponent implements OnInit {

  private _formData: FormGroup;
  private _companyName: string = environment.companyShortName;
  private _emailSent: boolean;

  constructor(private translateTitleService: TranslateTitleService,
              private formBuilder: FormBuilder,
              private translateNotificationsService: TranslateNotificationsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.translateTitleService.setTitle('FORGET_PASSWORD.TITLE');

    this._emailSent = false;

    this._formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

  }

  onSubmit() {
    if (this._formData.valid) {
      this.userService.changePassword(this._formData.get('email').value).first().subscribe(() => {
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

  /*onResetLink(event: Event) {
    event.preventDefault();

    if (!this._formData.get('email')!.value) {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.LOGIN.EMAIL_PLEASE');
    } else if (this._formData.get('email').hasError('email')) {
      this._translateNotificationsService.error('ERROR.ERROR', 'COMMON.INVALID.EMAIL');
    } else {
      this.userService.changePassword(this._formData.get('email')!.value)
        .first()
        .subscribe(_ => {
          this._emailSent = true;
        }, _ => {
           // this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.LOGIN.EMAIL_NOT_FOUND');
          this._emailSent = true;
        });
    }

  }*/


  get formData(): FormGroup {
    return this._formData;
  }

  get emailSent(): boolean {
    return this._emailSent;
  }

  // getting the logo of the company
  public getLogo(): string {
    return environment.logoURL;
  }

  get companyName(){
    return (this._companyName || 'umi').toLocaleUpperCase();
  }

}
