import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Ensure User is authenticated
 */

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService,
              private _router: Router) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this._checkLogin(url);
  }

  private _checkLogin(url: string): boolean {
    if (this._authService.isAuthenticated ) {
      if (this._authService.isConfirmed || url === '/logout') {
        return true;
      } else {
          this._authService.redirectUrl = url;
          this._router.navigate(['/welcome']);
          return false;
      }
    }

    // Store the attempted URL for redirecting
    this._authService.redirectUrl = url;

    // Navigate to the client-login page with extras
    this._router.navigate(['/login']);
    return false;
  }
}
