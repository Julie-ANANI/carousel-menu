import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

const ACL = ["juandavidcruz@gmail.com", "ecdk@icv-finance.com"];

import {Md5} from 'ts-md5/dist/md5';

@Injectable({providedIn: 'root'})
export class AdHocAuthGuard implements CanActivate {
  constructor(private _authService: AuthService,
              private _router: Router) {
  }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkACL(url);
  }

  checkACL(url: string): boolean {
    if (!this._authService.isAuthenticated) {
      this._authService.redirectUrl = url;
      this._router.navigate(['/login']);
    } else if (this._authService.adminLevel > 0) {
      return true;
    } else {
      const mhash = this._authService.getMHash();
      if(mhash) {
        const md5 = new Md5();
        const HACL = ACL.map(el=>{ return md5.appendStr(el).end()});
        return HACL.indexOf(mhash) > -1;
      } else {
        this._router.navigate(['/']);
        return false;
      }
    }
    this._router.navigate(['/']);
    return false;
  }
}
