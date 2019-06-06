import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TranslateTitleService } from '../../../services/title/title.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { AuthService } from '../../../services/auth/auth.service';
import { SidebarInterface } from '../../sidebar/interfaces/sidebar-interface';
import { FormGroup } from '@angular/forms';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user/user.service';
import { RandomUtil } from "../../../utils/randomUtil";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  private _isInvitation = false;

  private _linkedInLink: string;

  private _linkedInState: string = Date.now().toString();

  private _sidebarValue: SidebarInterface = {};

  private _backgroundImage: string;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateTitleService: TranslateTitleService,
              private _activatedRoute: ActivatedRoute,
              private _translateNotificationsService: TranslateNotificationsService,
              private _authService: AuthService,
              private _userService: UserService,
              private _router: Router) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.SIGN_UP');

    this._activatedRoute.queryParams.subscribe((params: Params) => {
      this._isInvitation = params['invitation'] && params['invitation'] === 'true';
    });

    this.linkedInUrl();

    if (isPlatformBrowser(this._platformId)) {
      this._backgroundImage = environment.background;
    }

  }

  ngOnInit() {
  }

  private linkedInUrl() {
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

    this._authService.preRegisterDataOAuth2('linkedin', data).subscribe(_=>{
        console.log(_);
      }, err=>{
        console.error(err);
      }, ()=>{
        window.open(this._linkedInLink, '_self');
    });

  }

  public onSignUpClick(event: Event) {
    event.preventDefault();

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.SIGN_UP',
      type: 'signup'
    }

  }

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

  getCompanyUrl(): string {
    return environment.companyURL || '';
  }

  getLogoWBG(): string {
    return environment.logoSynthURL;
  }

  checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  get isInvitation(): boolean {
    return this._isInvitation;
  }

  get linkedInLink(): string {
    return this._linkedInLink;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get backgroundImage(): string {
    return this._backgroundImage;
  }

}
