import {Injectable, OnDestroy} from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { RouteFrontService } from '../services/route/route-front.service';
import {Observable, of, Subject} from 'rxjs';
import {catchError, map, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';

/**
 * Ensure User is authenticated
 */

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild, OnDestroy {

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _authService: AuthService,
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


    console.log('ssgjscbcbbcbbcgza');
    console.log(this._authService);
    console.log(url);

    // Store the attempted URL for redirecting
    this._authService.redirectUrl = !!this._authService.redirectUrl
      ? this._authService.redirectUrl : this._routeFrontService.redirectRoute(url);

    console.log(this._authService.redirectUrl);

    if (this._authService.isAuthenticated) {
      if (this._authService.isConfirmed) {
        if (url === '/logout') {
          return true;
        } else if (!this._authService.user) {
          return this._authService.initializeSession().pipe(takeUntil(this._ngUnsubscribe), map ((_) => {
            console.log('ssgjzéezaezeéé"é"zezsgza');
            console.log(_);
            return true;
          }), catchError((err: HttpErrorResponse) => {
            console.error(err);
            this._router.navigate(['/login']);
            return of(false);
          }));
        }
        /**
         * this below case is for the printer user.
         */
      } else if (this._authService.adminLevel === 4 && !this._authService.user) {
        return true;
      } else {
        console.log('ssgjsgza');
        this._router.navigate(['/welcome']);
        return false;
      }
    }

    console.log('login page');

    // Navigate to the login page with extras
    this._router.navigate(['/login']);
    return false;

  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
