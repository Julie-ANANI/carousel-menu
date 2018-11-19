import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { Location } from '@angular/common';
import { TranslateTitleService } from '../../../services/title/title.service';
import { AuthService } from '../../../services/auth/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})

export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService,
              private location: Location,
              private translateTitleService: TranslateTitleService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this.translateTitleService.setTitle('COMMON.LOG_OUT');

    this.authService.logout().pipe(first()).subscribe(() => {
      this.translateNotificationsService.success('ERROR.LOGIN.LOGOUT', 'ERROR.LOGIN.LOGOUT_TEXT');
      setTimeout(() => {
        this.location.back();
      }, 2000);
      }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
      setTimeout(() => {
        this.location.back();
      }, 2000);
    });
  }

}
