import { Component, Inject, OnInit, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

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
              private router: Router) {}

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

    if (isPlatformServer(this.platformId)) {
      if (this.authService.isAcceptingCookies) {
        this.authService.initializeSession().subscribe(
          () => {
          },
          () => this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH', {timeOut: 0})
        );
      }
    }

  }

}


/*this.loaderService.isLoading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isLoading: boolean) => {
       // Bug corrigé avec setTimeout :
       // https://stackoverflow.com/questions/38930183/angular2-expression-has-changed-after-it-was-checked-binding-to-div-width-wi
       setTimeout((_: void) => {
         this._displayLoader = isLoading;
       });
     });*/

/***
 * This is to listen the click event on the page.
 */
/*@HostListener('mouseup', ['$event'])
onMouseUp(event: any) {
  this.listenerService.setClickEvent(event);
}

private initializeService() {
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

/*  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }*/
