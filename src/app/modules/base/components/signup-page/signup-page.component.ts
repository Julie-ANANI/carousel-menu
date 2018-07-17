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

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  public isInvitation = false;
  sidebarTemplateValue: Template = {};

  constructor(private _authService: AuthService,
              private userService: UserService,
              private _location: Location,
              private activatedRoute: ActivatedRoute,
              private translateTitleService: TranslateTitleService,
              private translateNotificationsService: TranslateNotificationsService) {
  }

  ngOnInit(): void {
    this.translateTitleService.setTitle('COMMON.SIGN_UP');

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.isInvitation = params['invitation'] && params['invitation'] === 'true';
    });

  }

  linkedInSignUp(event: Event) {
    event.preventDefault();

    const domain = environment.domain;

    this._authService.linkedinLogin(domain).first().subscribe(url => {
        window.location.href = url;
      },
      error => {
        this.translateNotificationsService.error('ERROR.ERROR', error.message);
      }
    );

  }

  onSubmit(res: FormGroup) {
    if (res.valid) {
      const user = new User(res.value);

      user.domain = environment.domain;

      if (user.email.match(/umi.us/gi) && user.domain !== 'umi') {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_DOMAIN');
      }else {
        this.userService.create(user).first().subscribe(_ => {
            this._authService.login(user).first().subscribe(
              _ => {
                this._location.back();
              },
              error => {
                this.translateNotificationsService.error('ERROR.ERROR', error.message);
              }
            );
          },
          error => {
            this.translateNotificationsService.error('ERROR.ERROR', error.message);
          }
        );
      }
    }
    else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }

  }

  get domainCompanyName(): string {
    return environment.companyName;
  }

  public checkIsMainDomain(): boolean {
    return environment.domain === 'umi';
  }

  public getCompanyUrl(): string {
    return environment.companyURL || '';
  }

  // getting the company logo.
  public getLogo(): string {
    return environment.logoURL;
  }

  // getting the background image.
  public backgroundImage(): string {
    return environment.background;
  }

  public getLogoWBG(): string {
    return environment.logoSynthURL;
  }

  onSignUpClick(event: Event) {
    event.preventDefault();

    this.sidebarTemplateValue = {
      animate_state: this.sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIGN_UP.HEADING_SIDEBAR',
      type: 'signUp'
    }

  }

  closeSidebar(value: string) {
    this.sidebarTemplateValue.animate_state = value;
  }


}
