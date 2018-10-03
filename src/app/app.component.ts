import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { LoaderService } from './services/loader/loader.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/pairwise';
import { NavigationEnd, Router } from '@angular/router';
import { CurrentRouteService } from './services/frontend/current-route/current-route.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  displayLoader = false;

  private _displayLoading = true; // to show spinner.

  public notificationsOptions = {
    position: ['bottom', 'right'],
    timeOut: 2000,
    lastOnBottom: true,
    maxStack: 4,
    animate: 'fromRight',
    pauseOnHover: false,
    showProgressBar: true,
    clickToClose: true
  };

  constructor(private translateService: TranslateService,
              private authService: AuthService,
              private loaderService: LoaderService,
              private translateNotificationsService: TranslateNotificationsService,
              private router: Router,
              private currentRouteService: CurrentRouteService) {}

  ngOnInit(): void {
    initTranslation(this.translateService);

    this.routeCheck();

    this.loaderService.isLoading$.takeUntil(this.ngUnsubscribe).subscribe((isLoading: boolean) => {
      // Bug corrigé avec setTimeout :
      // https://stackoverflow.com/questions/38930183/angular2-expression-has-changed-after-it-was-checked-binding-to-div-width-wi
      setTimeout((_: void) => {
        this.displayLoader = isLoading;
      });

      this.currentRouteService.setCurrentRoute(this.router.url);

    });

    this.loaderService.stopLoading();

    if (this.authService.isAcceptingCookies) {
      this.authService.initializeSession().takeUntil(this.ngUnsubscribe).subscribe(
        _ => {},
        _ => this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH', {
          timeOut: 0
        }), () => {
          setTimeout (() => {
            this._displayLoading = false;
          }, 400);
        }
      );
    }

  }

  get displayLoading(): boolean {
    return this._displayLoading;
  }

  private routeCheck() {
    this.router.events.subscribe((event) => {
      this.currentRouteService.setCurrentRoute(this.router.url);

      if (!(event instanceof NavigationEnd)) {
        return;
      }

      window.scrollTo(0, 0);

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
