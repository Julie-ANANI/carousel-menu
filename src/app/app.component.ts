import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { TranslateNotificationsService } from './services/notifications/notifications.service';
import { LoaderService } from './services/loader/loader.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/pairwise';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();
  public displayLoader = false;
  private _displayLoading = true; // to show spinner.

  public notificationsOptions = {
    position: ['bottom', 'right'],
    timeOut: 7000,
    lastOnBottom: true,
    maxStack: 4,
    animate: 'fromRight',
    pauseOnHover: false,
    showProgressBar: true,
    clickToClose: true
  };

  constructor(private _translateService: TranslateService,
              private _authService: AuthService,
              private _loaderService: LoaderService,
              private _notificationsService: TranslateNotificationsService,
              private _router: Router) {
  }

  ngOnInit(): void {
    initTranslation(this._translateService);

    this._router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this._loaderService.isLoading$.takeUntil(this.ngUnsubscribe).subscribe((isLoading: boolean) => {
      // Bug corrigé avec setTimeout :
      // https://stackoverflow.com/questions/38930183/angular2-expression-has-changed-after-it-was-checked-binding-to-div-width-wi
      setTimeout((_: void) => { this.displayLoader = isLoading; } );
    });

    this._loaderService.stopLoading();

    setTimeout (() => {
      this._displayLoading = false;
    }, 600);

    if (this._authService.isAcceptingCookies) { // CNIL
      this._authService.initializeSession().takeUntil(this.ngUnsubscribe).subscribe(
        _ => {},
        _ => this._notificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH', {
          clickToClose: false,
          timeOut: 0
        })
      );
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
