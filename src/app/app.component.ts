import { Component, OnInit, PLATFORM_ID, Inject, HostListener, OnDestroy } from '@angular/core';
import { NotificationAnimationType, Options } from 'angular2-notifications';
import { initTranslation, TranslateService } from './i18n/i18n';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth/auth.service';
import { TranslateNotificationsService } from './services/translate-notifications/translate-notifications.service';
import { MouseService } from './services/mouse/mouse.service';
import { SocketService } from './services/socket/socket.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { WorldmapService } from "./services/worldmap/worldmap.service";
import {NavigationEnd, Router} from '@angular/router';
import {RouteFrontService} from './services/route/route-front.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

  get timeout(): any {
    return this._timeout;
  }

  get spinnerState(): boolean {
    return this._spinnerState;
  }

  private _notificationsOptions: Options = {
    position: ['bottom', 'right'],
    timeOut: 3000,
    lastOnBottom: true,
    maxStack: 2,
    animate: NotificationAnimationType.FromRight,
    pauseOnHover: true,
    showProgressBar: true,
    clickToClose: true,
    clickIconToClose: true
  };

  private _startMouseEvent = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _spinnerState = true;

  private static _setFavicon() {
    if (environment.domain !== 'umi' && environment.domain !== 'dynergie') {
      const linkElement = document.createElement('link');
      linkElement.setAttribute('id', 'theicon');
      linkElement.setAttribute('rel', 'icon');
      linkElement.setAttribute('type', 'image/x-icon');
      linkElement.setAttribute('href', 'https://res.cloudinary.com/umi/image/upload/app/favicon-wl.ico');
      document.head.appendChild(linkElement);
    }
  }

  private _timeout: any = null;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _router: Router,
              private _translateService: TranslateService,
              private _authService: AuthService,
              private _mouseService: MouseService,
              private _routeFrontService: RouteFrontService,
              private _socketService: SocketService,
              private _worldMapService: WorldmapService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }

  ngOnInit(): void {
    initTranslation(this._translateService);
    AppComponent._setFavicon();
    this._routeFrontService.initSide();
    this._spinner();
    this._initializeSession();
    this._getCountries();
    this._socketEvent();
    this._mouseEvent();
  }

  private _getCountries(): void {
    this._worldMapService.getCountriesList().then(_ => {
      console.log('worldMap service connected');
    });
  }

  /***
   * configuring the full page spinner when the application instance is started again.
   * @private
   */
  private _spinner() {
    if (this._spinnerState) {
      this._router.events.subscribe((events) => {
        if (events instanceof NavigationEnd) {
          this._stopSpinner();
        }
      });
    }
  }

  private _stopSpinner() {
    if (this._spinnerState && this._router.navigated) {
      this._timeout = setTimeout(() => {
        this._spinnerState = false;
      }, 1500);
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this._startMouseEvent) {
      this._mouseService.setClickEvent(event);
    }
  }

  /**
   * we initialize session if we haven't used the guard for the page.
   * @private
   */
  private _initializeSession() {
    if (!this._authService.user) {
      this._authService.initializeSession().pipe(takeUntil(this._ngUnsubscribe)).subscribe(() => {
        console.log('The application has been started.');
        this._stopSpinner();
      }, () => {
        this._stopSpinner();
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
      });
    } else {
      this._stopSpinner();
      console.log('The application has been started.');
    }
  }

  private _socketEvent() {
    this._socketService.listenToSocket().pipe(takeUntil(this._ngUnsubscribe)).subscribe(() => {
      this._socketService.sendDataToApi('helloBack', {'hello': 'back'});
    }, (err: HttpErrorResponse) => {
      console.error(err);
    });
  }

  private _mouseEvent() {
    this._mouseService.getStartEvent().pipe(takeUntil(this._ngUnsubscribe)).subscribe((value: boolean) => {
      this._startMouseEvent = value;
    });
  }

  get notificationsOptions(): Options {
    return this._notificationsOptions;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
    clearTimeout(this._timeout);
  }

  getMenuClicked($event: any) {
    console.log($event);
  }
}

