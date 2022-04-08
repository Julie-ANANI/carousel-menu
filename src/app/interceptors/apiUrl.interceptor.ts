import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _cookieService: CookieService) {
  }

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
    let newParameters: any = {};
    // When the route is for unauth(Don't need to add JWT)
    if (environment.local) {
      newParameters.url = environment.apiUrl + req.url.replace('/authorized/access', '');
      this._setJwtoken(newParameters, req);
    } else {
      // APISIX gateway activated
      if (req.url && req.url.indexOf('/authorized/access') === -1) {
        newParameters.url = environment.apiUrl + '/api/access' + req.url;
        this._setJwtoken(newParameters, req);
      } else {
        newParameters.url = environment.apiUrl + req.url;
      }
    }
    this._setCookie(newParameters, req);
    return req.clone(newParameters);
  }


  /**
   * set a json web token, and save it in cookie, there are userId + user Role
   * send JWT along with the header, so that in the back-end, we can get JWT
   * Then back-end can set up the session, the permission and so on
   * PS: we create JWT after we login
   * @param newParameters
   * @param req
   * @private
   */
  private _setJwtoken(newParameters: any, req: HttpRequest<any>) {
    const jwToken = this._cookieService.get('jwToken-application-front');
    if (jwToken) {
      newParameters.headers = req.headers
        .append('Authorisation', jwToken);
    }
  }

  private _setCookie(newParameters: any, req: HttpRequest<any>) {
    if (isPlatformServer(this._platformId) && this._cookieService.get('connect.sid')) {
      newParameters.headers = req.headers
        .append('Cookie', `connect.sid=${this._cookieService.get('connect.sid')}`);
    }
  }

}
