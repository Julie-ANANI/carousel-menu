import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class RouteFrontService {

  constructor(private _authService: AuthService,
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
	 * @param urlLength total length of the array ex:
	 * http://localhost:4200/user/admin/projects/project/5b17cc800a7f5b178e79f710/preparation = 7
	 * @param indexOf ex: for the above url = 6 because the last route is preparation
	 */
  public activeTab(urlLength: number, indexOf: number): string {
    const _url = this._router.routerState.snapshot.url.split('/');
    if (_url.length === urlLength) {
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

}
