import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { NotificationsService } from 'angular2-notifications';
import { LoaderService } from './services/loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/pairwise';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: '<simple-notifications [options]="notificationsOptions" class="hide-on-small-and-down"></simple-notifications>' +
  '<progress class="progress" max="100" *ngIf="displayLoader"></progress>' +
  '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {

  private _scrollExecuted = false;
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
              private _activatedRoute: ActivatedRoute,
              private _authService: AuthService,
              private _loaderService: LoaderService,
              private _notificationsService: NotificationsService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);

    this._appIsLoadingSubscription = this._loaderService.isLoading$.subscribe((isLoading: boolean) => {
      // Bug corrigé avec setTimeout : https://stackoverflow.com/questions/38930183/angular2-expression-has-changed-after-it-was-checked-binding-to-div-width-wi
      setTimeout(_ => { this.displayLoader = isLoading; });
    });

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

  ngOnDestroy() {
    this._appIsLoadingSubscription.unsubscribe();
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
