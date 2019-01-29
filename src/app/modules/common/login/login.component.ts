import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../services/title/title.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth/auth.service';
import { first } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';

import { RandomUtil } from "../../../utils/randomUtil";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  private _formData: FormGroup;

  private _linkedInLink: string;
  private _linkedInState: string = Date.now().toString()

  constructor(private translateTitleService: TranslateTitleService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private translateNotificationsService: TranslateNotificationsService,
              private router: Router,) {
  }

  ngOnInit() {
    this.translateTitleService.setTitle('LOG_IN.TITLE');
    this.buildForm();
    this.linkedInUrl();
  }


  private buildForm() {
    this._formData = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  private linkedInUrl(){
    const linkedinConfig = {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      clientID: '77283cf7nmchg3',
      callbackURL: `${environment.apiUrl}/auth/linkedin/callback`,
      scope: 'r_emailaddress r_liteprofile r_basicprofile'
    };
    this._linkedInState = RandomUtil.generateUUID();
    this._linkedInLink = `${linkedinConfig.url}?response_type=code&redirect_uri=${encodeURIComponent(linkedinConfig.callbackURL)}&scope=${encodeURIComponent(linkedinConfig.scope)}&state=${this._linkedInState}&client_id=${linkedinConfig.clientID}`;
  }

  public linkedInEvent() {
    const data = {
      domain: environment.domain,
      state: this._linkedInState
    };
    this.authService.preRegisterDataOAuth2('linkedin', data)
      .subscribe(_=>{
        console.log(_);
      }, err=>{
        console.error(err);
      }, ()=>{
        window.open(this._linkedInLink, '_self');
      });
  }


  onContinue() {
    if (this._formData.valid) {
      const user = new User(this._formData.value);
      user.domain = environment.domain;
      this.authService.login(user).pipe(first()).subscribe(() => {

        if (this.authService.isAuthenticated) {

          // Get the redirect URL from our auth service. If no redirect has been set, use the default.
          const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/';

          // Set our navigation extras object that passes on our global query params and fragment
          const navigationExtras: NavigationExtras = {
            queryParamsHandling: 'merge',
            preserveFragment: true
          };

          // Redirect the user
          this.router.navigate([redirect], navigationExtras);

        }
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
        this._formData.get('password').reset();
      });
    } else {
      if (this._formData.untouched && this._formData.pristine) {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
      }
    }
  }


  getBackgroundImage(): string {
    return environment.background;
  }

  getCompanyUrl(): string {
    return environment.companyURL || '';
  }

  getLogoWBG(): string {
    return environment.logoSynthURL;
  }

  checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  get formData(): FormGroup {
    return this._formData;
  }

  get linkedInLink(): string {
    return this._linkedInLink;
  }

}
