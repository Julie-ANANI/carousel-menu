import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class DocsGuardService implements CanActivate, CanActivateChild {

  constructor(private _authService: AuthService,
              private _router: Router) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    return this._checkLogin(routerStateSnapshot.url);
  }

  canActivateChild(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    return this._checkLogin(routerStateSnapshot.url);
  }

  private _checkLogin(url: string): boolean {

    if (this._authService.adminLevel === 3 && DocsGuardService.userDomain === 'umi') {
      return true;
    }

    this._router.navigate(['user/projects']);
    return false;

  }

  static get userDomain(): string {
    return environment.domain;
  }

}
