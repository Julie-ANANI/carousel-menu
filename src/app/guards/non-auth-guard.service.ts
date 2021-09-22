import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Ensure User is NOT authenticated
 */

@Injectable({providedIn: 'root'})
export class NonAuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    return this._checkLogin();
  }

  private _checkLogin(): boolean {

    console.log('non auth');

    if (!this.authService.isAuthenticated) {
      return true;
    }

    console.log('non auth2');

    // Navigate to the default first auth page
    this.router.navigate(['/']);
    return false;
  }

}
