import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RolesFrontService } from '../services/roles/roles-front.service';
import { AuthService } from '../services/auth/auth.service';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminRoleGuard implements CanActivate, OnDestroy {

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _rolesFrontService: RolesFrontService,
              private _authService: AuthService,
              private _router: Router) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean | Observable<boolean> {
    const _path = activatedRouteSnapshot.data['accessPath'] as Array<string> || [];

    if (!this._authService.adminAccess) {
      return this._authService.initializeSession().pipe(takeUntil(this._ngUnsubscribe), map ((_) => {
        return this._navigateTo(_path);
      }), catchError((err: HttpErrorResponse) => {
        console.error(err);
        this._router.navigate(['/user']);
        return of(false);
      }));
    } else {
      return this._navigateTo(_path);
    }

  }

  private _navigateTo(path: Array<string>): boolean {
    if (path.length && !!this._rolesFrontService.hasAccessAdminSide(path)) {
      return true;
    }
    this._router.navigate(['/not-authorized']);
    return false;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
