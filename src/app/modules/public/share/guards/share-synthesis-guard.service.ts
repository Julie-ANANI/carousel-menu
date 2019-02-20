import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

/**
 * if the user is authenticated we redirect the user to the /user/synthesis.
 */

@Injectable()
export class ShareSynthesisGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(activatedRoute: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    return this._checkLogin(routerStateSnapshot.url);
  }

  private _checkLogin(url: string): boolean {

    if (this.authService.isAuthenticated ) {
      this.router.navigate([url.replace('share', 'user'), {}]);
    }

    return true;

  }
}
