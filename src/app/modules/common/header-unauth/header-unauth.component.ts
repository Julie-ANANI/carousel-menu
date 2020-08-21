import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SidebarInterface } from '../../sidebars/interfaces/sidebar-interface';
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

@Component({
  selector: 'app-header-unauth',
  templateUrl: './header-unauth.component.html',
  styleUrls: ['./header-unauth.component.scss']
})

export class HeaderUnauthComponent implements OnInit {

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  private _formData: FormGroup;

  private _flag = 'US';

  private _modalSignIn = false;

  private _displayMenuOptions = false; // on small devices if true then display menu options.

  private _showLangs = false;

  private _isCreatingAccount = false;

  private _company = environment.companyShortName;

  private _logo = environment.logoURL;

  private _isLogging = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateNotificationsService: TranslateNotificationsService,
              private _authService: AuthService,
              private _userService: UserService,
              private _router: Router,
              private _formBuilder: FormBuilder,
              private _translateService: TranslateService,
              private _cookieService: CookieService) {

    initTranslation(this._translateService);
  }

  ngOnInit() {
    this._setFlag();

    this._formData = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  private _setFlag() {
    this._flag = this.currentLang === 'en' ? 'US' : 'FR';
  }

  /***
   * set the lang as current lang.
   * @param lang
   */
  public setLang(lang: string) {
    this._cookieService.put('user_lang', lang || 'en');
    this._translateService.use(lang || 'en');
    this._setFlag();
  }

  /***
   * to toggle the value of menu options display.
   */
  public toggleMenuState(event: Event) {
    event.preventDefault();
    this._displayMenuOptions = !this._displayMenuOptions;
  }

  public toggleLangOptions(event: Event) {
    event.preventDefault();
    this._showLangs = !this._showLangs;
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
   * this function is called when the user clicks on the continue button in the
   * login form wrapper and redirect the user according to the requested page.
   */
  public onClickContinue() {
    if (this._formData.valid) {
      this._isLogging = true;
      const user = new User(this._formData.value);
      user.domain = environment.domain;

      this._authService.login(user).pipe(first()).subscribe(() => {
      }, () => {
        this._isLogging = false;
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
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.SIGN_UP',
    }
  }

  /***
   * this function is to register the new client.
   * @param formValue
   */
  public createUser(formValue: FormGroup) {
    if (formValue.valid) {
      this._isCreatingAccount = true;
      const user = new User(formValue.value);
      user.domain = environment.domain;

      if (user.email.match(/umi.us/gi) && user.domain !== 'umi') {
        this._isCreatingAccount = false;
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_DOMAIN');
      } else {
        this._userService.create(user).pipe(first()).subscribe(() => {
          this._authService.login(user).pipe(first()).subscribe(() => {
            this._router.navigate(['/welcome']);
          }, () => {
            this._isCreatingAccount = false;
            this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
          });
        }, () => {
          this._isCreatingAccount = false;
          this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.ALREADY_EXIST');
        });
      }

    } else {
      this._isCreatingAccount = false;
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }

  public getLogo(): string {
    return environment.logoURL;
  }

  get company(): string {
    return this._company;
  }

  get contactUrl(): string {
    return this.currentLang === 'fr' ? 'https://www.umi.us/fr/contact/' : 'https://www.umi.us/contact/';
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get formData(): FormGroup {
    return this._formData;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
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

  get displayMenuOptions(): boolean {
    return this._displayMenuOptions;
  }

  get showLangs(): boolean {
    return this._showLangs;
  }

  get isCreatingAccount(): boolean {
    return this._isCreatingAccount;
  }

  get logo(): string {
    return this._logo;
  }

  get isLogging(): boolean {
    return this._isLogging;
  }

}
