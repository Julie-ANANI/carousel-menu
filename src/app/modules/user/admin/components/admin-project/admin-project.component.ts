import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { Innovation } from '../../../../../models/innovation';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../services/auth/auth.service';
import { FrontendService } from '../../../../../services/frontend/frontend.service';
import { TranslateService } from '@ngx-translate/core';
import { InnovationFrontService } from '../../../../../services/innovation/innovation-front.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { first } from 'rxjs/operators';
import {SocketService} from '../../../../../services/socket/socket.service';

@Component({
  selector: 'app-admin-project',
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.scss']
})

export class AdminProjectComponent implements OnInit {

  private _project: Innovation;

  private _updatedProject: Innovation | null = null;

  private _childComponents = new Set();

  private _fetchingError: boolean;

  private _innovationTitle: string;

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

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _translateTitleService: TranslateTitleService,
              private _innovationService: InnovationService,
              private _authService: AuthService,
              private _frontendService: FrontendService,
              private _socketService: SocketService) {

    this._setPageTitle('COMMON.PAGE_TITLE.PROJECT');

  }

  ngOnInit() {

    if (this._activatedRoute.snapshot.data['innovation'] && typeof this._activatedRoute.snapshot.data['innovation'] !== undefined) {
      this._project = this._activatedRoute.snapshot.data['innovation'];
      this._innovationTitle = InnovationFrontService.currentLangInnovationCard(this._project, this._translateService.currentLang, 'TITLE');
      this._setPageTitle(this.title );
      this._metadata();

      try {
        this._socketService
          .getProjectUpdates(this._project._id)
          .subscribe((project: Innovation) => {
            this._updatedProject = project;
          });
      } catch (e) {
        console.log(e);
      }
    } else {
      this._fetchingError = true;
    }

  }

  refresh(): void {
    window.location.reload();
  }

  updateProject() {
    this._project = this._updatedProject;
    this._childComponents.forEach(childComponent => {
      if (childComponent._updateProject) {
        childComponent._updateProject(this._project);
      }
    });
    this._updatedProject = null;
  }

  onActivate(childComponent: any) {
    this._childComponents.add(childComponent);
  }

  private _setPageTitle(value: string) {
    if (value) {
      this._translateTitleService.setTitle(value);
    }
  }

  get authorizedTabs(): Array<string> {
    const adminLevel = this._authService.adminLevel;

    if (adminLevel > 1) {
      return ['settings', 'answer_tags', 'questionnaire', 'campaigns', 'synthesis', 'storyboard', 'follow-up' ];
    } else {
      return ['cards', 'campaigns', 'synthesis'];
    }

  }

  private _resetModals() {
    this._isProjectModal = false;
  }

  public openModal(event: Event, modalToActive: string) {
    event.preventDefault();
    this._resetModals();
    this._showModal = true;

    switch (modalToActive) {

      case 'project':
        this._isProjectModal = true;
        break;

    }

  }

  public onClickImportFollowUp(event: Event) {
    event.preventDefault();
    this._innovationService.updateFollowUpEmails(this._project._id).pipe(first()).subscribe((result: Innovation) => {
      this._project.followUpEmails = result.followUpEmails;
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

  // todo remove.
  private _metadata() {
    this._frontendService.calculateInnovationMetadataPercentages(this._project, 'preparation');
    this._frontendService.calculateInnovationMetadataPercentages(this._project, 'campaign');
    this._frontendService.calculateInnovationMetadataPercentages(this._project, 'delivery');
  }

  // todo remove.
  getColor(length: number) {
    if (length < 34 && length >= 0) {
      return '#EA5858';
    } else if (length >= 34 && length < 67) {
      return '#f0ad4e';
    } else {
      return '#2ECC71';
    }
  }

  get title(): string {
    return  this._innovationTitle ? this._innovationTitle : this._project.name;
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get updatedProject(): Innovation | null {
    return this._updatedProject;
  }

  get innovationTitle(): string {
    return this._innovationTitle;
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

}
