import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';

@Injectable()
export class CookieServerInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.setCookie(req));
  }

  private setCookie(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Cookie: `connect.sid=${this.cookieService.get('connect.sid')}`
      }
    });
  }

}
