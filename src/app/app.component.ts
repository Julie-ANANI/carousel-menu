import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { LoaderService } from './services/loader/loader.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/pairwise';
import { NavigationEnd, Router } from '@angular/router';
import { CurrentRouteService } from './services/frontend/current-route/current-route.service';
import { ListenerService } from './services/frontend/listener/listener.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  private _displayLoader = false;

  private _displayLoading = true; // to show spinner.

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

  constructor(private translateService: TranslateService,
              private authService: AuthService,
              private loaderService: LoaderService,
              private translateNotificationsService: TranslateNotificationsService,
              private router: Router,
              private currentRouteService: CurrentRouteService,
              private listenerService: ListenerService) {}

  ngOnInit(): void {
    initTranslation(this.translateService);

    this.router.events.subscribe((event) => {
      this.initializeService();

      if (!(event instanceof NavigationEnd)) {
        return;
      }

      window.scrollTo(0, 0);

    });

    this.loaderService.isLoading$.takeUntil(this.ngUnsubscribe).subscribe((isLoading: boolean) => {
      // Bug corrigé avec setTimeout :
      // https://stackoverflow.com/questions/38930183/angular2-expression-has-changed-after-it-was-checked-binding-to-div-width-wi
      setTimeout((_: void) => {
        this._displayLoader = isLoading;
      });

      this.initializeService();

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

  /***
   * This is to listen the click event on the page.
   */
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: any) {
    this.listenerService.setClickEvent(event);
  }

  private initializeService() {
    this.currentRouteService.setCurrentRoute(this.router.url);
  }

  get displayLoading(): boolean {
    return this._displayLoading;
  }

  get displayLoader(): boolean {
    return this._displayLoader;
  }

  getLogo(): string {
    return environment.logoURL;
  }

  getDomain(): string {
   return environment.domain;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
