import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Ensure User is authenticated
 */

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(_activatedRouteSnapshot: ActivatedRouteSnapshot, _routerStateSnapshot: RouterStateSnapshot): boolean {
    return this._checkLogin(_routerStateSnapshot.url);
  }

  private _checkLogin(url: string): boolean {
    if (this.authService.isAuthenticated ) {

      if (this.authService.isConfirmed || url === '/logout') {
        return true;
      } else {
          this.authService.redirectUrl = url;
          this.router.navigate(['/welcome']);
          return false;
      }

    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}
