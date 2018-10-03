import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { LoaderService } from './services/loader/loader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  displayLoader = false;

  private _displayLoading = true; // to show spinner.

  public notificationsOptions = {
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
              private loaderService: LoaderService,
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

      this.loaderService.isLoading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isLoading: boolean) => {
        // Bug corrigé avec setTimeout :
        // https://stackoverflow.com/questions/38930183/angular2-expression-has-changed-after-it-was-checked-binding-to-div-width-wi
        setTimeout((_: void) => {
          this.displayLoader = isLoading;
        });
      });

      this.loaderService.stopLoading();

      if (this.authService.isAcceptingCookies) {
        this.authService.initializeSession().subscribe(
          (_: any) => {},
          (_: any) => this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH', {
            timeOut: 0
          }), () => {
            setTimeout (() => {
              this._displayLoading = false;
            }, 400); // TODO: why is there 400 ms timeout before displaying the app ?
          }
        );
      }
    }

  }

  get displayLoading(): boolean {
    return this._displayLoading;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
