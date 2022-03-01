import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {TranslateTitleService} from '../../../services/title/title.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {TranslateNotificationsService} from '../../../services/translate-notifications/translate-notifications.service';
import {AuthService} from '../../../services/auth/auth.service';
import {FormGroup} from '@angular/forms';
import {User} from '../../../models/user.model';
import {UserService} from '../../../services/user/user.service';
import {RandomUtil} from '../../../utils/randomUtil';
import {isPlatformBrowser} from '@angular/common';
import {MediaFrontService} from '../../../services/media/media-front.service';
import {TranslateService} from '@ngx-translate/core';
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorFrontService } from "../../../services/error/error-front.service";
import {UmiusSidebarInterface} from '@umius/umi-common-component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  private _isInvitation = false;

  private _linkedInLink = '';

  private _linkedInState: string = Date.now().toString();

  private _sidebarValue: UmiusSidebarInterface = <UmiusSidebarInterface>{};

  private _backgroundImage = '';

  private _isCreatingAccount = false;

  private _logo = environment.logoSynthURL;

  private _isDomainUMI = environment.domain === 'umi';

  private _isCreatingAccountLinkedin = false;

  private _companyUrl = environment.companyURL;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateTitleService: TranslateTitleService,
              private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _authService: AuthService,
              private _userService: UserService,
              private _router: Router) {
    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.SIGN_UP');
  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe((params: Params) => {
      this._isInvitation = params['invitation'] && params['invitation'] === 'true';
    });

    if (isPlatformBrowser(this._platformId)) {
      this._backgroundImage = MediaFrontService.customDefaultImageSrc(environment.background, '480', '2000');
      this.linkedInUrl();
    }
  }

  private linkedInUrl() {
    const linkedinConfig = {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      clientID: '77283cf7nmchg3',
      callbackURL: `${environment.apiUrl}/auth/linkedin/callback`,
      scope: 'r_emailaddress r_liteprofile w_member_social'
    };

    this._linkedInState = RandomUtil.generateUUID();

    this._linkedInLink = `${linkedinConfig.url}?response_type=code&redirect_uri=${encodeURIComponent(linkedinConfig.callbackURL)}&scope=${encodeURIComponent(linkedinConfig.scope)}&state=${this._linkedInState}&client_id=${linkedinConfig.clientID}`;

  }

  public linkedInEvent() {
    this._isCreatingAccountLinkedin = true;
    const data = {
      domain: environment.domain,
      state: this._linkedInState
    };

    this._authService.preRegisterDataOAuth2('linkedin', data).pipe(first()).subscribe(_ => {
      this._isCreatingAccountLinkedin = false;
    }, err => {
      this._isCreatingAccountLinkedin = false;
      console.error(err);
    }, () => {
      window.open(this._linkedInLink, '_self');
    });

  }

  public onSignUpClick(event: Event) {
    event.preventDefault();
    this._isCreatingAccount = false;
    this._sidebarValue = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.SIGN_UP'
    };
  }

  public createUser(formValue: FormGroup) {
    if (formValue.valid) {
      const user = new User(formValue.value);
      user.language = this._translateService.currentLang;
      user.domain = environment.domain;

      if (user.email.match(/umi.us/gi) && user.domain !== 'umi') {
        this._isCreatingAccount = false;
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_DOMAIN');
      }
      else {
        this._userService.create(user).pipe(first()).subscribe(() => {
          this._authService.login(user).pipe(first()).subscribe(() => {
            this._router.navigate(['/welcome']);
          }, (error: HttpErrorResponse) => {
            console.log(error);
            this._isCreatingAccount = false;
            this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
          });
        }, (error: HttpErrorResponse) => {
          console.log(error);
          this._isCreatingAccount = false;
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(error.error));
        });
      }

    }
    else {
      this._isCreatingAccount = false;
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }

  get logo(): string {
    return this._logo;
  }

  get isDomainUMI(): boolean {
    return this._isDomainUMI;
  }

  get isInvitation(): boolean {
    return this._isInvitation;
  }

  get sidebarValue(): UmiusSidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: UmiusSidebarInterface) {
    this._sidebarValue = value;
  }

  get backgroundImage(): string {
    return this._backgroundImage;
  }

  get isCreatingAccount(): boolean {
    return this._isCreatingAccount;
  }

  get isCreatingAccountLinkedin(): boolean {
    return this._isCreatingAccountLinkedin;
  }

  get companyUrl(): string {
    return this._companyUrl;
  }

}
