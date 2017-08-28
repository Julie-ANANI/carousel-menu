import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { NotificationsService } from 'angular2-notifications';

import 'rxjs/add/operator/pairwise';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.styl'],
  template: '<simple-notifications [options]="notificationsOptions" class="hide-on-small-and-down"></simple-notifications>' +
  '<app-http-loader></app-http-loader>' +
  '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  public notificationsOptions = {
    position: ['top', 'right'],
    timeOut: 5000,
    lastOnBottom: false,
    maxStack: 4,
    theClass: 'notification'
  };

  constructor(private _translateService: TranslateService,
              private _authService: AuthService,
              private _notificationsService: NotificationsService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);

    if (this._authService.isAcceptingCookies) { // CNIL
      this._authService.initializeSession().subscribe(
        res => null,
        error => this._notificationsService.error('Erreur', 'Serveur inaccessible', { // TODO translate
          clickToClose: false,
          timeOut: 0
        })
      );
    }
  }

}
