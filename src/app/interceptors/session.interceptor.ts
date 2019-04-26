import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as SessionVerificationController from '@umius/umi-session-verifications';
import { environment } from '../../environments/environment';
import { ErrorService } from '../services/error/error.service';

const SessionVerification = new SessionVerificationController();

@Injectable()
export class SessionInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.setAuthorizationHeader(req))
      .pipe(catchError((error) => {
        if (error.status !== 401) { // login error
          this.errorService.handleError(error);
        }
        return throwError(error);
      }));
  }

  // Request Interceptor to append Authorization Header
  private setAuthorizationHeader(req: HttpRequest<any>): HttpRequest<any> {
    // Make a clone of the request then append the Authorization Header
    SessionVerification.setHeader(req, 'umi-front-application');
    return req.clone({
      headers: req.headers.set('instance-domain', environment.domain),
      withCredentials: true
    });
  }

}
