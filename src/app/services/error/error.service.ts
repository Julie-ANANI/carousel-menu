import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { version } from '../../../environments/version';
import * as Sentry from '@sentry/browser';
import { RolesFrontService } from '../roles/roles-front.service';
import { UserFrontService } from '../user/user-front.service';

Sentry.init({
  environment: environment.domain,
  release: version,
  dsn: 'https://d86e9ff2dfbb40eab9632f0a3a599757@sentry.io/1315751',
  integrations: [new Sentry.Integrations.UserAgent()],
  defaultIntegrations: false // we don't want the sentry integrations, they provide more shadows than real data
});

@Injectable({providedIn: 'root'})
export class ErrorService {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private router: Router,
              private _rolesFrontService: RolesFrontService,
              private _authService: AuthService) {
  }

  public handleError(error: Error | HttpErrorResponse) {
    if (!environment.production || this._rolesFrontService.isTechRole()) {
      console.error(error);
    } else {
      Sentry.withScope(scope => {
        const user = this._authService.user;
        scope.setUser({
          email: (user && user.email) || '',
          username: UserFrontService.fullName(user),
          id: (user && user.id) || ''
        });
        scope.setTag('route', environment.clientUrl + this.router.url);
        // const eventId = Sentry.captureException(error);
        /*if (this.auth.adminLevel > 0) {
          Sentry.showReportDialog({ eventId });
        }*/

        if (error && error.message) {
          Sentry.captureException(new Error(error.message));
        } else {
          Sentry.captureException(error);
        }
      });
    }
  }


}
