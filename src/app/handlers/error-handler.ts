import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { TranslateNotificationsService } from '../services/notifications/notifications.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector, private translateNotificationService: TranslateNotificationsService) {}

  handleError(error: Error | HttpErrorResponse) {

    const router = this.injector.get(Router);
    const auth = this.injector.get(AuthService);

    if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
        this.translateNotificationService.error('ERROR.ERROR', 'ERROR.NO_CONNECTION');
      } else {
        // Handle Http Error (error.status === 403, 404...)
        console.log(error);
        console.log('----- Server Error -----');
        console.log(`Time: ${new Date().toISOString()}`);
        console.log(`Route: ${router.url}`);
        if (auth.isAuthenticated) {
          const user = auth.getUserInfo();
          console.log(`User: ${user.name}`);
        } else {
          console.log('Not connected');
        }
        console.log(`Type: ${error.name}`);
        console.log(`Type: ${error.status}`);
        console.log(`Message: ${error.message || error.toString()}`);
        console.log('----- /Server Error -----');
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
      console.log('----- Client Error -----');
      console.log(`Time: ${new Date().toISOString()}`);
      console.log(`Route: ${router.url}`);
      if (auth.isAuthenticated) {
        const user = auth.getUserInfo();
        console.log(`User: ${user.name}`);
      } else {
        console.log('Not connected');
      }
      console.log(`Type: ${error.name}`);
      console.log(`Message: ${error.message || error.toString()}`);
      console.log('----- /Client Error -----');
    }

    throw error;

  }

}
