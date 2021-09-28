import { Component, OnInit, PLATFORM_ID, Inject, HostListener, OnDestroy } from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import { NotificationAnimationType, Options } from 'angular2-notifications';
import { initTranslation, TranslateService } from './i18n/i18n';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth/auth.service';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { MouseService } from './services/mouse/mouse.service';
import { SocketService } from './services/socket/socket.service';
import {first, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

  private _notificationsOptions: Options = {
    position: ['bottom', 'right'],
    timeOut: 1500,
    lastOnBottom: true,
    maxStack: 1,
    animate: NotificationAnimationType.FromRight,
    pauseOnHover: true,
    showProgressBar: true,
    clickToClose: true,
    clickIconToClose: true
  };

  private _startMouseEvent = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _authService: AuthService,
              private _mouseService: MouseService,
              private _socketService: SocketService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._setFavicon();
    initTranslation(this._translateService);

    if (isPlatformServer(this._platformId)) {
      console.log('The server has made connection with the UMI Front Application.');
    } else if (isPlatformBrowser(this._platformId)) {
      this._initializeSession();
    }
  }

  ngOnInit(): void {
    this._socketEvent();
    this._mouseEvent();
    // this._setSwellRTScript();
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this._startMouseEvent) {
      this._mouseService.setClickEvent(event);
    }
  }

  /**
   * we initialize session if we haven't use the guard for the page.
   * @private
   */
  private _initializeSession() {
    if (!this._authService.user) {
      this._authService.initializeSession().pipe(first()).subscribe((_) => {
        console.log('The application has been started.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
        console.error(err);
      });
    } else {
      console.log('The application has been started.');
    }
  }

  private _socketEvent() {
    this._socketService.listenToSocket().pipe(takeUntil(this._ngUnsubscribe)).subscribe(() => {
      this._socketService.sendDataToApi('helloBack', { 'hello': 'back' });
    }, (err: HttpErrorResponse) => {
      console.error(err);
    });
  }

  private _mouseEvent() {
    this._mouseService.getStartEvent().pipe(takeUntil(this._ngUnsubscribe)).subscribe((value: boolean) => {
      this._startMouseEvent = value;
    });
  }

  // Favicon
  private _setFavicon() {
    if (isPlatformBrowser(this._platformId)) {
      const linkElement = document.createElement('link');
      linkElement.setAttribute('id', 'theicon');
      linkElement.setAttribute('rel', 'icon');
      linkElement.setAttribute('type', 'image/x-icon');
      if (environment.domain !== 'umi' && environment.domain !== 'dynergie') {
        linkElement.setAttribute('href', 'https://res.cloudinary.com/umi/image/upload/app/favicon-wl.ico');
      } else {
        linkElement.setAttribute('href', 'https://res.cloudinary.com/umi/image/upload/app/favicon.ico');
      }
      document.head.appendChild( linkElement );
    }
  }

  /*private _setSwellRTScript() {
    let SWELL_CONTEXT = "swellrt_beta";
    let SWELL_JS_MODULE = "swellrt_beta.nocache.js";

    window.swell = {

      ready: function(handler) {
        if (!handler || typeof handler !== "function")
          return;

        if (window.swellrt.runtime) {
          handler(window.swell.runtime.get());
        } else {
          if (!window._lh)
            window._lh = [];
          window._lh.push(handler);
        }
      }
    }

    // Some alias
    window.swellrt = window.swell;
    window.swell.onReady = window.swell.ready;

    const linkElement = document.createElement('script');
    linkElement.setAttribute('type', 'text/javascript');
    linkElement.setAttribute('id', 'swellrt');
    if(environment.local) {
      //linkElement.setAttribute('src', '/swellrt-beta.js');
      linkElement.setAttribute('src', `http://localhost:9898/${SWELL_CONTEXT}/${SWELL_JS_MODULE}`);
    } else {
      if(environment.apiUrl === 'https://dev.umi.us') {
        linkElement.setAttribute('src', `https://swellrtdev.umi.us:9899/${SWELL_CONTEXT}/${SWELL_JS_MODULE}`);
      } else {
        linkElement.setAttribute('src', `https://swellrt.umi.us:9899/${SWELL_CONTEXT}/${SWELL_JS_MODULE}`);
      }
    }
    document.head.appendChild( linkElement );
  }*/

  get notificationsOptions(): Options {
    return this._notificationsOptions;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

