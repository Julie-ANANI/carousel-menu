import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { User } from '../../models/user.model';
import { urlRegEx } from '../../utils/regex';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthService {

  private _authenticated = false;
  private _authenticatedSource = new Subject<boolean>();
  private _admin = 0;
  private _confirmed = false;
  private _redirectUrl: string;

  private _user: User;

  constructor(private _http: Http,
              private _cookieService: CookieService) {
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

  public login(user: User): Observable<User> {
    return this._http.post('/auth/login', user.toJSON())
      .map((res: Response) => {
        const response = res.json();
        this._setAuthenticatedTo(response.isAuthenticated);
        this._setAdminTo(response.adminLevel);
        this._setConfirmedTo(response.isConfirmed);
        this._user = response;
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  public linkedinLogin(domain: string): Observable<any> {
    return this._http.get(`/auth/linkedin?domain=${domain}`)
      .map((res: Response) => {
        const response = res.json();
        return response.url;
      })
      .catch((error: Response) => {
        return Observable.throw(error.json())
      });
  }

  public logout(): Observable<any> {
    return this._http.get('/auth/logout')
      .map((res: Response) => {
        const response = res.json();
        this._setAuthenticatedTo(response.isAuthenticated);
        this._setAdminTo(response.adminLevel);
        this._setConfirmedTo(response.isConfirmed);
        this._user = null;
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  /**
   * Appelé à l'initialisation de l'application pour ouvrir une session auprès du serveur si besoin
   */
  public initializeSession(): Observable<any> {
    return this._http.get('/auth/session')
      .map((res) => {
        const response = res.json();
        this._setAuthenticatedTo(response.isAuthenticated);
        this._setAdminTo(response.adminLevel);
        this._setConfirmedTo(response.isConfirmed);
        this._user = response.user || null;
        return response;
      })
      .catch((error: Response) => Observable.throw(error.json()));
  }

  private _setConfirmedTo(newValue: boolean): void {
    this._confirmed = newValue;
    this._cookieService.put('hasBeenConfirmed', newValue.toString());
  }

  private _setAuthenticatedTo(newValue: boolean): void {
    this._authenticated = newValue;
    this._authenticatedSource.next(newValue);
    this._cookieService.put('hasBeenAuthenticated', newValue.toString());
  }

  private _setAdminTo(newValue: number): void {
    this._admin = newValue;
    this._cookieService.put('hasBeenAdmin', `${newValue}`);
  }

  get isAuthenticated$(): Observable<boolean> { return this._authenticatedSource.asObservable(); }
  get isAuthenticated(): boolean { return this._authenticated; }
  get isConfirmed(): boolean { return this._confirmed; }
  get adminLevel(): number { return this._admin; }
  get user () { return this._user; }
  get userId (): string { return this._user ? this._user.id : ''; }
  get isAcceptingCookies(): boolean { // CNIL
    return true;
  }
  get emailVerified(): boolean { return this._user && this._user.emailVerified || false; }
  set emailVerified(value: boolean) { this._user.emailVerified = value; }
  set isConfirmed(confirmed: boolean) { this._confirmed = confirmed; }
  set redirectUrl (redirectUrl: string) {
    if (urlRegEx.test(redirectUrl)) {
      this._redirectUrl = redirectUrl;
    }
  }
}
