import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

/**
 * Ensure User is NOT authenticated
 */

@Injectable()
export class NonAuthGuard implements CanActivate {
  constructor(private _authService: AuthService,
              private _router: Router) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this._checkLogin(url);
  }

  private _checkLogin(url: string): boolean {
    if (!this._authService.isAuthenticated) { return true; }

    // Store the attempted URL for redirecting
    this._authService.redirectUrl = url;

    // Navigate to the client-login page with extras
    this._router.navigate(['/']);
    return false;
  }
}
