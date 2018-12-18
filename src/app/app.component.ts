import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { NavigationEnd, Router } from '@angular/router';
import { ScrollService } from './services/scroll/scroll.service';
import { LoaderService } from './services/loader/loader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

  private _displayLoader = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  notificationsOptions = {
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
              private scrollService: ScrollService,
              private loaderService: LoaderService) {}

  ngOnInit(): void {

    initTranslation(this.translateService);

    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((event) => {
        if (!(event instanceof NavigationEnd)) {
          return;
        }
        window.scrollTo(0, 0);
      });
    }

    if (this.authService.isAcceptingCookies) {
      this.authService.initializeSession().subscribe(() => {
        }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH', {timeOut: 0})
        }
      );
    }

    this.loaderService.isLoading$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((isLoading: boolean) => {
      // Bug corrigé avec setTimeout :
      // https://stackoverflow.com/questions/38930183/angular2-expression-has-changed-after-it-was-checked-binding-to-div-width-wi
      setTimeout((_: void) => {
        this._displayLoader = isLoading;
      });
    });

    this.loaderService.stopLoading();

  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollService.setScrollValue(window.pageYOffset || window.scrollY || 0);
  }


  get displayLoader(): boolean {
    return this._displayLoader;
  }

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}


/***
 * This is to listen the click event on the page.
 */
/*@HostListener('mouseup', ['$event'])
onMouseUp(event: any) {
  this.listenerService.setClickEvent(event);
}

user initializeService() {
  this.currentRouteService.setCurrentRoute(this.router.url);
}

get notificationsOptions() {
  return this._notificationsOptions;
}

getLogo(): string {
  return environment.logoURL;
}

getDomain(): string {
 return environment.domain;
}*/

