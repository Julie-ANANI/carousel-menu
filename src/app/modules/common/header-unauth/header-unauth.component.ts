import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SidebarInterface } from '../../sidebar/interfaces/sidebar-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { User } from '../../../models/user.model';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';
import { initTranslation } from '../../../i18n/i18n';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header-unauth',
  templateUrl: './header-unauth.component.html',
  styleUrls: ['./header-unauth.component.scss']
})

export class HeaderUnauthComponent implements OnInit {

  private _sidebarValue: SidebarInterface = {};

  private _toggleSignInForm = false;

  private _formData: FormGroup;

  private _currentLang: string;

  private _flag: string;

  private _modalSignIn: boolean = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateNotificationsService: TranslateNotificationsService,
              private _authService: AuthService,
              private _userService: UserService,
              private _router: Router,
              private _formBuilder: FormBuilder,
              private _translateService: TranslateService,
              private _cookieService: CookieService) {

    initTranslation(this._translateService);
    this._currentLang = this._translateService.currentLang;
    this._setFlag();
  }

  ngOnInit() {
    this._buildForm();
  }


  private _buildForm() {
    this._formData = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  private _setFlag() {
    this._flag = this._currentLang === 'en' ? 'US' : 'FR';
  }


  /***
   * set the lang as current lang.
   * @param lang
   */
  public setLang(lang: string) {
    this._cookieService.put('user_lang', lang || 'en');

    if (isPlatformBrowser(this._platformId)) {
      document.location.reload();
    } else {
      this._currentLang = lang;
      this._translateService.use(lang || 'en');
      this._setFlag();
    }

  }


  /***
   * this function is called when the user clicks on the sign in button.
   * it will open the form wrapper.
   * @param event
   */
  public onClickSignIn(event: Event) {
    event.preventDefault();
    this._modalSignIn = true;
  }


  /***
   * this function is called when the user clicks on the continue buttion in the
   * sign in form wrapper and redirect the user according to the requested page.
   */
  public onClickContinue() {
    if (this._formData.valid) {
      const user = new User(this._formData.value);
      user.domain = environment.domain;

      this._authService.login(user).pipe(first()).subscribe(() => {
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
        this._formData.get('password').reset();
      });

    } else {
      if (this._formData.untouched && this._formData.pristine) {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
      }
    }
  }


  /***
   * this function open the sign up sidebar where user can
   * fill the details to register in the framework.
   * @param event
   */
  public onClickSignUp(event: Event) {
    event.preventDefault();

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.SIGN_UP',
      type: 'signup'
    }

  }


  /***
   * this function is to register the new client.
   * @param formValue
   */
  public createUser(formValue: FormGroup) {
    if (formValue.valid) {
      const user = new User(formValue.value);
      user.domain = environment.domain;

      if (user.email.match(/umi.us/gi) && user.domain !== 'umi') {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_DOMAIN');
      } else {
        this._userService.create(user).pipe(first()).subscribe(() => {
          this._authService.login(user).pipe(first()).subscribe(() => {
            this._router.navigate(['/welcome']);
          }, () => {
            this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
          });
        }, () => {
          this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.ALREADY_EXIST');
        });
      }

    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }


  public getLogo(): string {
    return environment.logoURL;
  }


  public getCompany(): string {
    return environment.companyShortName;
  }


  public getContactUrl(): string {
    return this._currentLang === 'fr' ? 'https://www.umi.us/fr/contact/' : 'https://www.umi.us/contact/';
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get toggleSignInForm(): boolean {
    return this._toggleSignInForm;
  }

  get formData(): FormGroup {
    return this._formData;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get flag(): string {
    return this._flag;
  }

  get modalSignIn(): boolean {
    return this._modalSignIn;
  }

  set modalSignIn(value: boolean) {
    this._modalSignIn = value;
  }

}
