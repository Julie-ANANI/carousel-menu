import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RouteFrontService } from '../services/route/route-front.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate, CanActivateChild {

  constructor(private _authService: AuthService,
              private _routeFrontService: RouteFrontService,
              private _router: Router) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    return this.checkAdmin(routerStateSnapshot.url);
  }

  canActivateChild(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    return this.checkAdmin(routerStateSnapshot.url);
  }

  checkAdmin(url: string): boolean {

    // Store the attempted URL for redirecting
    this._authService.redirectUrl = this._routeFrontService.redirectRoute(url);

    if (!this._authService.isAuthenticated) {
      this._router.navigate(['/login']);
    } else if (this._authService.adminLevel > 1) {
      return true;
    }

    this._router.navigate(['/user']);
    return false;

  }

}
