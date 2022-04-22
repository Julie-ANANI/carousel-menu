import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { first, takeUntil } from 'rxjs/operators';
import { SocketService } from '../../../../../services/socket/socket.service';
import { RolesFrontService } from '../../../../../services/roles/roles-front.service';
import { isPlatformBrowser } from '@angular/common';
import { Mission } from '../../../../../models/mission';
import { MissionFrontService } from '../../../../../services/mission/mission-front.service';
import { TranslateNotificationsService } from '../../../../../services/translate-notifications/translate-notifications.service';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { CampaignFrontService } from '../../../../../services/campaign/campaign-front.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { CommonService } from '../../../../../services/common/common.service';
import { Response } from '../../../../../models/response';
import { Campaign } from '../../../../../models/campaign';
import { analysisSubTubs, preparationSubTabs } from '../../../../../models/static-data/subtabs';

interface Tab {
  route: string;
  name: string;
  key: string;
  icon: string;
  subTabs?: Array<any>;
}

@Component({
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.scss']
})

export class AdminProjectComponent implements OnInit, OnDestroy {

  get hasMissionObjective(): boolean {
    return this._hasMissionObjective;
  }

  get hasMissionTemplate(): boolean {
    return this._hasMissionTemplate;
  }

  get objectiveName(): string {
    return this._objectiveName;
  }

  get mission(): Mission {
    return this._mission;
  }

  get timeout(): any {
    return this._timeout;
  }

  private _project: Innovation = <Innovation>{};

  private _fetchingError = false;

  private _showModal = false;

  private _isProjectModal = false;

  private _projectExportConfig: any = {
    answers: {
      SUBMITTED: false,
      REJECTED: false,
      VALIDATED: true,
      REJECTED_GMAIL: false,
      VALIDATED_UMIBOT: false,
      REJECTED_UMIBOT: false,
    },
    campaigns: false,
    anonymous: true
  };

  private _tabs: Array<Tab> = [
    {key: 'settings', name: 'Settings', route: 'settings', icon: 'fas fa-cog'},
    {
      key: 'preparation', name: 'Preparation', route: 'preparation', icon: 'fas fa-pencil-alt',
      subTabs: []
    },
    {key: 'collection', name: 'Collection', route: 'collection', icon: 'fas fa-file-archive'},
    {
      key: 'analysis', name: 'Analysis', route: 'analysis', icon: 'fas fa-chart-area',
      subTabs: []
    },
    {key: 'followUp', name: 'Follow up', route: 'follow-up', icon: 'fas fa-mail-bulk'}
  ];

  private _isLoading = true;

  private _activatedTab = '';

  private _currentLang = this._translateService.currentLang;

  private _showBanner = '';

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _status: Array<string> = ['SUBMITTED', 'REJECTED', 'VALIDATED', 'REJECTED_GMAIL',
    'VALIDATED_UMIBOT', 'REJECTED_UMIBOT'];

  private _updateTime: number;

  private _innovTitle = '';

  private _quizLink = '';

  private _allCampaigns: Array<Campaign> = [];

  private _timeout: any = null;

  private _mission: Mission = <Mission>{};

  private _objectiveName = '';

  private _hasMissionTemplate = false;

