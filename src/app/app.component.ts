import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import {TranslateNotificationsService} from './services/notifications/notifications.service';
import { LoaderService } from './services/loader/loader.service';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/pairwise';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: '<simple-notifications [options]="notificationsOptions" class="hide-on-small-and-down"></simple-notifications>' +
  '<progress class="progress" max="100" *ngIf="displayLoader"></progress>' +
  '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit, OnDestroy {

  private _appIsLoadingSubscription: Subscription;
  public displayLoader = false;

  public notificationsOptions = {
    position: ['top', 'right'],
    timeOut: 5000,
    lastOnBottom: false,
    maxStack: 4,
    theClass: 'notification'
  };

  constructor(private _translateService: TranslateService,
              private _authService: AuthService,
              private _loaderService: LoaderService,
              private _notificationsService: TranslateNotificationsService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);

    this._appIsLoadingSubscription = this._loaderService.isLoading$.subscribe((isLoading: boolean) => {
      // Bug corrigé avec setTimeout : https://stackoverflow.com/questions/38930183/angular2-expression-has-changed-after-it-was-checked-binding-to-div-width-wi
      setTimeout(_ => { this.displayLoader = isLoading; });
    });

    if (this._authService.isAcceptingCookies) { // CNIL
      this._authService.initializeSession().subscribe(
        res => null,
        error => this._notificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH', {
          clickToClose: false,
          timeOut: 0
        })
      );
    }
  }

  ngOnDestroy() {
    this._appIsLoadingSubscription.unsubscribe();
  }
}
