import { Injectable } from '@angular/core';
import {Location} from '@angular/common';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

/**
 * if the user is authenticated we redirect the user to the /user/discover.
 */

@Injectable()
export class DiscoverGuard implements CanActivate {

  constructor(private authService: AuthService, private location: Location) {}

  canActivate(_: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    const url: string = routerStateSnapshot.url;
    return this._checkLogin(url);
  }

  private _checkLogin(url: string): boolean {

    if (this.authService.isAuthenticated ) {
      this.location.replaceState('/user/discover');
    }

    return true;

  }
}
