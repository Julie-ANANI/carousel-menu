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
	 * @param routes ex: ['pros', 'history', 'queue'] || ['projects', 'user', 'professionals']
	 * @param path ex: ['search']
	 */
	public canAccessRoute(routes: Array<string>, path?: Array<string>): string {
		let _route = '';

		if (routes.length) {
			for (let i = 0; i <= routes.length; i++) {
				if (path.length && !!this.hasAccessAdminSide(path.concat(routes[i]))) {
					_route = routes[i];
					break;
				} else if (!!(this.hasAccessAdminSide([routes[i]]) && this.hasAccessAdminSide(routes[i].split(', ')))) {
					_route = routes[i];
					break;
				}
			}
		}

		return _route;
	}

	/***
	 * this will return the sub-route of the single project.
	 */
	public projectDefaultRoute() : string {
		return this.canAccessRoute(
			['settings', 'answerTags', 'questionnaire', 'campaigns', 'synthesis', 'followUp', 'storyboard'],
			['projects', 'project']);
	}

	/***
	 * this will return the sub-route of the single campaign.
	 */
	public campaignDefaultRoute(): string {
		return this.canAccessRoute(
			['batch', 'workflows', 'pros', 'history', 'search'],
			['projects', 'project', 'campaigns', 'campaign']);
	}

}
