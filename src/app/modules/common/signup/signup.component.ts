import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  private _isInvitation = false;

  private _linkedInLink: string;

  private _sidebarValue: SidebarInterface = {};

  constructor(private translateTitleService: TranslateTitleService,
              private activatedRoute: ActivatedRoute,
              private translateNotificationsService: TranslateNotificationsService,
              private authService: AuthService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.translateTitleService.setTitle('COMMON.SIGN_UP');

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this._isInvitation = params['invitation'] && params['invitation'] === 'true';
    });

    this.linkedInUrl();

  }


  private linkedInUrl() {
    const linkedinConfig = {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      clientID: '77283cf7nmchg3',
      callbackURL: `${environment.apiUrl}/auth/linkedin/callback`,
      scope: 'r_emailaddress r_liteprofile r_basicprofile'
    };
    this._linkedInLink = `${linkedinConfig.url}?response_type=code&redirect_uri=${encodeURIComponent(linkedinConfig.callbackURL)}&scope=${encodeURIComponent(linkedinConfig.scope)}&state=U3iqySrotWCW8e0xRZO9dOC2&client_id=${linkedinConfig.clientID}`;

  }

  onSignUpClick(event: Event) {
    event.preventDefault();

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIGN_UP.HEADING_SIDEBAR',
      type: 'signup'
    }

  }


  createUser(formValue: FormGroup) {
    if (formValue.valid) {
      const user = new User(formValue.value);
      user.domain = environment.domain;

      if (user.email.match(/umi.us/gi) && user.domain !== 'umi') {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_DOMAIN');
      } else {
        this.userService.create(user).pipe(first()).subscribe(() => {
          this.authService.login(user).pipe(first()).subscribe(() => {
            this.router.navigate(['/welcome']);
          }, () => {
            this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
          });
        }, () => {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.ALREADY_EXIST');
        });
      }

    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
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

}
