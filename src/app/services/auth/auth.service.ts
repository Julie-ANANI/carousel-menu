import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService, CookieOptions } from 'ngx-cookie';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { first, map, catchError } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { urlRegEx } from '../../utils/regex';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  private _authenticated = false;
  private _authenticatedSource = new Subject<boolean>();
  private _admin = 0;
  private _confirmed = false;
  private _redirectUrl: string;

  private _user: User;

  private _cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + environment.cookieTime ),
    secure: environment.secureCookie
  };

  private _cookieObserver: any = null;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private _http: HttpClient,
              private _cookieService: CookieService,
              private _router: Router) {
  /**
     Les cookies <hasBeenAuthenticated> et <hasBeenAdmin> sont utiles quand l'application essaye d'accéder à une route
     sans que la session ait été récupérée du serveur via la fonction <initializeSession()>. Ceci évite que si l'on
     colle un lien de l'admin par exemple, on soit redirigé sur la page d'accueil car les variables <authenticated>
     et <admin> sont encore à <false> (la réponse du serveur (<initializeSession()>) n'a pas encore été reçue).
     */
    this._setAuthenticatedTo(this._cookieService.get('hasBeenAuthenticated') === 'true');
    this._setAdminTo(parseInt(this._cookieService.get('hasBeenAdmin'), 10));
    this._setConfirmedTo(this._cookieService.get('hasBeenConfirmed') === 'true');
  }

  public startCookieObservator() {
    if (this._cookieObserver === null) {
      console.time('cookieObs');
      this._cookieObserver = setInterval(() => {
        if (!this._cookieService.get('hasBeenAuthenticated')) {
          // this._cookieService.get('user')
          console.timeEnd('cookieObs');
          this.logout().pipe(first()).subscribe(() => {
            this._router.navigate(['/logout']);
          }, (err: any) => {
            console.error(err);
          });
        }
      }, 30000);
    }
  }

  public login(user: User): Observable<User> {
    return this._http.post('/auth/login', user.toJSON())
      .pipe(
        map((res: any) => {
          this._setAuthenticatedTo(res.isAuthenticated);
          this._setAdminTo(res.adminLevel);
          this._setConfirmedTo(res.isConfirmed);
          this._user = res;
          if (res.isAuthenticated) {
            this.startCookieObservator();
          }
          return res;
        }),
        catchError((error: Response) => throwError(error.json()))
      );
  }

  public linkedinLogin(domain: string): Observable<any> {
    return this._http.get(`/auth/linkedin?domain=${domain}`)
      .pipe(
        map((res: any) => {
          return res.url;
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
          this._user = null;
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
    return this._http.get('/auth/session')
      .pipe(
        map((res: any) => {
          this._setAuthenticatedTo(res.isAuthenticated);
          this._setAdminTo(res.adminLevel);
          this._setConfirmedTo(res.isConfirmed);
          this._user = res.user || null;
          return res;
        }));
  }

  private _setConfirmedTo(newValue: boolean): void {
    this._confirmed = newValue;
    if (isPlatformBrowser(this.platformId)) {
      this._cookieService.put('hasBeenConfirmed', newValue.toString(), this._cookieOptions);
    }
  }

  private _setAuthenticatedTo(newValue: boolean): void {
    this._authenticated = newValue;
    this._authenticatedSource.next(newValue);
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

  public getUserInfo(): any {
    return {
      name: this._user ? this._user.firstName + ' ' + this._user.lastName : '',
      id: this._user.id
    };
  }

  get isAuthenticated(): boolean { return this._authenticated; }
  get isConfirmed(): boolean { return this._confirmed; }
  get adminLevel(): number { return this._admin; }
  get user () { return this._user; }
  get userId (): string { return this._user ? this._user.id : ''; }
  get isAcceptingCookies(): boolean { // CNIL -> TODO: this should be initialized with a false value
    return true;
  }
  get emailVerified(): boolean { return this._user && this._user.emailVerified || false; }
  set emailVerified(value: boolean) { this._user.emailVerified = value; }
  set isConfirmed(confirmed: boolean) { this._confirmed = confirmed; }
  get redirectUrl() { return this._redirectUrl; }
  set redirectUrl (redirectUrl: string) {
    if (urlRegEx.test(redirectUrl)) {
      this._redirectUrl = redirectUrl;
    }
  }
}
