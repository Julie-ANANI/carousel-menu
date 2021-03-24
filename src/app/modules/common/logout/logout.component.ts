import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../services/title/title.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})

export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService,
              private translateTitleService: TranslateTitleService,
              private translateNotificationsService: TranslateNotificationsService,
              private router: Router) {

    this.translateTitleService.setTitle('COMMON.PAGE_TITLE.LOG_OUT');

  }

  ngOnInit() {

    this.authService.logout();
    this.translateNotificationsService.success('ERROR.LOGIN.LOGOUT', 'ERROR.LOGIN.LOGOUT_TEXT');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

}