  private _hasMissionObjective = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _router: Router,
              private _translateTitleService: TranslateTitleService,
              private _innovationService: InnovationService,
              private _campaignFrontService: CampaignFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService,
              private _rolesFrontService: RolesFrontService,
              private _authService: AuthService,
              private _commonService: CommonService,
              private _socketService: SocketService) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._project = this._activatedRoute.snapshot.data['innovation'];
      this._initPageTitle();
      this._emitUpdatedInnovation();
      this._initSubTabs();

      if (this._project && this._project._id) {
        this._initVariables();
        this._verifyFollowUpTab();
        this._getAllCampaigns();
        this._quizLink = InnovationFrontService.quizLink(this._project);
        this._isLoading = false;

        this._socketService.getProjectUpdates(this._project._id).pipe(takeUntil(this._ngUnsubscribe)).subscribe((update: any) => {
          this._realTimeUpdate('project', update);
          }, (error) => {
          console.error(error);
        });

        if (this._project.mission && typeof this._project.mission !== 'string' && this._project.mission._id) {
          this._socketService.getMissionUpdates(this._project.mission._id)
            .pipe(takeUntil(this._ngUnsubscribe))
            .subscribe((update: any) => {
              this._realTimeUpdate('mission', update);
            }, (error) => {
              console.error(error);
            });
        }
      } else {
        this._isLoading = false;
        this._fetchingError = true;
      }
    }
  }

  private _initVariables() {
    this._setInnoTitle();
    this._mission = <Mission>this._project.mission;
    this._hasMissionTemplate = MissionFrontService.hasMissionTemplate(this._mission);
    this._objectiveName = MissionFrontService.objectiveName(this._mission.template, this._currentLang);
    this._hasMissionObjective = this._mission.objective && this._mission.objective.principal && this._mission.objective.principal['en']
      && this._mission.objective.principal['en'] !== 'Other';
  }

  /**
   * for the new projects we hide the Follow-Up tab.
   * @private
   */
  private _verifyFollowUpTab() {
    if (!!this._project.followUpEmails && !!this._project.followUpEmails.status) {
      const index = this._tabs.findIndex((_tab) => _tab.key === 'followUp');
      if (index !== -1) {
        this._tabs.splice(index, 1);
      }
    }
  }

  private _initSubTabs() {
    if (this.canAccess(['tabs', 'preparation'])) {
      preparationSubTabs.map(sub => {
        if (this.canAccess(sub.access)) {
          this._tabs[1].subTabs.push(sub);
        }
      });
    }
    if (this.canAccess(['tabs', 'analysis'])) {
      analysisSubTubs.map(sub => {
        if (this.canAccess(sub.access)) {
          this._tabs[3].subTabs.push(sub);
        }
      });
    }
  }

  private _realTimeUpdate(object: string, update: any) {
    let isUpdated = false;

    if (update.userId !== this._authService.userId) {
      this._showBanner = update.userName;
      this._updateTime = Date.now();
    }

    Object.keys(update.data).forEach((field: string) => {
      /**
       * here we are checking the field because when we update the innovation some time we update the other object to
       * in the back so to have the proper updated object here we check the field and try to have field name different
       * from the object field name.
       */
      if (field === 'missionTemplate') {
        isUpdated = true;
        this._project.mission['template'] = update.data[field];
      }

      if (object === 'project') {
        isUpdated = true;
        if (!!update.data['missionResult']) {
          this._project.mission['result'] = update.data['missionResult'];
        } else {
          this._project[field] = update.data[field];
        }
      }

      if (object === 'mission') {
        isUpdated = true;
        this._project.mission[field] = update.data[field];
      }
    });

    if (isUpdated) {
      this._setInnoTitle();
      this._emitUpdatedInnovation();
      this._initVariables();
    }
  }

  private _initPageTitle() {
    const _url = this._router.routerState.snapshot.url.split('/');
    if (!!_url && _url.length && _url.length === 7) {
      const _params = _url[6].indexOf('?');
      this._activatedTab = _params > 0 ? _url[6].substring(0, _params) : _url[6];
      this._setPageTitle();
    } else {
      this._setPageTitle();
    }
  }

  private _setPageTitle() {
    if (this._activatedTab && this._project.name) {
      this._translateTitleService.setTitle(this._activatedTab.slice(0, 1).toUpperCase() + this._activatedTab.slice(1)
        + ' | ' + this._project.name);
    } else {
      this._translateTitleService.setTitle('Project');
    }
  }

  public onClickTab(event: Event, tab: string, route: string, key: string) {
    event.preventDefault();
    this._activatedTab = tab;
    this._campaignFrontService.setShowCampaignTabs(false);
    this._setPageTitle();
    this._router.navigate([`/user/admin/projects/project/${this._project._id}/${this._navigateRoute(route, key)}`]);
  }

  private _navigateRoute(route: string, key: string): string {
    if (key === 'settings' || key === 'collection' || key === 'followUp') {
      return route;
    } else if (key === 'preparation') {
      return this._rolesFrontService.projectPreparationDefRoute();
    } else if (key === 'analysis') {
      return this._rolesFrontService.projectAnalysisDefRoute();
    }
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = ['projects', 'project'];
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(_default);
    }
  }

  private _emitUpdatedInnovation() {
    this._innovationFrontService.setInnovation(JSON.parse(JSON.stringify(this._project)));
  }

  private _resetModals() {
    this._isProjectModal = false;
  }

  public openModal(event: Event, modalToActive: string) {
    event.preventDefault();
    this._resetModals();
    this._showModal = true;

    switch (modalToActive) {

      case 'PROJECT':
        this._isProjectModal = true;
        break;

    }

  }

  /**
   *
   * @private
   */
  private _getAllCampaigns() {
    this._innovationService.campaigns(this._project._id).pipe(first()).subscribe((response: Response) => {
      this._allCampaigns = response && response.result || [];
      this._allCampaigns = CommonService.sortByCompare(this._allCampaigns, 'title');
      this._campaignFrontService.setAllCampaigns(this._allCampaigns);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Campaigns Fetching Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  public onClickImportFollowUp(event: Event) {
    event.preventDefault();
    this._innovationService.updateFollowUpEmails(this._project._id).pipe(first()).subscribe((result: Innovation) => {
      this._translateNotificationsService.success('Success', 'The e-mails have been imported into the project.');
      this._project.followUpEmails = result.followUpEmails;
      this._emitUpdatedInnovation();
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Follow-up Updating Error...', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  public closeModal() {
    this._showModal = false;
  }

  private _exportProject() {
    const params: Array<string> = [];

    for (const key of Object.keys(this._projectExportConfig)) {
      if (key === 'answers') {
        const statusesToExport: Array<string> = [];

        for (const _key of Object.keys(this._projectExportConfig.answers)) {
          if (this._projectExportConfig.answers[_key]) {
            statusesToExport.push(_key);
          }
        }

        if (statusesToExport.length) {
          params.push('answers=' + statusesToExport.join(','));
        }

      } else {
        if (this._projectExportConfig[key]) {
          params.push(key + '=true');
        }
      }
    }

    const urlParams = params.join('&');
    window.open(InnovationService.export(this._project._id, urlParams));
    this.closeModal();
  }

  openQuiz($event: Event) {
    $event.preventDefault();
    if (this._quizLink) {
      window.open(this._quizLink, '_blank');
    }
  }

  public onCopyQuizLink(event: Event) {
    event.preventDefault();
    if (this._quizLink) {
      this._commonService.copyToClipboard(this._quizLink);
      this._translateNotificationsService.success('Success',
        'Copy quiz link succeed!');
    }
  }

  public onClickExport(event: Event) {
    event.preventDefault();

    if (this._isProjectModal) {
      this._exportProject();
    }

  }

  private _setInnoTitle() {
    this._innovTitle = InnovationFrontService.currentLangInnovationCard(this._project, this._currentLang, 'TITLE');
  }

  public setPageTitle(isCampaignTabs: boolean, path: string) {
    if (isCampaignTabs) {
      this._translateTitleService.setTitle(`${path.toUpperCase()}
      | Campaign | Campaigns | Preparation | ${this._project.name}`);
    } else {
      this._translateTitleService.setTitle(`${path.toUpperCase()}
      | Preparation | ${this._project.name}`);
    }
  }

  navigateTo(event: Event, tab: Tab, item: any) {
    event.preventDefault();
    if (item.parent === 'analyse') {
      this.navigateToAnalyseSubTabs(item.path);
    } else {
      this.navigateToPreparationSubTabs(item.path);
    }
  }

  navigateToAnalyseSubTabs(paths: string) {
    this._translateTitleService.setTitle(`${paths.toUpperCase()}
      | Analysis | ${this._project.name}`);
    setTimeout(() => {
      this._router.navigate([`/user/admin/projects/project/${
        this._project._id
      }/analysis/${paths}`]);
    }, 0);
  }

  navigateToPreparationSubTabs(paths: string) {
    let route = '';
    if (paths.indexOf('/') !== -1) {
      const path = paths.split('/');
      this._campaignFrontService.setActiveCampaignTab(path[path.length - 1]);
      this._campaignFrontService.setShowCampaignTabs(true);
      this._campaignFrontService.defaultCampaign = this._allCampaigns[0];
      this._campaignFrontService.setAllCampaigns(this._allCampaigns);
      this.setPageTitle(true, path[path.length - 1]);
      route = `/user/admin/projects/project/${
        this._project._id
      }/preparation/campaigns/campaign/${this._allCampaigns[0]._id}/${path[path.length - 1]}`;
    } else {
      this.setPageTitle(false, paths);
      route = `/user/admin/projects/project/${
        this._project._id
      }/preparation/${paths}`;
    }
    this._timeout = setTimeout(() => {
      this._router.navigate([route]);
    }, 0);
  }

  get iconClass(): string {
    return MissionFrontService.objectiveInfo(<Mission>this._mission, 'FONT_AWESOME_ICON');
  }

  get canImport(): boolean {
    return this._rolesFrontService.isCommunityRole() || this.isTech || this.isOperSupervisor;
  }

  get isTech(): boolean {
    return this._rolesFrontService.isTechRole();
  }

  get isOperSupervisor(): boolean {
    return this._rolesFrontService.isOperSupervisorRole();
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get project(): Innovation {
    return this._project;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get isProjectModal(): boolean {
    return this._isProjectModal;
  }

  get projectExportConfig(): any {
    return this._projectExportConfig;
  }

  get tabs(): Array<Tab> {
    return this._tabs;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get showBanner(): string {
    return this._showBanner;
  }

  set showBanner(value: string) {
    this._showBanner = value;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get status(): Array<string> {
    return this._status;
  }

  get innovTitle(): string {
    return this._innovTitle;
  }

  get updateTime(): number {
    return this._updateTime;
  }

  get quizLink(): string {
    return this._quizLink;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();

    if (!!this._timeout) {
      clearTimeout(this._timeout);
    }
  }

}
