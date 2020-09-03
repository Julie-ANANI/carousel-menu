import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { first, takeUntil } from 'rxjs/operators';
import { SocketService } from '../../../../../services/socket/socket.service';
import { RolesFrontService } from "../../../../../services/roles/roles-front.service";
import { isPlatformBrowser } from '@angular/common';
import { Mission } from '../../../../../models/mission';
import { MissionFrontService } from '../../../../../services/mission/mission-front.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

interface Tab {
  route: string;
  name: string;
  key: string;
}

@Component({
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.scss']
})

export class AdminProjectComponent implements OnInit, OnDestroy {

  private _project: Innovation = <Innovation>{};

  private _updatedProject: Innovation | null = null;

  private _childComponents = new Set();

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
    {key: 'settings', name: 'Settings', route: 'settings'},
    {key: 'preparation', name: 'Preparation', route: 'preparation'},
    {key: 'collection', name: 'Collection', route: 'collection'},
    {key: 'analysis', name: 'Analysis', route: 'analysis'},
    {key: 'followUp', name: 'Follow up', route: 'follow-up'}
  ];

  private _isLoading = false;

  private _activatedTab = '';

  private _currentLang = this._translateService.currentLang || 'en';

  private _showBanner = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _status: Array<string> = ['SUBMITTED', 'REJECTED', 'VALIDATED', 'REJECTED_GMAIL',
    'VALIDATED_UMIBOT', 'REJECTED_UMIBOT'];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _router: Router,
              private _translateTitleService: TranslateTitleService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _rolesFrontService: RolesFrontService,
              private _socketService: SocketService) {

    this._initPageTitle();
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      if (this._activatedRoute.snapshot.data['innovation']
        && typeof this._activatedRoute.snapshot.data['innovation'] !== undefined) {
        this._project = this._activatedRoute.snapshot.data['innovation'];
        this._isLoading = false;
        this.setPageTitle();

        this._socketService.getProjectUpdates(this._project._id)
          .pipe(takeUntil(this._ngUnsubscribe))
          .subscribe((project: Innovation) => {
            this._updatedProject = project;
            this._showBanner = !!this._updatedProject;
            }, (error) => {
            console.error(error);
          });

      } else {
        this._isLoading = false;
        this._fetchingError = true
      }
    }
  }

  private _initPageTitle() {
    const _url = this._router.routerState.snapshot.url.split('/');
    if (_url.length === 7) {
      const _params = _url[6].indexOf('?');
      this._activatedTab = _params > 0 ? _url[6].substring(0, _params) : _url[6];
      this.setPageTitle();
    } else {
      this.setPageTitle();
    }
  }

  public setPageTitle() {
    if (this._activatedTab && this._project.name) {
      this._translateTitleService.setTitle(this._activatedTab.slice(0,1).toUpperCase()
        + this._activatedTab.slice(1) + ' | ' + this._project.name);
    } else if (this._activatedTab) {
      this._translateTitleService.setTitle(this._activatedTab.slice(0,1).toUpperCase()
        + this._activatedTab.slice(1) + ' | Project');
    } else {
      this._translateTitleService.setTitle('COMMON.PAGE_TITLE.PROJECT');
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

  public updateProject() {
    this._project = this._updatedProject;
    this._childComponents.forEach(childComponent => {
      if (childComponent._updateProject) {
        childComponent._updateProject(this._project);
      }
    });
    this._updatedProject = null;
  }

  public onActivate(childComponent: any) {
    this._childComponents.add(childComponent);
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

  public onClickImportFollowUp(event: Event) {
    event.preventDefault();
    this._innovationService.updateFollowUpEmails(this._project._id).pipe(first()).subscribe((result: Innovation) => {
      this._project.followUpEmails = result.followUpEmails;
      this._translateNotificationsService.success('Success', 'The e-mails have been imported into the project.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
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

  public onClickExport(event: Event) {
    event.preventDefault();

    if (this._isProjectModal) {
      this._exportProject();
    }

  }

  get title(): string {
    const _innovTitle = InnovationFrontService.currentLangInnovationCard(this._project,
      this._currentLang, 'TITLE');
    return  _innovTitle ? _innovTitle : this._project.name;
  }

  get mission(): Mission {
    return this._project.mission && (<Mission>this._project.mission)._id ? <Mission>this._project.mission : <Mission>{};
  }

  get iconClass(): string {
    return MissionFrontService.objectiveInfo(<Mission>this.mission, 'FONT_AWESOME_ICON');
  }

  get isTech(): boolean {
    return this._rolesFrontService.isTechRole();
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

  set activatedTab(value: string) {
    this._activatedTab = value;
  }

  get showBanner(): boolean {
    return this._showBanner;
  }

  set showBanner(value: boolean) {
    this._showBanner = value;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get status(): Array<string> {
    return this._status;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
