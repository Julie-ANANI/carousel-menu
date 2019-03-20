import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NotificationAnimationType, Options } from 'angular2-notifications';
import { AuthService } from './services/auth/auth.service';
import { initTranslation, TranslateService } from './i18n/i18n';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { MouseService } from './services/mouse/mouse.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  private _notificationsOptions: Options = {
    position: ['bottom', 'right'],
    timeOut: 2000,
    lastOnBottom: true,
    maxStack: 4,
    animate: NotificationAnimationType.FromRight,
    pauseOnHover: false,
    showProgressBar: true,
    clickToClose: true
  };

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private translateService: TranslateService,
              private authService: AuthService,
              private translateNotificationsService: TranslateNotificationsService,
              private mouseService: MouseService) {}

  ngOnInit(): void {

    this._setFavicon();

    initTranslation(this.translateService);

    if (this.authService.isAcceptingCookies) {
      this.authService.initializeSession().subscribe(() => {
        }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH', {timeOut: 0})
        }
      );
    }
  }

  /***
   * This is to listen the click event on the page.
   */
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: any) {
    this.mouseService.setClickEvent(event);
  }

  get notificationsOptions(): Options {
    return this._notificationsOptions;
  }

  // Favicon
  private _setFavicon() {
    if (isPlatformBrowser(this.platformId)) {
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

}

