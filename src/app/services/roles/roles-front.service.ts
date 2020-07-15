import {Injectable} from "@angular/core";
import {AuthService} from "../auth/auth.service";

@Injectable({providedIn: "root"})
export class RolesFrontService {

	constructor(private _authService: AuthService) { }

	/***
	 * returns true if the user nav object contains the adminSide object. For example: access: {adminSide: {}}.
	 */
	public hasAdminSide(): boolean {
		return !!(this._authService.user && this._authService.user.access && this._authService.user.access.adminSide);
	}

	/***
	 * returns the value based on the path provided form the adminSide object. If found return value otherwise
	 * undefined.
	 * @param path ex: ['projects', 'searchBy', 'name']
	 */
	public hasAccessAdminSide(path: Array<string>): boolean {
		const _object = this._authService.user && this._authService.user.access && this._authService.user.access
			&& this._authService.user.access.adminSide;
		if (path && path.length > 0 && _object) {
			return path.reduce((obj, key) => (obj && obj[key] !== undefined)
				? obj[key] : undefined, _object);
		}
	}

}
