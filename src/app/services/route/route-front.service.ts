import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {environment} from '../../../environments/environment';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {Location} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RouteFrontService {

  private _isAdminSideObj: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _authService: AuthService,
              private _location: Location,
              private _router: Router) { }

  private static _firstAccessRoute(object: any, url: string): string {
    const _keys = Object.keys(object);
    return url + (_keys && _keys.length && _keys[0]);
  }

  public adminDefaultRoute(): string {
    const _object = this._authService.adminAccess;
    const _routes = ['projects', 'users', 'professionals', 'libraries', 'settings'];
    let _url = '';

    if (!!_object) {

      // take the first key as the default access route.
      _url = RouteFrontService._firstAccessRoute(_object, '/user/admin/');

      // if path is not given then we search in top level routes that are projects, users, professionals etc.
      // also means the top key in the adminSide object.
      // here we are looking for the key in the specific order.
      for (let i = 0; i <= _routes.length; i++) {
        if (_object.hasOwnProperty(_routes[i])) {
          _url = '/user/admin/' + _routes[i];
          break;
        }
      }

    }

    return _url;
  }

  public redirectRoute(url: string): any {
    return url === (environment.clientUrl + '/not-authorized') ? '/user' : url;
  }

  /***
   * this returns the active tab.
   * @param urlLength total length of the url ex:
   * http://localhost:4200/user/admin/projects/project/5b17cc800a7f5b178e79f710/preparation = 7
   * @param indexOf ex: for the above url = 6 because the last route is preparation
   * @param notExact - true means the url length is not important. The value at the indexOf matters.
   */
  public activeTab(urlLength: number, indexOf: number, notExact = false): string {
    const _url = this._router.routerState.snapshot.url.split('/');
    if (_url.length === urlLength || notExact) {
      const _params = _url[indexOf].indexOf('?');
      return _params > 0 ? _url[indexOf].substring(0, _params) : _url[indexOf];
    }
    return '';
  }

  /***
   * this returns the active innovation id in route.
   * http://localhost:4200/user/admin/projects/project/5b17cc800a7f5b178e79f710/preparation
   */
  public activeInnovationId(): string {
    const _url = this._router.routerState.snapshot.url.split('/');
    const indexProject = _url.indexOf('project');
    if (indexProject > 0) {
      return _url[indexProject + 1];
    }
    return null;
  }

  /**
   * initialize isAdminSideObj value to true if we are on admin side,
   * and we can listen to isAdminSide for updated value.
   */
  public initSide(): void {
    this._isAdminSideObj.next(this._location.path().slice(5, 11) === '/admin');
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart || event instanceof NavigationEnd || event instanceof NavigationCancel
        || event instanceof NavigationError) {
        this._isAdminSideObj.next(this._location.path().slice(5, 11) === '/admin');
      }
    });
  }

  public isAdminSide(): BehaviorSubject<boolean> {
    return this._isAdminSideObj;
  }

}
