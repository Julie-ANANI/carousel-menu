import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TranslateTitleService } from '../../../services/title/title.service';
import { ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  isInvitation = false;

  linkedInLink: string;

  constructor(private translateTitleService: TranslateTitleService,
              private activatedRoute: ActivatedRoute,
              private translateNotificationsService: TranslateNotificationsService,
              private authService: AuthService,) { }

  ngOnInit() {
    this.translateTitleService.setTitle('COMMON.SIGN_UP');

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.isInvitation = params['invitation'] && params['invitation'] === 'true';
    });

    this.linkedInUrl();

  }


  private linkedInUrl() {
    const domain = environment.domain;

    this.authService.linkedinLogin(domain).pipe(first()).subscribe(
      (url: string) => {
        this.linkedInLink = url;
      }, (error: any) => {
        this.translateNotificationsService.error('ERROR.ERROR', error.message);
      }
    );

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

}
