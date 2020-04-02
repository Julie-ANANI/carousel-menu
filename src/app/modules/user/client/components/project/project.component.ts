import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { TranslateService } from '@ngx-translate/core';
import { first, takeUntil } from 'rxjs/operators';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { Subject } from 'rxjs';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { SpinnerService } from '../../../../../services/spinner/spinner';
import { isPlatformBrowser } from '@angular/common';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../services/error/error-front';
import { ClientProject } from '../../../../../models/client-project';
import { Mission } from '../../../../../models/mission';
import { ClientProjectFrontService } from '../../../../../services/client-project/client-project-front.service';
import { MissionFrontService } from '../../../../../services/mission/mission-front.service';

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _clientProject: ClientProject = <ClientProject>{};

  private _mission: Mission = <Mission>{};

  private _currentLang = this._translateService.currentLang;

  private _dateFormat = this._currentLang === 'fr' ? 'dd-MM-y' : 'y-MM-dd';

  private _tabs: Array<{route: string, iconClass: string, name: string, tracking: string}> = [
    { route: 'settings', iconClass: 'fas fa-cog', name: 'SETTINGS_TAB', tracking: 'gtm-tabs-settings' },
    { route: 'setup', iconClass: 'fas fa-pencil-alt', name: 'SETUP_TAB', tracking: 'gtm-tabs-description' },
    { route: 'exploration', iconClass: 'fas fa-globe', name: 'EXPLORATION_TAB', tracking: 'gtm-tabs-exploration' },
    { route: 'synthesis', iconClass: 'fas fa-signal', name: 'SYNTHESIS_TAB', tracking: 'gtm-tabs-synthesis' }
  ];

  private _isLoading = true;

  private _currentPage: string;

  private _saveChanges = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _translateTitleService: TranslateTitleService,
              private _innovationService: InnovationService,
              private _router: Router,
              private _spinnerService: SpinnerService,
              private _clientProjectFrontService: ClientProjectFrontService,
              private _missionFrontService: MissionFrontService,
              private _translateService: TranslateService,
              private _innovationFrontService: InnovationFrontService,
              private _translateNotificationsService: TranslateNotificationsService) {

    this._setSpinner(true);
    this._initPageTitle();
  }

  ngOnInit() {

    this._initCurrentTab();

    this._activatedRoute.params.subscribe((params) => {
      if (params['projectId']) {
        this._getInnovation(params['projectId']);
      }
    });

    this._innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._saveChanges = !!response;
    });

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
    });

    this._clientProjectFrontService.clientProject().pipe(takeUntil(this._ngUnsubscribe)).subscribe((clientProject) => {
      this._clientProject = clientProject;
    });

    this._missionFrontService.mission().pipe(takeUntil(this._ngUnsubscribe)).subscribe((mission) => {
      this._mission = mission;
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
   * @param title
   * @private
   */
  private _initPageTitle(title = 'COMMON.PAGE_TITLE.PROJECT') {
    this._translateTitleService.setTitle(title);
  }

  /***
   * we are getting the innovation from the api, and passing the clientProject and mission
   * to the respective service.
   * @param projectId
   * @private
   */
  private _getInnovation(projectId: string) {
    if (isPlatformBrowser(this._platformId)) {
      this._innovationService.get(projectId).pipe(first()).subscribe((innovation: Innovation) => {

        this._innovationFrontService.setInnovation(innovation);

        if (this._innovation.clientProject) {
          this._clientProjectFrontService.setClientProject(<ClientProject>this._innovation.clientProject);
        }

        if (this._innovation.mission) {
          this._missionFrontService.setMission(<Mission>this._innovation.mission);
        }

        this._initPageTitle(this._clientProject.name || this._innovation.name);
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

  /***
   * this function will activate the tab and user has to save all the changes
   * before going to another page.
   * @param event
   * @param route
   */
  public setCurrentTab(event: Event, route: string) {
    event.preventDefault();

    if (!this._saveChanges) {
      this._currentPage = route;
      this._router.navigate([route], {relativeTo: this._activatedRoute});
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.PROJECT.SAVE_ERROR');
    }

  }

  /***
   * this will return the icon base don the primary objective.
   * @param objective
   */
  public iconClass(objective: string): string {
    switch (objective) {

      case 'Detecting needs / trends':
        return 'fas fa-compass';

      case 'Validating market needs':
        return 'fas fa-globe';

      case 'Sourcing innovative solutions / partners':
        return 'fas fa-book-open';

      case 'Validating the interest of my solution':
        return 'fas fa-lightbulb';

      case 'Discovering new applications / markets':
        return 'fas fa-map-signs';

      case 'Targeting the most receptive application / market':
        return 'fas fa-crosshairs';

      case 'Optimizing my value proposition':
        return 'fas fa-sync-alt';

    }
  }

  get clientProject(): ClientProject {
    return this._clientProject;
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

  get tabs(): Array<{ route: string; iconClass: string; name: string; tracking: string }> {
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

