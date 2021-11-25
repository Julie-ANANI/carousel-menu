import { Component, OnInit, PLATFORM_ID, Inject, HostListener, OnDestroy } from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import { NotificationAnimationType, Options } from 'angular2-notifications';
import { initTranslation, TranslateService } from './i18n/i18n';
import { environment } from '../environments/environment';
import { MouseService } from './services/mouse/mouse.service';
import { SocketService } from './services/socket/socket.service';
import {takeUntil} from 'rxjs/operators';
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
    maxStack: 3,
    animate: NotificationAnimationType.FromRight,
    pauseOnHover: true,
    showProgressBar: true,
    clickToClose: true,
    clickIconToClose: true
  };

  private _startMouseEvent = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private static _setFavicon() {
    const linkElement = document.createElement('link');
    linkElement.setAttribute('id', 'theicon');
    linkElement.setAttribute('rel', 'icon');
    linkElement.setAttribute('type', 'image/x-icon');
    if (environment.domain !== 'umi' && environment.domain !== 'dynergie') {
      linkElement.setAttribute('href', 'https://res.cloudinary.com/umi/image/upload/app/favicon-wl.ico');
    } else {
      linkElement.setAttribute('href', 'https://res.cloudinary.com/umi/image/upload/cropped-favicon-1-192x192_cwgv3h.png');
    }
    document.head.appendChild( linkElement );
  }

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _mouseService: MouseService,
              private _socketService: SocketService) {
    initTranslation(this._translateService);
  }

  ngOnInit(): void {
    if (isPlatformServer(this._platformId)) {
      console.log('New connection has been made with the front.');
    }

    if (isPlatformBrowser(this._platformId)) {
      AppComponent._setFavicon();
      this._socketEvent();
      this._mouseEvent();
      console.log('The application has been started.');
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this._startMouseEvent) {
      this._mouseService.setClickEvent(event);
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

  get notificationsOptions(): Options {
    return this._notificationsOptions;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

