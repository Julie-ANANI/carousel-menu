import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {LoaderService} from '../../services/loader/loader.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {RouteFrontService} from '../../services/route/route-front.service';

@Component({
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit, OnDestroy {

  get displayLoader(): boolean {
    return this._displayLoader;
  }

  get adminSide(): boolean {
    return this._adminSide;
  }

  private _displayLoader = true;

  private _adminSide = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _clearTimeout: any;

  private static _toggleVisibilityHelp(value: string) {
    document.getElementById('jsd-widget').style.visibility = value;
  }

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _routeFrontService: RouteFrontService,
              private _loaderService: LoaderService,
              private _router: Router) {
  }

  ngOnInit() {
    this._initRoutes();

    if (isPlatformBrowser(this._platformId)) {

      this._routeFrontService.isAdminSide().pipe(takeUntil(this._ngUnsubscribe)).subscribe((value) => {
        this._adminSide = value;
        this._initHelpDesk();
      });

      this._loaderService.isLoading$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((loading: boolean) => {
        this._clearTimeout = setTimeout(() => {
          this._displayLoader = loading;
        });
      });
    }
  }

  private _initRoutes() {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this._displayLoader = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this._displayLoader = false;
      }
    });
  }

  /***
   * this is hack and I don't like this .
   * ToDo find a better solution execute script dynamically.
   * @private
   */
  private _initHelpDesk() {
    if (isPlatformBrowser(this._platformId) && environment.production) {
      if (this._adminSide) {
        UserComponent._toggleVisibilityHelp('visible');
      } else {
        UserComponent._toggleVisibilityHelp('hidden');
      }
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
    clearTimeout(this._clearTimeout);
  }

}
