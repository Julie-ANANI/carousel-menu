import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CookieService} from "ngx-cookie";
import {AuthService} from "../services/auth/auth.service";
import {tap} from "rxjs/operators";

@Injectable()
export class EtherpadInterceptor implements HttpInterceptor {

  constructor(private _cookieService: CookieService,
              private _authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /**
     * request is going for the first time then let the request process
     * and cache the response
     */
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const etherpadSessions = event.headers.get('Etherpad-Sessions');

          if (!!etherpadSessions) {
            this._cookieService.put('sessionID', etherpadSessions, this._authService.etherpadCookiesOptions());
          }
        }
        return event;
      })
    );
  }
}
