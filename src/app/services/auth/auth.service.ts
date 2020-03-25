import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { CookieService, CookieOptions } from 'ngx-cookie';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { urlRegEx } from '../../utils/regex';
import { environment } from '../../../environments/environment';
import { SwellrtBackend } from "../../modules/swellrt-client/services/swellrt-backend";



import {Md5} from 'ts-md5/dist/md5';

const AUTH_SESSION_KEY = makeStateKey('authSession');

@Injectable()
export class AuthService {

  private _authenticated = false;

  private _admin = 0;

  private _confirmed = false;

  private _redirectUrl: string;

  private _isOperator: boolean = false;

  private _user: User;

  private _errorUrl: string | null = null;

  private _cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + environment.cookieTime ),
    secure: environment.secureCookie
  };

  private _cookieObserver: any = null;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _http: HttpClient,
              private _cookieService: CookieService,
              private _state: TransferState,
              private _swellRtService: SwellrtBackend ) {
  /**
     Les cookies <hasBeenAuthenticated> et <hasBeenAdmin> sont utiles quand l'application essaye d'accéder à une route
     sans que la session ait été récupérée du serveur via la fonction <initializeSession()>. Ceci évite que si l'on
     colle un lien de l'admin par exemple, on soit redirigé sur la page d'accueil car les variables <authenticated>
     et <admin> sont encore à <false> (la réponse du serveur (<initializeSession()>) n'a pas encore été reçue).
     */
    this._setAuthenticatedTo(this._cookieService.get('hasBeenAuthenticated') === 'true');
    this._setAdminTo(parseInt(this._cookieService.get('hasBeenAdmin'), 10));
    this._setConfirmedTo(this._cookieService.get('hasBeenConfirmed') === 'true');
    this._setIsOperatorTo(this._cookieService.get('isOperator') === 'true' );
  }

  public startCookieObservator() {
    if (this._cookieObserver === null) {
      console.time('cookieObs');
      this._cookieObserver = setInterval(() => {
        if (!this._cookieService.get('hasBeenAuthenticated')) {
          // this._cookieService.get('user')
          console.timeEnd('cookieObs');
          this.logout().subscribe(() => {
            // this._router.navigate(['/logout']);
          }, (err: any) => {
            console.error(err);
          });
        }
      }, 30000);
    }
  }

  public stopSwellRTSession() {
    this._swellRtService.logout()
      .then( result => {
        console.log("On the bay, bye bye bye!");
      }, err => {
        console.error(`Hmmm I'm having problems logging out from swell: ${err.message}`);
      });
  }

  public login(user: User): Observable<User> {
    return this._http.post('/auth/login', user.toJSON())
      .pipe(
        map((res: any) => {
          this._setAuthenticatedTo(res.isAuthenticated);
          this._setAdminTo(res.adminLevel);
          this._setConfirmedTo(res.isConfirmed);
          this._setIsOperatorTo(res.isOperator);
          this._user = res;
          if (res.isAuthenticated) {
            //this.startCookieObservator();
            this._setMHash(res.email);
          }
          return res;
        }),
        catchError((error: Response) => throwError(error.json()))
      );
  }

  public forceLogin(userId: string): Observable<User> {
    return this._http.post('/auth/forceLogin', {userId: userId})
      .pipe(
        map((res: any) => {
          this._setAuthenticatedTo(res.isAuthenticated);
          this._setAdminTo(res.adminLevel);
          this._setConfirmedTo(res.isConfirmed);
          this._setIsOperatorTo(res.isOperator);
          this._user = res;
          if (res.isAuthenticated) {
            //this.startCookieObservator();
            this._setMHash(res.email);
          }
          return res;
        }),
        catchError((error: Response) => throwError(error.json()))
      );
  }

  public logout(): Observable<any> {
    return this._http.get('/auth/logout')
      .pipe(
        map((res: any) => {
          this._setAuthenticatedTo(res.isAuthenticated);
          this._setAdminTo(res.adminLevel);
          this._setConfirmedTo(res.isConfirmed);
          this._cookieService.removeAll();
          this._redirectUrl = '';
          this._user = null;
          //this.stopSwellRTSession();
          clearInterval(this._cookieObserver);
          return res;
        }),
        catchError((error: Response) => throwError(error.json()))
      );
  }

  /**
   * Appelé à l'initialisation de l'application pour ouvrir une session auprès du serveur si besoin
   */
  public initializeSession(): Observable<any> {
    const callback = (res: any) => {
      this._setAuthenticatedTo(res.isAuthenticated);
      this._setAdminTo(res.adminLevel);
      this._setConfirmedTo(res.isConfirmed);
      this._user = res.user || null;
      this._setIsOperatorTo(this._user? this._user.isOperator : false );
    };
    if (this._state.hasKey(AUTH_SESSION_KEY)) {
      const res = this._state.get(AUTH_SESSION_KEY, {});
      callback(res);
      this._state.remove(AUTH_SESSION_KEY);
      return of(res);
    } else {
      return this._http.get('/auth/session')
        .pipe(
          tap((res: any) => {
            if (isPlatformServer(this.platformId)) {
              this._state.set(AUTH_SESSION_KEY, res);
            }
            callback(res);
          }));
    }
  }

  public preRegisterDataOAuth2(provider: string, data: any): Observable<any> {
    return this._http.post(`/auth/preoauth/${provider}`, data);
  }

  private _setIsOperatorTo(newValue: boolean): void {
    this._isOperator = newValue;
    if (isPlatformBrowser(this.platformId)) {
      this._cookieService.put('isOperator', newValue.toString(), this._cookieOptions);
    }
  }

  private _setConfirmedTo(newValue: boolean): void {
    this._confirmed = newValue;
    if (isPlatformBrowser(this.platformId)) {
      this._cookieService.put('hasBeenConfirmed', newValue.toString(), this._cookieOptions);
    }
  }

  private _setAuthenticatedTo(newValue: boolean): void {
    this._authenticated = newValue;
    if (isPlatformBrowser(this.platformId)) {
      this._cookieService.put('hasBeenAuthenticated', newValue.toString(), this._cookieOptions);
    }
  }

  private _setAdminTo(newValue: number): void {
    this._admin = newValue;
    if (isPlatformBrowser(this.platformId)) {
      this._cookieService.put('hasBeenAdmin', `${newValue}`, this._cookieOptions);
    }
  }

  private _setMHash(newValue: string): void {
    const md5 = new Md5();
    const mhash = md5.appendStr(newValue).end();
    this._cookieService.put('mhash', `${mhash}`, this._cookieOptions);
  }

  public getUserInfo(): any {
    if (this._user) {
      return {
        name: this._user.firstName + ' ' + this._user.lastName,
        id: this._user.id
      };
    } else {
      return {};
    }
  }

  public getMHash(): any {
    return this._cookieService.get('mhash') || null;
  }

  get isAuthenticated(): boolean {
    return this._authenticated;
  }

  get isConfirmed(): boolean {
    return this._confirmed;
  }

  get adminLevel(): number {
    return this._admin;
  }

  get isAdmin(): boolean {
    return (this._admin & 1) === 1;
  }

  get isSuperAdmin(): boolean {
    return (this._admin & 2) === 2;
  }

  get isOperator(): boolean {
    return this._isOperator;
  }

  get user () {
    return this._user;
  }

  get userId (): string {
    return this._user ? this._user.id : '';
  }

  get isAcceptingCookies(): boolean {
    // CNIL -> TODO: this should be initialized with a false value
    return true;
  }

  get emailVerified(): boolean {
    return this._user && this._user.emailVerified || false;
  }

  set emailVerified(value: boolean) {
    this._user.emailVerified = value;
  }

  set isConfirmed(confirmed: boolean) {
    this._confirmed = confirmed;
  }

  get redirectUrl() {
    return this._redirectUrl;
  }

  set redirectUrl (redirectUrl: string) {
    let url = `${environment.clientUrl}${redirectUrl}`;

    if (urlRegEx.test(url)) {
      this._redirectUrl = redirectUrl;
    } else if (environment.local) {
      this._redirectUrl = redirectUrl;
    }

  }

  get errorUrl() {
    return this._errorUrl;
  }

  set errorUrl (url) {
    if (!!url) {
      this._errorUrl = url;
    }
  }

}
