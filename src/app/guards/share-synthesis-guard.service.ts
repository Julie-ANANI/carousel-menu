import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * if the user is authenticated we redirect the user to the /user/synthesis.
 */

@Injectable({providedIn: 'root'})
export class ShareSynthesisGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(activatedRoute: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated && !!this.authService.user) {
      this.router.navigate([routerStateSnapshot.url.replace('share', 'user'), {}]);
    }
    return true;
  }
}
