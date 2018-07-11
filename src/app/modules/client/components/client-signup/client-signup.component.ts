import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/filter';
import { AuthService } from '../../../../services/auth/auth.service';
import { environment } from '../../../../../environments/environment';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { UserService } from '../../../../services/user/user.service';
import { User } from '../../../../models/user.model';
import { Template } from '../../../shared/components/shared-sidebar/interfaces/template';


@Component({
  selector: 'app-client-signup',
  templateUrl: './client-signup.component.html',
  styleUrls: ['./client-signup.component.scss']
})

export class ClientSignupComponent implements OnInit {

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

      if(user.email.match(/umi.us/gi) && user.domain !== 'umi') {
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
      title: 'COMMON.SIGN_UP',
      type: 'signUp'
    }

  }

  closeSidebar(value: string) {
    this.sidebarTemplateValue.animate_state = value;
  }

}
