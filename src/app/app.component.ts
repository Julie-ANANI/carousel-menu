import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/pairwise';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: '<simple-notifications [options]="notificationsOptions" class="hide-on-small-and-down"></simple-notifications>' +
  '<app-http-loader></app-http-loader>' +
  '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit, AfterViewChecked {

  private _scrollExecuted = false;

  public notificationsOptions = {
    position: ['top', 'right'],
    timeOut: 5000,
    lastOnBottom: false,
    maxStack: 4,
    theClass: 'notification'
  };

  constructor(private _translateService: TranslateService,
              private _activatedRoute: ActivatedRoute,
              private _authService: AuthService,
              private _notificationsService: NotificationsService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);

    if (this._authService.isAcceptingCookies) { // CNIL
      this._authService.initializeSession().subscribe(
        res => null,
        error => this._notificationsService.error('Error', 'Cannot reach server', { // TODO translate
          clickToClose: false,
          timeOut: 0
        })
      );
    }
  }

  ngAfterViewChecked(): void {
    // FIXME, voir pour une autre solution, car s'exécute à chaque modification de composant.
    if (!this._scrollExecuted) {
      let routeFragmentSubscription: Subscription;
      // Automatic scroll to anchor if exists in URL (ex : umi.us/<some_path>#targeting) -> scroll to id="targeting"
      routeFragmentSubscription = this._activatedRoute.fragment.subscribe(fragment => {
        if (fragment) {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({behavior: 'smooth'}); // Smooth only for Firefox
            this._scrollExecuted = true;

            // Free resources after 1s
            setTimeout(_ => routeFragmentSubscription.unsubscribe(), 1000);
          }
        }
      });
    }
  }
}
