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
import { first } from 'rxjs/operators';
import { SidebarInterface } from '../../../sidebar/interfaces/sidebar-interface';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})

export class SignupPageComponent implements OnInit {

  private _isInvitation = false;

  private _linkedInLink: string;

  private _sidebarValue: SidebarInterface = {};

  constructor(private authService: AuthService,
              private userService: UserService,
              private location1: Location,
              private activatedRoute: ActivatedRoute,
              private translateTitleService: TranslateTitleService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit(): void {
    this.translateTitleService.setTitle('COMMON.SIGN_UP');

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this._isInvitation = params['invitation'] && params['invitation'] === 'true';
    });

    this.linkedInUrl();

  }


  private linkedInUrl() {
    const domain = environment.domain;

    this.authService.linkedinLogin(domain).pipe(first()).subscribe(
      (url: string) => {
        this._linkedInLink = url;
      }, (error: any) => {
        this.translateNotificationsService.error('ERROR.ERROR', error.message);
      }
    );

  }


  onSignUpClick(event: Event) {
    event.preventDefault();

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIGN_UP.HEADING_SIDEBAR',
      type: 'signup'
    }

  }


  closeSidebar(value: SidebarInterface) {
    this._sidebarValue.animate_state = value.animate_state;
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
            this.location1.back();
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

}
