import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, Params } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

/**
 * if the user is authenticated we redirect the user to the /user/discover.
 */

@Injectable()
export class DiscoverGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    return this._checkLogin(activatedRouteSnapshot.queryParams, routerStateSnapshot.url, activatedRouteSnapshot.params);
  }

  private _checkLogin(queryParams: {[key: string]: string}, url: string, params: Params): boolean {

    if (this.authService.isAuthenticated && !queryParams['tag']) {
      this.router.navigate([url.replace('discover', 'user/discover')]);
    } else if (this.authService.isAuthenticated && queryParams['tag']) {
      this.router.navigate(['/user', 'discover'], { queryParams: queryParams });
    }

    return true;

  }

}
