import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RouteFrontService } from '../services/route/route-front.service';

/**
 * Ensure User is authenticated
 */

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private _authService: AuthService,
              private _routeFrontService: RouteFrontService,
              private _router: Router) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    return this._checkLogin(routerStateSnapshot.url);
  }

  canActivateChild(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    return this._checkLogin(routerStateSnapshot.url);
  }

  private _checkLogin(url: string): boolean {

    // Store the attempted URL for redirecting
    this._authService.redirectUrl = this._routeFrontService.redirectRoute(url);

    if (this._authService.isAuthenticated ) {

      if (this._authService.isConfirmed || url === '/logout') {
        return true;
      } else {
          this._authService.redirectUrl = url;
          this._router.navigate(['/welcome']);
          return false;
      }

    }

    // Navigate to the login page with extras
    this._router.navigate(['/login']);
    return false;

  }

}
