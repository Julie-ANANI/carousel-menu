import {Inject, Injectable, OnDestroy, PLATFORM_ID} from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RouteFrontService } from '../services/route/route-front.service';
import {Observable, of, Subject} from 'rxjs';
import {catchError, map, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';

/**
 * Ensure User is authenticated
 */

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild, OnDestroy {

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _authService: AuthService,
              private _routeFrontService: RouteFrontService,
              private _router: Router) {}

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot):
    boolean | Observable<boolean> {
    return this._checkLogin(routerStateSnapshot.url);
  }

  canActivateChild(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot):
    boolean | Observable<boolean> {
    return this._checkLogin(routerStateSnapshot.url);
  }

  private _checkLogin(url: string): boolean | Observable<boolean> {

    // Store the attempted URL for redirecting
    this._authService.redirectUrl = !!this._authService.redirectUrl
      ? this._authService.redirectUrl : this._routeFrontService.redirectRoute(url);

    if (this._authService.isAuthenticated) {
      if (this._authService.isConfirmed) {
        if (url === '/logout' || !!this._authService.user) {
          return true;
        } else if (!this._authService.user) {
          return this._authService.initializeSession().pipe(takeUntil(this._ngUnsubscribe), map ((_) => {
            return true;
          }), catchError((err: HttpErrorResponse) => {
            console.error(err);
            this._router.navigate(['/login']);
            return of(false);
          }));
        }
      } else if (isPlatformBrowser(this._platformId)) {
        this._router.navigate(['/welcome']);
        return false;
      }
    }

    // Navigate to the login page with extras
    this._router.navigate(['/login']);
    return false;

  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
