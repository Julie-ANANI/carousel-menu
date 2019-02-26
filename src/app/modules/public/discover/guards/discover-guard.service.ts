import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, Params} from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import {environment} from '../../../../../environments/environment';

/**
 * if the user is authenticated we redirect the user to the /user/discover.
 */

@Injectable()
export class DiscoverGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    return this._checkLogin(activatedRouteSnapshot.queryParams, routerStateSnapshot.url, activatedRouteSnapshot.params);
  }

  private _checkLogin(queryParams: {[key: string]: string}, url: string, params: Params): boolean {

    console.log(queryParams);

    if (this.authService.isAuthenticated && queryParams) {
      console.log('sqdqs');
      this.router.navigate(['/user', 'discover'], {
        queryParams: queryParams
      });
    } else if (this.authService.isAuthenticated && params) {
      console.log('qsdq');
      this.router.navigate([ `${environment.clientUrl}/user/discover/${params['projectId']}/${params['lang']}`  , {}]);
    }

    console.log('qsdqssez');

    return true;

  }
}
