import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as SessionVerificationController from '@umius/umi-session-verifications';

const SessionVerification = new SessionVerificationController();

@Injectable()
export class SessionInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.setAuthorizationHeader(req))
      .pipe(catchError((event) => {
        console.log('event', event);
        if (event instanceof HttpErrorResponse) {
          return this.catch401(event);
        }
      }));
  }

  // Request Interceptor to append Authorization Header
  private setAuthorizationHeader(req: HttpRequest<any>): HttpRequest<any> {
    // Make a clone of the request then append the Authorization Header
    SessionVerification.setHeader(req, 'umi-front-application');
    return req.clone({ withCredentials: true });
  }
  // Response Interceptor
  private catch401(error: HttpErrorResponse): Observable<any> {
    // Check if we had 401 response
    if (error.status === 401) {
      // redirect to Login page for example
      return EMPTY;
    }
    return throwError(error);
  }

}
