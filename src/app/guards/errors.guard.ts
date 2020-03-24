import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Params, CanActivateChild, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ErrorsGuard implements CanActivateChild, CanActivate {

  constructor(private _authService: AuthService,
              private _router: Router) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean {
    return this._checkAccess(activatedRouteSnapshot.queryParams);
  }

  canActivateChild(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean {
    return this._checkAccess(activatedRouteSnapshot.queryParams);
  }

  private _checkAccess(queryParams: Params): boolean {

    if (this._authService.errorUrl && queryParams['error-value']) {
      this._authService.errorUrl = '';
      return true;
    }

    // Navigate to login page.
    this._router.navigate(['/login']);
    return false;

  }

}
