import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../services/error/error.service';
import { environment } from '../../environments/environment';
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://d86e9ff2dfbb40eab9632f0a3a599757@sentry.io/1315751'
});

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {

    if (environment.production) {
      const eventId = Sentry.captureException(error);
      Sentry.showReportDialog({ eventId });
    } else {
      const errorService = this.injector.get(ErrorService);
      errorService.handleError(error);
    }

    throw error;

  }

}
