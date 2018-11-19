import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Ensure User is authenticated
 */

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this._checkLogin(url);
  }

  private _checkLogin(url: string): boolean {
    if (this.authService.isAuthenticated ) {

      if (this.authService.isConfirmed || url === '/logout') {
        return true;
      } else {
          this.authService.redirectUrl = url;
          // this.router.navigate(['/user/client/welcome']);
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
