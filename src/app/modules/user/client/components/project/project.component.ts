import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { TranslateService } from '@ngx-translate/core';
import { first, takeUntil } from 'rxjs/operators';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { Subject } from 'rxjs';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { SpinnerService } from '../../../../../services/spinner/spinner.service';
import { isPlatformBrowser } from '@angular/common';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { Mission } from '../../../../../models/mission';
import { MissionFrontService } from '../../../../../services/mission/mission-front.service';

interface Tab {
  route: string;
  iconClass: string;
  name: string;
  tracking: string;
}

@Component({
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _mission: Mission = <Mission>{};

  private _currentLang = this._translateService.currentLang || 'en';

  private _dateFormat = this._currentLang === 'fr' ? 'dd-MM-y' : 'y-MM-dd';

  private _tabs: Array<Tab> = [
    { route: 'settings', iconClass: 'fas fa-cog', name: 'SETTINGS_TAB', tracking: 'gtm-tabs-settings' },
    { route: 'setup', iconClass: 'fas fa-pencil-alt', name: 'SETUP_TAB', tracking: 'gtm-tabs-description' },
    { route: 'exploration', iconClass: 'fas fa-globe', name: 'EXPLORATION_TAB', tracking: 'gtm-tabs-exploration' },
    { route: 'synthesis', iconClass: 'fas fa-signal', name: 'SYNTHESIS_TAB', tracking: 'gtm-tabs-synthesis' },
    { route: 'documents', iconClass: 'fas fa-file-download', name: 'DOCUMENTS_TAB', tracking: 'gtm-tabs-documents' }
  ];

  private _isLoading = true;

  private _currentPage = '';

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _translateTitleService: TranslateTitleService,
              private _innovationService: InnovationService,
              private _router: Router,
              private _spinnerService: SpinnerService,
              private _translateService: TranslateService,
              private _innovationFrontService: InnovationFrontService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._initPageTitle();

    this._activatedRoute.params.subscribe((params) => {
      if (params['projectId']) {
        this._setSpinner(true);
        this._getInnovation(params['projectId']);
      }
    });

  }

  ngOnInit() {
    this._initCurrentTab();

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
      if (<Mission>this._innovation.mission && (<Mission>this._innovation.mission)._id) {
        this._mission = <Mission>this._innovation.mission;
      } else {
        this._mission = <Mission>{};
      }
    });

  }

  /***
   * this is to start/stop the full page spinner.
   * @param value
   * @private
   */
  private _setSpinner(value: boolean) {
    this._spinnerService.state(value);
  }

  /***
   * initialize the title of the page.
   * @private
   */
  private _initPageTitle() {
    if (this._innovation && this._innovation.name) {
      this._translateTitleService.setTitle(this._innovation.name + ' | '
        + (this._currentPage.slice(0,1).toUpperCase() + this._currentPage.slice(1)));
    } else {
      this._translateTitleService.setTitle('COMMON.PAGE_TITLE.PROJECT');
    }
  }

  /***
   * we are getting the innovation from the api.
   * @param projectId
   * @private
   */
  private _getInnovation(projectId: string) {
    if (isPlatformBrowser(this._platformId)) {
      this._innovationService.get(projectId).pipe(first()).subscribe((innovation: Innovation) => {
        this._innovationFrontService.setInnovation(innovation);
        this._innovation = innovation;
        this._initPageTitle();
        this._setSpinner(false);
        this._isLoading = false;
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this._setSpinner(false);
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      })
    }
  }

  /***
   * this is to initialize the current tab based on the url.
   * @private
   */
  private _initCurrentTab() {
    const url = this._router.routerState.snapshot.url.split('/');
    if (url.length > 4) {
      const params = url[4].indexOf('?');
      this._currentPage = params > 0 ? url[4].substring(0, params) : url[4];
    } else {
      this._currentPage = 'settings';
    }
  }

  public navigateTo(event: Event, route: string) {
    event.preventDefault();
    this._currentPage = route;
    this._initPageTitle();
    this._router.navigate([`/user/projects/${this._innovation._id}/${route}`]);
  }

  get iconClass(): string {
    return MissionFrontService.objectiveInfo(<Mission>this._mission, 'FONT_AWESOME_ICON');
  }

  get mission(): Mission {
    return this._mission;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get dateFormat(): string {
    return this._dateFormat;
  }

  get tabs(): Array<Tab> {
    return this._tabs;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get currentPage(): string {
    return this._currentPage;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

