import { Component, Inject, OnInit, HostListener, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { initTranslation, TranslateService } from './i18n/i18n';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { NavigationEnd, Router } from '@angular/router';
import { MouseService } from './services/mouse/mouse.service';
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

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
              private mouseService: MouseService) {}

  ngOnInit(): void {

    this._setFavicon();
    initTranslation(this.translateService);

    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          window.scrollTo(0, 0);
        }
      });
    }

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

  get notificationsOptions(): { showProgressBar: boolean; lastOnBottom: boolean; pauseOnHover: boolean; position: string[]; maxStack: number; animate: string; timeOut: number; clickToClose: boolean } {
    return this._notificationsOptions;
  }

  //Favicon
  private _setFavicon() {
    let linkElement = document.createElement( "link" );
    linkElement.setAttribute( "id", "theicon" );
    linkElement.setAttribute( "rel", "icon" );
    linkElement.setAttribute( "type", "image/x-icon" );
    if(environment.domain !== 'umi' && environment.domain !== 'dynergie') {
      linkElement.setAttribute( "href", "https://res.cloudinary.com/umi/image/upload/app/favicon-wl.ico" );
    } else {
      linkElement.setAttribute( "href", "https://res.cloudinary.com/umi/image/upload/app/favicon.ico" );
    }
    document.head.appendChild( linkElement );
  }

}

