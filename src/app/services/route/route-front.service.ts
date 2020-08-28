import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class RouteFrontService {

  constructor(private _authService: AuthService) { }

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

	private static _firstAccessRoute(object: any, url: string): string {
		const _keys = Object.keys(object);
		return url + (_keys && _keys.length && _keys[0]);
	}

	public redirectRoute(url: string): any {
  	return url === environment.clientUrl + '/not-authorized' ? '/user' : url;
	}

}
