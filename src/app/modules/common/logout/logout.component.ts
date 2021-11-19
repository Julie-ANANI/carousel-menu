import { Component, OnInit } from '@angular/core';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../services/title/title.service';
import { AuthService } from '../../../services/auth/auth.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {SpinnerService} from '../../../services/spinner/spinner.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
})

export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService,
              private translateTitleService: TranslateTitleService,
              private spinnerService: SpinnerService,
              private translateNotificationsService: TranslateNotificationsService,
              private router: Router) {
    this.translateTitleService.setTitle('COMMON.PAGE_TITLE.LOG_OUT');
  }

  ngOnInit() {
    this.spinnerService.state(false);
    this.authService.logout().pipe(first()).subscribe((_) => {
      this._navigateTo('SUCCESS');
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this._navigateTo('ERROR');
    });
  }

  private _navigateTo(type: 'SUCCESS' | 'ERROR') {
    switch (type) {
      case 'ERROR':
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
        break;

      case 'SUCCESS':
        this.translateNotificationsService.success('ERROR.LOGIN.LOGOUT', 'ERROR.LOGIN.LOGOUT_TEXT');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        break;
    }
  }

}
