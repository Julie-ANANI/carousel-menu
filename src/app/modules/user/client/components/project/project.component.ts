import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { TranslateService } from '@ngx-translate/core';
import { first, takeUntil } from 'rxjs/operators';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Mission } from '../../../../../models/mission';
import { MissionFrontService } from '../../../../../services/mission/mission-front.service';
import { SocketService } from '../../../../../services/socket/socket.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import {RouteFrontService} from '../../../../../services/route/route-front.service';
import {CommonService} from '../../../../../services/common/common.service';
import { TranslateNotificationsService } from "../../../../../services/translate-notifications/translate-notifications.service";
import { ErrorFrontService } from "../../../../../services/error/error-front.service";

interface Tab {
  route: string;
  iconClass?: string;
  name: string;
  tracking: string;
}

@Component({
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit, OnDestroy {

  get iconClass(): string {
    return this._iconClass;
  }

  get objectiveName(): string {
    return this._objectiveName;
  }

  private _innovation: Innovation = <Innovation>{};

  private _mission: Mission = <Mission>{};

  private _showBanner = '';

  private _tabs: Array<Tab> = [
    { route: 'settings', iconClass: 'fas fa-cog', name: 'SETTINGS_TAB', tracking: 'gtm-tabs-settings' },
    { route: 'setup', name: 'SETUP_TAB', tracking: 'gtm-tabs-description' },
    { route: 'exploration', name: 'EXPLORATION_TAB', tracking: 'gtm-tabs-exploration' },
    { route: 'synthesis', name: 'SYNTHESIS_TAB', tracking: 'gtm-tabs-synthesis' },
    { route: 'documents', iconClass: 'fas fa-file-alt', name: 'DOCUMENTS_TAB', tracking: 'gtm-tabs-documents' }
  ];

  private _currentPage = '';

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _fetchingError = false;

  private _updateTime: number;

  private _socketListening = false;

  private _openModal = false;

  private _objectiveName = '';

  private _iconClass = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _routeFrontService: RouteFrontService,
              private _commonService: CommonService,
              private _translateTitleService: TranslateTitleService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _router: Router,
              private _translateService: TranslateService,
              private _socketService: SocketService,
              private _authService: AuthService,
              private _innovationFrontService: InnovationFrontService) {
  }

  ngOnInit() {
    this._initPageTitle();

    this._activatedRoute.params.subscribe((params) => {
      if (params['projectId']) {
        this._getInnovation(params['projectId']);
      }
    });

    this._initCurrentTab();

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation || <Innovation>{};
      this._verifyFollowUp();
      this._mission = <Mission>this._innovation.mission || <Mission>{};
      this._initValues();
      this._socket();
    });
  }

  /***
   * Listen to the updates only the first time we retrieve the innovation
   * @private
   */
  private _socket() {
    if (!this._socketListening && this._innovation._id) {
      this._socketService.getMissionUpdates(this._mission._id).pipe(takeUntil(this._ngUnsubscribe)).subscribe((update: any) => {
        this._realTimeUpdate('mission', update);
        }, (error) => {
        console.error(error);
      });

      this._socketService.getProjectUpdates(this._innovation._id)
        .pipe(takeUntil(this._ngUnsubscribe)).subscribe((update: any) => {
          this._realTimeUpdate('project', update);
          }, (error) => {
          console.error(error);
        });

      this._socketListening = true;
    }
  }

  private _verifyFollowUp() {
    if (!!this._innovation.followUpEmails && !!this._innovation.followUpEmails.status) {
      const status = this._innovation.followUpEmails.status;
      const index = this._tabs.findIndex((_tab) => _tab.name === 'CONTACT_TAB');
      if (status === 'INACTIVE') {
        if (index !== -1) {
          this._tabs.splice(index, 1);
        }
      } else {
        if (index === -1) {
          this._tabs.splice(3, 0,
            { route: 'contact', name: 'CONTACT_TAB', tracking: 'gtm-tabs-contact' },
          );
        }
      }
    }
  }

  private _realTimeUpdate(object: string, update: any) {
    if (update.userId !== this._authService.userId) {
      this._showBanner = update.userName;
      this._updateTime = Date.now();
    }
    Object.keys(update.data).forEach((field: string) => {
      if (object === 'project') {
        this._innovation[field] = update.data[field];
      } else {
        this._mission[field] = update.data[field];
      }
    });
    this._innovationFrontService.setInnovation(this._innovation);
  }

  /***
   * initialize the title of the page.
   * @private
   */
  private _initPageTitle() {
    if (this._innovation && this._innovation.name) {
      this._translateTitleService.setTitle(this._innovation.name + ' | '
        + (this._currentPage.slice(0, 1).toUpperCase() + this._currentPage.slice(1)));
    } else {
      this._translateTitleService.setTitle('COMMON.PAGE_TITLE.PROJECT');
    }
  }

  /**
   * will initialize the variables here.
   * @private
   */
  private _initValues() {
    this._objectiveName = MissionFrontService.objectiveName(this._mission.template, this.currentLang);

    if (!MissionFrontService.hasMissionTemplate(this._mission.template)) {
      this._iconClass = MissionFrontService.objectiveInfo(<Mission>this._mission, 'FONT_AWESOME_ICON');
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
        this._initPageTitle();
        if (!this._authService.user) {
          this._authService.initializeSession().pipe(first()).subscribe(() => {
          });
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this._fetchingError = true;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      });
    }
  }

  /***
   * this is to initialize the current tab based on the url.
   * @private
   */
  private _initCurrentTab() {
    this._currentPage = this._routeFrontService.activeTab(5, 4, true) || 'settings';
  }

  public showModal(event: Event) {
    event.preventDefault();
    this._openModal = true;
  }

  public navigateTo(event: Event, route: string) {
    event.preventDefault();
    this._currentPage = route;
    this._initPageTitle();
    this._router.navigate([`/user/projects/${this._innovation._id}/${route}`]);
  }

  get mission(): Mission {
    return this._mission;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get dateFormat(): string {
    return this._commonService.dateFormat();
  }

  get tabs(): Array<Tab> {
    return this._tabs;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get showBanner(): string {
    return this._showBanner;
  }

  set showBanner(value: string) {
    this._showBanner = value;
  }

  get updateTime(): number {
    return this._updateTime;
  }

  get openModal(): boolean {
    return this._openModal;
  }

  set openModal(value: boolean) {
    this._openModal = value;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}

