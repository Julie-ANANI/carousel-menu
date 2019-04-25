import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { TranslateNotificationsService } from '../notifications/notifications.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ErrorService {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private router: Router,
              private auth: AuthService,
              private translateNotificationService: TranslateNotificationsService) {
  }

  handleError(error: Error | HttpErrorResponse) {

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        this.translateNotificationService.error('ERROR.ERROR', 'ERROR.NO_CONNECTION');
      } else {
        // Handle Http Error (error.status === 403, 404...)
        console.log('----- Server Error -----');
        const domain = environment.domain;
        const time = new Date().toISOString();
        const route = environment.clientUrl + this.router.url;
        const user = this.auth.isAuthenticated ? this.auth.getUserInfo().name : '';
        const type = error.name;
        const message = error.message || error.toString();
        const status = error.status;
        const url = error.url;
        console.log({domain, time, route, user, type, message, status, url});
        console.log('----- /Server Error -----');
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
      console.log('----- Client Error -----');
      const domain = environment.domain;
      const time = new Date().toISOString();
      const route = environment.clientUrl + this.router.url;
      const user = this.auth.isAuthenticated ? this.auth.getUserInfo().name : '';
      const type = error.name;
      const message = error.message || error.toString();
      console.log({domain, time, route, user, type, message});
      console.log('----- /Client Error -----');
    }

  }

}
