import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Location } from '@angular/common';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-logout-page',
  templateUrl: './logout-page.component.html',
  styleUrls: ['./logout-page.component.scss']
})

export class LogoutPageComponent implements OnInit {

  constructor(private authService: AuthService,
              private location1: Location,
              private translateTitleService: TranslateTitleService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit(): void {
    this.translateTitleService.setTitle('LOG_OUT.TITLE');
    this.authService.logout()
      .first()
      .subscribe(
        _ => {
          this.translateNotificationsService.success('ERROR.LOGIN.LOGOUT', 'ERROR.LOGIN.LOGOUT_TEXT');
          this.location1.back();
        },
        _ => {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
          this.location1.back();
        });
  }

}
