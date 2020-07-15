import {Injectable} from "@angular/core";
import {AuthService} from "../auth/auth.service";

@Injectable({providedIn: "root"})
export class RolesFrontService {

	constructor(private _authService: AuthService) { }

	/***
	 * will return true if the key matches with the property of either adminSide || clientSide.
	 * work on the 1st level object not on sub level objects. For example access: {clientSide: {}, adminSide: {}}.
	 * @param key
	 * @param side
	 */
	public canAccessRoute(key: string, side: 'adminSide' | 'clientSide' = 'adminSide'): boolean {
		const _side = this._authService.user && this._authService.user.access && this._authService.user.access[side] || '';
		if (_side && key) {
			for (const property in _side) {
				if (_side.hasOwnProperty(property)) {
					if (key === property) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/***
	 * returns true if the user nav object contains the adminSide object. For example: access: {adminSide: {}}.
	 */
	public hasAdminSide(): boolean {
		return !!(this._authService.user && this._authService.user.access && this._authService.user.access.adminSide);
	}

}
