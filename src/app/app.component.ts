import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NotificationAnimationType, Options } from 'angular2-notifications';
import { initTranslation, TranslateService } from './i18n/i18n';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth/auth.service';
import { TranslateNotificationsService } from './services/notifications/notifications.service';

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
              private _translateService: TranslateService,
              private _authService: AuthService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this.setFavicon();
    initTranslation(this._translateService);

    if (this.authService.isAcceptingCookies) {
      this.authService.initializeSession().subscribe(() => {}, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH', { timeOut: 0 });
      });
    }

  }


  ngOnInit(): void {

    //this._setSwellRTScript();

  }


  // Favicon
  private setFavicon() {
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

}

