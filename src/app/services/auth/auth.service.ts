import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {CookieOptions, CookieService} from 'ngx-cookie';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError, first, map, tap} from 'rxjs/operators';
import {User} from '../../models/user.model';
import {urlRegEx} from '../../utils/regex';
import {environment} from '../../../environments/environment';
import {SwellrtBackend} from '../../modules/swellrt-client/services/swellrt-backend';

import {Md5} from 'ts-md5/dist/md5';
import {EtherpadAccesses} from '../../models/etherpad-accesses';

const AUTH_SESSION_KEY = makeStateKey('authSession');

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authenticated = false;

  private _admin = 0; // based on the value of adminLevel

  private _confirmed = false;

  private _redirectUrl = '';

  private _isOperator = false;

  private _user: User = null;

  private _etherpadAccesses: EtherpadAccesses = {active: false, authorID: '', sessions: []};

  private _errorUrl: string | null = null;

  private _cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + environment.cookieTime ),
    secure: environment.secureCookie
  };

  private _cookieObserver: any = null;

  // private _adminAccess: any = null;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
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
    // this._setAdminAccess(this._cookieService.get('adminAccess'));
  }

  public startCookieObservator() {
    if (this._cookieObserver === null) {
      // console.time('cookieObs');
      this._cookieObserver = setInterval(() => {
        if (!this._cookieService.get('hasBeenAuthenticated')) {
          // this._cookieService.get('user')
          // console.timeEnd('cookieObs');
          this.logout().pipe(first()).subscribe(() => {
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
        console.log('On the bay, bye bye bye!');
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
          this._setJwToken(res.jwt);
          this._user = res;
          this._setEtherpadAccessesTo(res.etherpad);
          // this._setAdminAccess(this._user && this._user.access && this._user.access.adminSide);
          if (res.isAuthenticated) {
            // this.startCookieObservator();
            this._setMHash(res.email);
          }
          return res;
        }),
        catchError((error: HttpErrorResponse) => throwError(error))
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
          this._setJwToken(res.jwt);
          this._user = res;
          this._setEtherpadAccessesTo(res.etherpad);
          // this._setAdminAccess(this._user && this._user.access && this._user.access.adminSide);
          if (res.isAuthenticated) {
            // this.startCookieObservator();
            this._setMHash(res.email);
          }
          return res;
        }),
        catchError((error: HttpErrorResponse) => throwError(error))
      );
  }

  public logout(): Observable<any> {
    return this._http.get('/auth/logout')
      .pipe(
        map((res: any) => {
          this._setAuthenticatedTo(res.isAuthenticated);
          this._setAdminTo(res.adminLevel);
          this._setConfirmedTo(res.isConfirmed);
          this._setEtherpadAccessesTo(res.etherpad);
          this._cookieService.removeAll();
          this._redirectUrl = '';
          this._user = null;
          // this._setAdminAccess(null);
          // this.stopSwellRTSession();
          clearInterval(this._cookieObserver);
          return res;
        }),
        catchError((error: HttpErrorResponse) => throwError(error))
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
      // this._setAdminAccess(this._user && this._user.access && this._user.access.adminSide);
      this._setIsOperatorTo(this._user ? this._user.isOperator : false );
      this._setEtherpadAccessesTo(res.etherpad);
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
            if (isPlatformServer(this._platformId)) {
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
    if (isPlatformBrowser(this._platformId)) {
      this._cookieService.put('isOperator', newValue.toString(), this._cookieOptions);
    }
  }

  private _setConfirmedTo(newValue: boolean): void {
    this._confirmed = newValue;
    if (isPlatformBrowser(this._platformId)) {
      this._cookieService.put('hasBeenConfirmed', newValue.toString(), this._cookieOptions);
    }
  }

  private _setAuthenticatedTo(newValue: boolean): void {
    this._authenticated = newValue;
    if (isPlatformBrowser(this._platformId)) {
      this._cookieService.put('hasBeenAuthenticated', newValue.toString(), this._cookieOptions);
    }
  }

  private _setJwToken(jwt: string): void {
    if (isPlatformBrowser(this._platformId)) {
      this._cookieService.put('jwToken-application-front', jwt, this._cookieOptions);
    }
  }

  private _setAdminTo(newValue: number): void {
    this._admin = newValue;
    if (isPlatformBrowser(this._platformId)) {
      this._cookieService.put('hasBeenAdmin', `${newValue}`, this._cookieOptions);
    }
  }

  private _setEtherpadAccessesTo(newValue: EtherpadAccesses): void {
    if (this.isAcceptingCookies && newValue) {
      this._etherpadAccesses = newValue;
      if (isPlatformBrowser(this._platformId)) {
        this._cookieService.put('sessionID', `${newValue.sessions.map(session => {
          return session.id;
        }).join(',')}`, this.etherpadCookiesOptions());
      }
    }
  }

  private _setMHash(newValue: string): void {
    const md5 = new Md5();
    const mhash = md5.appendStr(newValue).end();
    this._cookieService.put('mhash', `${mhash}`, this._cookieOptions);
  }

  /*private _setAdminAccess(newValue: any) {
    this._adminAccess = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
    if (isPlatformBrowser(this._platformId)) {
      this._cookieService.put('adminAccess', JSON.stringify(newValue), this._cookieOptions);
    }
  }*/

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

  public etherpadCookiesOptions(): any {
    const hostName = environment.etherpadUrl;
    if (hostName.indexOf('localhost') !== -1) {
      return this._cookieOptions;
    } else {
      const domain = '.' + hostName.substring(hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1);

      return {
        ...this._cookieOptions,
        domain: domain,
        path: '/'
      };
    }
  }

  /***
   * returns true if the user nav object contains the adminSide object.
   * For example: access: {adminSide: {}}.
   */
  public hasAdminSide(): boolean {
    return !!(this.adminAccess);
  }

  get isAuthenticated(): boolean {
    return this._authenticated;
  }

  get isConfirmed(): boolean {
    return this._confirmed;
  }

  // > 1 means can go to the admin side.
  get adminLevel(): number {
    return this._admin;
  }

  get isAdmin(): boolean {
    return this._admin > 1;
    // return (this._admin & 1) === 1;
  }

  get isOperator(): boolean {
    return this._isOperator;
  }

  get user(): User {
    return this._user;
  }

  get userId(): string {
    return this._user ? this._user.id : '';
  }

  /***
   * returns the access object of the admin.
   */
  get adminAccess(): Object {
    return this._user && this._user.access && this._user.access.adminSide;
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
    this._setConfirmedTo(confirmed);
  }

  get redirectUrl(): string {
    return this._redirectUrl;
  }

  set redirectUrl (redirectUrl: string) {
    const url = `${environment.clientUrl}${redirectUrl}`;

    if (urlRegEx.test(url)) {
      this._redirectUrl = redirectUrl;
    } else if (environment.local) {
      this._redirectUrl = redirectUrl;
    }

  }

  get errorUrl(): string {
    return this._errorUrl;
  }

  set errorUrl (url: string) {
    if (!!url) {
      this._errorUrl = url;
    }
  }

  get etherpadAccesses(): EtherpadAccesses {
    return this._etherpadAccesses;
  }
  set etherpadAccesses(value: EtherpadAccesses) {
    this._etherpadAccesses = value;
  }

  /*get adminAccess(): any {
    return this._adminAccess;
  }

  set adminAccess(value: any) {
    this._adminAccess = value;
  }*/

}
