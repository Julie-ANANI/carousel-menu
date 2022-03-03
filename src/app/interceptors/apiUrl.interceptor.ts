import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {isPlatformServer} from '@angular/common';
import {CookieService} from 'ngx-cookie';

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('http') === -1) { // Si ce n'est pas une URL
      return next.handle(this._setAppV3Url(req));
    } else {
      return next.handle(req);
    }
  }

  /**
   * setting the url of the app v3.
   * @param req
   * @private
   */
  private _setAppV3Url(req: HttpRequest<any>): HttpRequest<any> {
    const newParameters: any = {
      //url: environment.apiUrl + req.url, //use this at local
      url: environment.apiUrl + req.url,
      withCredentials: true,
    };
    this._setCookie(newParameters, req);
    this._setJwtoken(newParameters, req);
    return req.clone(newParameters);
  }

  private _setJwtoken(newParameters: any, req: HttpRequest<any>){
    const jwToken = this._cookieService.get('jwToken-application-front');
    if (jwToken) {
      newParameters.headers = req.headers
        .append('Authorization', jwToken);
    }
  }

  private _setCookie(newParameters: any, req: HttpRequest<any>) {
    if (isPlatformServer(this._platformId) && this._cookieService.get('connect.sid')) {
      newParameters.headers = req.headers
        .append('Cookie', `connect.sid=${this._cookieService.get('connect.sid')}`);
    }
  }

}
