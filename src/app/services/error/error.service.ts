import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { version } from '../../../environments/version';
import * as Sentry from '@sentry/browser';

Sentry.init({
  environment: environment.domain,
  release: version,
  dsn: 'https://d86e9ff2dfbb40eab9632f0a3a599757@sentry.io/1315751',
  defaultIntegrations: false // we don't want the sentry integrations, they provide more shadows than real data
});

@Injectable()
export class ErrorService {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private router: Router,
              private auth: AuthService) {}

  public handleError(error: Error | HttpErrorResponse) {

    if (environment.production === true) {

      Sentry.withScope(scope => {

        const user = this.auth.user;
        scope.setUser({
          email: user ? user.email : '',
          username: user ? `${user.firstName} ${user.lastName}` : '',
          id: user ? user.id : ''
        });
        scope.setTag('route', environment.clientUrl + this.router.url);

        const eventId = Sentry.captureException(error);

        if (this.auth.adminLevel > 0) {
          Sentry.showReportDialog({ eventId });
        }

      });

    }

    console.error(error);

  }

}
