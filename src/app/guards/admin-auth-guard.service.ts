import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate, CanActivateChild {
  constructor(private _authService: AuthService,
              private _router: Router) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    const url: string = routerStateSnapshot.url;
    return this.checkAdmin(url);
  }

  canActivateChild(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    const url: string = routerStateSnapshot.url;
    return this.checkAdmin(url);
  }

  checkAdmin(url: string): boolean {

    if (!this._authService.isAuthenticated) {
      this._authService.redirectUrl = url;
      this._router.navigate(['/login']);
    } else if (this._authService.adminLevel > 0) {
      return true;
    }

    this._router.navigate(['/user']);
    return false;

  }

}
