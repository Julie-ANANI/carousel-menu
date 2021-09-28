import {Injectable, OnDestroy} from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RouteFrontService } from '../services/route/route-front.service';
import {Observable, of, Subject} from 'rxjs';
import {catchError, map, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate, CanActivateChild, OnDestroy {

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _authService: AuthService,
              private _routeFrontService: RouteFrontService,
              private _router: Router) { }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot):
    boolean | Observable<boolean> {
    return this.checkAdmin(routerStateSnapshot.url);
  }

  canActivateChild(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot):
    boolean | Observable<boolean> {
    return this.checkAdmin(routerStateSnapshot.url);
  }

  checkAdmin(url: string): boolean | Observable<boolean> {

    // Store the attempted URL for redirecting
    this._authService.redirectUrl = this._routeFrontService.redirectRoute(url);

    if (!this._authService.isAuthenticated) {
      this._router.navigate(['/login']);
      return false;
    } else if (!this._authService.user) {
      return this._authService.initializeSession().pipe(takeUntil(this._ngUnsubscribe), map ((_) => {
        return this._navigateTo();
      }), catchError((err: HttpErrorResponse) => {
        console.error(err);
        this._router.navigate(['/user']);
        return of(false);
      }));
    }

    return this._navigateTo();
  }

  private _navigateTo(): boolean {
    if (this._authService.adminLevel > 1) {
      return true;
    }
    this._router.navigate(['/user']);
    return false;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
