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

	public isOperSupervisorRole(): boolean {
		return !!(this._authService.user && this._authService.user.roles && this._authService.user.roles === 'oper-supervisor');
	}

	public isCommunityRole(): boolean {
		return !!(this._authService.user && this._authService.user.roles && this._authService.user.roles === 'community');
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
	 * this will return the sub-route of single project.
	 */
	public projectDefaultRoute() : string {
		const _tabs = ['settings', 'preparation', 'collection', 'analysis', 'followUp'];
		const _defaultPath = ['projects', 'project', 'tabs'];
		let _route = '';

		for (let i = 0; i <= _tabs.length; i++) {
			if ((_tabs[i] === 'settings' || _tabs[i] === 'collection') && this.hasAccessAdminSide(_defaultPath.concat([_tabs[i]]))) {
				_route = _tabs[i];
				break;
			} else if (_tabs[i] === 'preparation' && this.hasAccessAdminSide(_defaultPath.concat([_tabs[i]]))) {
				_route = this.projectPreparationDefRoute();
				break;
			} else if (_tabs[i] === 'analysis' && this.hasAccessAdminSide(_defaultPath.concat([_tabs[i]]))) {
				_route = this.projectAnalysisDefRoute();
				break;
			} else if (_tabs[i] === 'followUp' && this.hasAccessAdminSide(_defaultPath.concat([_tabs[i]]))) {
				_route = 'follow-up';
				break;
			}
		}

		return _route;

	}

	/***
	 * this will return the sub-route of the preparation tab under the project.
	 * It has Description, Questionnaire, Targeting and Campaigns as sub-tabs.
	 */
	public projectPreparationDefRoute(): string {
		let _route = '';

		if (this.hasAccessAdminSide(['projects', 'project', 'settings', 'view', 'description'])
			|| this.hasAccessAdminSide(['projects', 'project', 'settings', 'edit', 'description'])) {
			_route = 'preparation/description';
		} else if (this.hasAccessAdminSide(['projects', 'project', 'questionnaire'])) {
			_route = 'preparation/questionnaire';
		} else if (this.hasAccessAdminSide(['projects', 'project', 'settings', 'view', 'targeting'])
			|| this.hasAccessAdminSide(['projects', 'project', 'settings', 'edit', 'targeting'])) {
			_route = 'preparation/targeting'
		} else if (this.hasAccessAdminSide(['projects', 'project', 'campaigns'])) {
			_route = 'preparation/campaigns';
		}

		return _route;

	}

	/***
	 * this will return the sub-route of the analysis tab under the project.
	 * It has Synthesis, Answer Tags, and Storyboard as sub-tabs.
	 */
	public projectAnalysisDefRoute(): string {
		let _route = '';

		if (this.hasAccessAdminSide(['projects', 'project', 'synthesis'])) {
			_route = 'analysis/synthesis';
		} else if (this.hasAccessAdminSide(['projects', 'project', 'answerTags'])) {
			_route = 'analysis/answer-tags';
		} else if (this.hasAccessAdminSide(['projects', 'project', 'storyboard'])) {
			_route = 'analysis/storyboard'
		}

		return _route;

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
