import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user/user.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { environment } from '../../../../../environments/environment';
import { Template } from '../../../sidebar/interfaces/template';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})

export class SignupPageComponent implements OnInit {

  public isInvitation = false;
  private _sidebarTemplateValue: Template = {};
  private _sidebarState = new Subject<string>();
  private _linkedInLink: string;

  constructor(private authService: AuthService,
              private userService: UserService,
              private location1: Location,
              private activatedRoute: ActivatedRoute,
              private translateTitleService: TranslateTitleService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit(): void {
    this.translateTitleService.setTitle('COMMON.SIGN_UP');

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.isInvitation = params['invitation'] && params['invitation'] === 'true';
    });

    const linkedinConfig = {
      url: 'https://www.linkedin.com/oauth/v2/authorization',
      clientID: '77283cf7nmchg3',
      callbackURL: `${environment.apiUrl}/auth/linkedin/callback`,
      scope: 'r_emailaddress r_liteprofile r_basicprofile'
    };
    this._linkedInLink = `${linkedinConfig.url}?response_type=code&redirect_uri=${encodeURIComponent(linkedinConfig.callbackURL)}&scope=${encodeURIComponent(linkedinConfig.scope)}&state=U3iqySrotWCW8e0xRZO9dOC2&client_id=${linkedinConfig.clientID}`;

  }

  onSubmit(res: FormGroup) {
    if (res.valid) {
      const user = new User(res.value);
      user.domain = environment.domain;
      if (user.email.match(/umi.us/gi) && user.domain !== 'umi') {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_DOMAIN');
      } else {
        this.userService.create(user).pipe(first()).subscribe((_: any) => {
            this.authService.login(user).pipe(first()).subscribe(
              (_res: any) => {
                this.location1.back();
              },
              (error: any) => {
                this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
              }
            );
          },
          (error: any) => {
            this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.ALREADY_EXIST');
          }
        );
      }
    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }

  onSignUpClick(event: Event) {
    event.preventDefault();

    this._sidebarTemplateValue = {
      animate_state: this._sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIGN_UP.HEADING_SIDEBAR',
      type: 'isSignUp'
    };

  }

  closeSidebar(value: string) {
    this._sidebarTemplateValue.animate_state = value;
    this._sidebarState.next('inactive');
  }

  get domainCompanyName(): string {
    return environment.companyName;
  }

  checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  getCompanyUrl(): string {
    return environment.companyURL || '';
  }

  // getting the company logo.
  getLogo(): string {
    return environment.logoURL;
  }

  // getting the background image.
  backgroundImage(): string {
    return environment.background;
  }

  getLogoWBG(): string {
    return environment.logoSynthURL;
  }

  get linkedInLink(): string {
    return this._linkedInLink;
  }

  get sidebarTemplateValue(): Template {
    return this._sidebarTemplateValue;
  }

  set sidebarTemplateValue(value: Template) {
    this._sidebarTemplateValue = value;
  }

  get sidebarState(): Subject<string> {
    return this._sidebarState;
  }

  set sidebarState(value: Subject<string>) {
    this._sidebarState = value;
  }

}
