import { Component, Inject, OnInit, OnDestroy, HostListener, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { CurrentRouteService } from './services/frontend/current-route/current-route.service';
import { ListenerService } from './services/frontend/listener/listener.service';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  // private _displayLoader = false;

  private _notificationsOptions = {
    position: ['bottom', 'right'],
    timeOut: 2000,
    lastOnBottom: true,
    maxStack: 4,
    animate: 'fromRight',
    pauseOnHover: false,
    showProgressBar: true,
    clickToClose: true
  };

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private translateService: TranslateService,
              private authService: AuthService,
              private translateNotificationsService: TranslateNotificationsService,
              private router: Router,
              private currentRouteService: CurrentRouteService,
              private listenerService: ListenerService) {}

  ngOnInit(): void {

    initTranslation(this.translateService);

    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((event) => {
        this.initializeService();

        if (!(event instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });

      /*this.loaderService.isLoading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isLoading: boolean) => {
        // Bug corrigé avec setTimeout :
        // https://stackoverflow.com/questions/38930183/angular2-expression-has-changed-after-it-was-checked-binding-to-div-width-wi
        setTimeout((_: void) => {
          this._displayLoader = isLoading;
        });
      });*/

    }

    if (isPlatformServer(this.platformId)) {
      if (this.authService.isAcceptingCookies) {
        this.authService.initializeSession().subscribe(
          (_: any) => {
          },
          (_: any) => this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH', {
            timeOut: 0
          })
        );
      }
    }
  }

  /***
   * This is to listen the click event on the page.
   */
  @HostListener('mouseup', ['$event'])
  onMouseUp() {
    this.listenerService.setClickEvent(event);
  }

  private initializeService() {
    this.currentRouteService.setCurrentRoute(this.router.url);
  }

  get notificationsOptions() {
    return this._notificationsOptions;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
