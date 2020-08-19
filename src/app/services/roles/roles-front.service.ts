import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class RolesFrontService {

  constructor(private _authService: AuthService) { }

	/***
	 * returns the value based on the path provided form the adminSide object. If found return value otherwise
	 * undefined.
	 * @param path ex: ['projects', 'searchBy', 'name']
	 */
	public hasAccessAdminSide(path: Array<string>): boolean {
		if (path && path.length > 0 && !!this._authService.adminAccess) {
			return path.reduce((obj, key) => (obj && obj[key] !== undefined)
				? obj[key] : undefined, this._authService.adminAccess);
		}
	}

	public isTechRole(): boolean {
		return !!(this._authService.user && this._authService.user.roles && this._authService.user.roles === 'tech');
	}

	/***
	 * returns the key/route if the Admin has access to that provided in the path.
	 * Here the order in the routes matter.
	 * @param routes ex: ['pros', 'history', 'waitingLine'] || ['projects', 'user', 'professionals']
	 * @param path ex: ['search']
	 */
	public canAccessRoute(routes: Array<string>, path?: Array<string>): string {
		if (routes.length) {
			routes.forEach((route) => {
				if (path.length && !!this.hasAccessAdminSide(path.concat(route))) {
					return route
				} else if (!!this.hasAccessAdminSide(route.split(', '))) {
					return route;
				}
			});
		}
		return '';
	}

}
