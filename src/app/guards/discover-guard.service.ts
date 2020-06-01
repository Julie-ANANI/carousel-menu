import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * if the user is authenticated we redirect the user to the /user/discover.
 */

@Injectable({providedIn: 'root'})
export class DiscoverGuard implements CanActivate {

  constructor(private _authService: AuthService,
              private _router: Router) {}

  canActivate(_activatedRouteSnapshot: ActivatedRouteSnapshot, _routerStateSnapshot: RouterStateSnapshot): boolean {
    return this._checkLogin(_activatedRouteSnapshot.queryParams, _routerStateSnapshot.url);
  }

  private _checkLogin(queryParams: {[key: string]: string}, url: string): boolean {

    if (this._authService.isAuthenticated && !queryParams['tag']) {
      this._router.navigate([url.replace('discover', 'user/discover')]);
    } else if (this._authService.isAuthenticated && queryParams['tag']) {
      this._router.navigate(['/user', 'discover'], { queryParams: queryParams });
    } else if (this._authService.isAuthenticated) {
      this._router.navigate([url]);
    }

    return true;

  }

}
