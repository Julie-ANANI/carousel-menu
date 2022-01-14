import {Component, OnDestroy, OnInit} from '@angular/core';
import { TranslateNotificationsService } from '../../../services/translate-notifications/translate-notifications.service';
import { TranslateTitleService } from '../../../services/title/title.service';
import { AuthService } from '../../../services/auth/auth.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})

export class LogoutComponent implements OnInit, OnDestroy {

  get clearTimeout(): any {
    return this._clearTimeout;
  }

  private _clearTimeout: any;

  constructor(private authService: AuthService,
              private translateTitleService: TranslateTitleService,
              private translateNotificationsService: TranslateNotificationsService,
              private router: Router) {
    this.translateTitleService.setTitle('COMMON.PAGE_TITLE.LOG_OUT');
  }

  ngOnInit(): void {
    this.authService.logout().pipe(first()).subscribe(() => {
      this._navigateTo('SUCCESS');
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this._navigateTo('ERROR');
    });
  }

  private _navigateTo(type: 'SUCCESS' | 'ERROR'): void {
    switch (type) {
      case 'ERROR':
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
        this._clearTimeout = setTimeout(() => {
          this.router.navigate(['/']).then();
        }, 2000);
        break;

      case 'SUCCESS':
        this.translateNotificationsService.success('ERROR.LOGIN.LOGOUT', 'ERROR.LOGIN.LOGOUT_TEXT');
        this._clearTimeout = setTimeout(() => {
          this.router.navigate(['/login']).then();
        }, 2000);
        break;
    }
  }

  ngOnDestroy(): void {
    if (!!this._clearTimeout) {
      clearTimeout(this._clearTimeout);
    }
  }

}
