import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

/**
 * if the user is authenticated we redirect the user to the /user/synthesis.
 */

@Injectable()
export class ShareSynthesisGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate(_: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    const url: string = routerStateSnapshot.url;
    return this._checkLogin(url);
  }

  private _checkLogin(url: string): boolean {

    if (this.authService.isAuthenticated ) {
      window.location.href = url.replace('/share/synthesis', '/user/synthesis');
      return true;
    }

    return true;

  }
}
