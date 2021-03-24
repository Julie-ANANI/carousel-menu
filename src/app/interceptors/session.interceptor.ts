import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ErrorService } from '../services/error/error.service';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService,
              private authService: AuthService) {}

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
    let headers = req.headers
      .set('instance-domain', environment.domain)
      .set('api-token', 'umi-front-application,TXnKAVHh0xpiFlC8D01S3e8ZkD45VIDJ');
    if (this.authService.jwt) {
      headers = headers.set('jwtoken', this.authService.jwt);
    }
    // Make a clone of the request then append the Authorization Header
    return req.clone({
      headers: headers,
      withCredentials: true
    });
  }

}
