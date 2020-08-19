import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RolesFrontService } from '../services/roles/roles-front.service';

@Injectable({ providedIn: 'root' })
export class AdminRoleGuardService implements CanActivate {

  constructor(private _rolesFrontService: RolesFrontService,
              private _router: Router) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    const url: string = routerStateSnapshot.url;
    return this.checkRouteAccess(url, activatedRouteSnapshot);
  }

  // Todo check it again having problem while recovering the user object.
  public checkRouteAccess(url: string, route: ActivatedRouteSnapshot): boolean {
    const _data = route.data;
    const _path = _data['accessPath'] as Array<string> || [];

    if (_path.length && !!this._rolesFrontService.hasAccessAdminSide(_path)) {
      return true;
    }

    this._router.navigate(['/not-authorized']);
    return false;

  }

}
