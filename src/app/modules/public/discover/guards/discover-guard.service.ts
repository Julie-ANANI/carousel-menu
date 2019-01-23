import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

/**
 * if the user is authenticated we redirect the user to the /user/discover.
 */

@Injectable()
export class DiscoverGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(activatedRoute: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    return this._checkLogin(activatedRoute.queryParams);
  }

  private _checkLogin(queryParams: {[key: string]: string}): boolean {

    if (this.authService.isAuthenticated ) {
      this.router.navigate(['/user', 'discover'], {
        queryParams: queryParams
      });
    }

    return true;

  }
}
