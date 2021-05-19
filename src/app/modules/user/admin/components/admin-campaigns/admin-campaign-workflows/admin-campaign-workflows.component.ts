import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Campaign } from '../../../../../../models/campaign';
import { EmailScenario } from '../../../../../../models/email-scenario';
import { EmailSignature } from '../../../../../../models/email-signature';
import { first } from 'rxjs/operators';
import { Config } from '../../../../../../models/config';
import { isPlatformBrowser } from '@angular/common';
import { Response } from '../../../../../../models/response';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../../services/error/error-front.service';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { StatsInterface } from '../../admin-stats-banner/admin-stats-banner.component';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import {AuthService} from '../../../../../../services/auth/auth.service';

@Component({
  templateUrl: './admin-campaign-workflows.component.html',
  styleUrls: ['./admin-campaign-workflows.component.scss'],
})
export class AdminCampaignWorkflowsComponent implements OnInit {
  private _campaign: Campaign = <Campaign>{};

  private _selectedTemplate: EmailScenario = <EmailScenario>{};

  private _signatures: Array<EmailSignature> = [];

  private _templates: Array<EmailScenario> = [];

  private _availableScenarios: Array<EmailScenario> = [];

  private _modifiedScenarios: Array<EmailScenario> = [];

  private _modalImport = false;

  private _modalContent = '';

  private _config: Config = {
    fields: '',
    limit: '0',
    offset: '0',
    search: '{}',
    sort: '{ "created" : -1 }',
  };

  private _isImporting = false;

  private _isTesting = false;

  constructor(
    @Inject(PLATFORM_ID) protected _platformId: Object,
    private _activatedRoute: ActivatedRoute,
    private _campaignService: CampaignService,
    private _campaignFrontService: CampaignFrontService,
    private _templatesService: TemplatesService,
    private _rolesFrontService: RolesFrontService,
    private _authService: AuthService,
    private _translateNotificationsService: TranslateNotificationsService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._activatedRoute.data.subscribe((data) => {
        if (data['campaign']) {
          this._campaign = data['campaign'];
          this._campaignFrontService.setActiveCampaign(this._campaign);
          this._campaignFrontService.setActiveCampaignTab('workflows');
          this._initCampaign();
          this._campaignFrontService.setLoadingCampaign(false);
        }
      });
    }
  }

  private _initCampaign() {
    this._getAllTemplates();
    this._getAllSignatures();
    this._generateAvailableScenario();
    this._generateModifiedScenarios();
  }

  private _verifyCampaignType() {
    if (this._campaign.title.indexOf('_Récup') !== -1) {
      this._autoWorkflow('Recup\' pro');
    } else {
      this._autoWorkflow('GetInsights standard');
    }
  }

  private _autoWorkflow(workflow: string) {
    const workflowToAdd = this._templates.find(
      (item) => item.name.toUpperCase().indexOf(workflow.toUpperCase()) !== -1
    );
    if (this._campaign.settings.defaultWorkflow === '') {
      this._selectedTemplate = workflowToAdd;
      this._prepareImport(true);
      this.updateAvailableScenario(this._selectedTemplate);
      this._saveTemplates('The workflow is added automatically.');
    }
  }

  public canAccess(path?: Array<string>) {
    const _default: Array<string> = [
      'projects',
      'project',
      'campaigns',
      'campaign',
      'workflows',
    ];
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(_default.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(_default);
    }
  }

  /***
   * this is to get all the templates from the library and than we choose the first one
   * as selectedTemplate.
   */
  private _getAllTemplates() {
    this._templatesService
      .getAll(this._config)
      .pipe(first())
      .subscribe(
        (response: Response) => {
          this._templates = (response && response.result) || [];
          if (this._templates.length > 0) {
            this._selectedTemplate = this._templates[0];
            this._verifyCampaignType();
          }
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorMessage(err.status)
          );
          console.error(err);
        }
      );
  }

  /***
   * this is to get all the signatures that we have in the library and assign it to the variable.
   */
  private _getAllSignatures() {
    this._templatesService
      .getAllSignatures({ limit: '0', sort: '{"_id":-1}' })
      .pipe(first())
      .subscribe(
        (response: Response) => {
          this._signatures = (response && response.result) || [];
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorMessage(err.status)
          );
          console.error(err);
        }
      );
  }

  public statsConfig(): Array<StatsInterface> {
    return [
      {
        heading: 'Pros',
        content: [
          {
            subHeading: 'Found',
            value: this._campaignStat('professional').toString(10),
          },
          {
            subHeading: 'Not reached',
            value: this._campaignStat('notReached').toString(10),
          },
          { subHeading: 'Stared', value: '--' },
          { subHeading: 'Duplicated', value: '--' },
        ],
      },
      {
        heading: 'Emails',
        content: [
          { subHeading: 'Good', value: this._campaignStat('good') + '%' },
          { subHeading: 'Unsure', value: this._campaignStat('unsure') + '%' },
          { subHeading: 'Bad', value: this._campaignStat('bad') + '%' },
        ],
      },
      {
        heading: 'Cost',
        content: [
          { subHeading: 'Requested', value: '--' },
          { subHeading: 'Emails', value: '--' },
        ],
      },
    ];
  }

  private _campaignStat(searchKey: string): number {
    return CampaignFrontService.getBatchCampaignStat(this._campaign, searchKey);
  }

  public updateAvailableScenario(scenario: EmailScenario) {
    // DROP
    this._campaign.settings.emails = this._campaign.settings.emails.filter(
      (mail) => {
        return mail.nameWorkflow !== scenario.name;
      }
    );

    // on choppe l'index avant de l'enlever dans le but de le rajouter en bonne position
    // (evite le deplacement incompréhensible de l'element dans le DOM)
    const index = this._availableScenarios.findIndex((x) => {
      return x.name === scenario.name;
    });
    this._availableScenarios = this._availableScenarios.filter((scenar) => {
      return scenar.name !== scenario.name;
    });
    // INSERT
    this._campaign.settings.emails = this._campaign.settings.emails.concat(
      scenario.emails
    );
    this._availableScenarios.splice(index, 0, scenario);
    if (this._availableScenarios.length === 1) {
      this._campaign.settings.defaultWorkflow = this._availableScenarios[0].name;
    }
    this._saveTemplates('The workflow is added.');
  }

  private _generateModifiedScenarios() {
    this._modifiedScenarios = this._availableScenarios.filter((x) => {
      return x.emails.reduce((acc, current) => {
        return acc && current.modified;
      }, true);
    });
  }

  public onClickSelect(template: EmailScenario) {
    this._selectedTemplate = template;
  }

  private _prepareImport(isModified: boolean) {
    this._selectedTemplate = {
      name: this._selectedTemplate.name,
      emails: this._selectedTemplate.emails.map((m) => {
        m.nameWorkflow = this._selectedTemplate.name;
        m.modified = isModified;
        return m;
      }),
    };

    this._campaign.settings.emails = this._campaign.settings.emails.filter(
      (x) => {
        return x.nameWorkflow !== this._selectedTemplate.name;
      }
    );

    this._campaign.settings.emails = this._campaign.settings.emails.concat(
      this._selectedTemplate.emails
    );
  }

  /***
   * this function is called when the user clicks on the import button than we assign
   * the selected template and the
   */
  public onClickImport() {
    this._prepareImport(false);
    if (
      this._availableScenarios
        .map((scenario) => scenario.name)
        .indexOf(this._selectedTemplate.name) > -1
    ) {
      this._modalContent =
        'This workflow is already imported. If you import it again it will replace the first one. ' +
        'Do you really want to import this template?';
    } else {
      this._modalContent =
        'You are adding a new workflow in this campaign, you will be able to use A/B testing!';
    }

    this._modalImport = true;
  }

  public onClickTestWorkflow() {
    if (!this._isTesting) {
      this._isTesting = true;
      for (let i = 1; i < 4; i++) {
        const userInfo = {
          email: this._authService.user.email || '',
          displayName: this._authService.user.name || '',
          firstName: this._authService.user.firstName || '',
          lastName: this._authService.user.lastName || '',
        };
        this._campaignService
          .sendTestEmails(this._campaign._id, i, userInfo)
          .pipe(first())
          .subscribe(
            (res) => {
              if (i === 3) {
                this._translateNotificationsService.success(
                  'Success',
                  'The test mails have been sent.'
                );
                this._isTesting = false;
              }
            },
            (err: HttpErrorResponse) => {
              this._translateNotificationsService.error(
                'ERROR.ERROR',
                ErrorFrontService.getErrorMessage(err.status)
              );
              this._isTesting = false;
              console.error(err);
            }
          );
      }
    }
  }

  private _saveTemplates(message: string) {
    this._campaignService
      .put(this._campaign)
      .pipe(first())
      .subscribe(
        () => {
          this._modalImport = false;
          if (this._isImporting) {
            this._isImporting = false;
          }
          this._translateNotificationsService.success('Success', message);
          this._generateModifiedScenarios();
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorMessage(err.status)
          );
          if (this._isImporting) {
            this._isImporting = false;
          }
          console.error(err);
        }
      );
  }

  /***
   * this function is called when the user clicks on the confirm button.
   */
  public onClickConfirm() {
    if (!this._isImporting) {
      this._isImporting = true;
      this.updateAvailableScenario(this._selectedTemplate);
      this._saveTemplates('The workflow is added.');
    }
  }

  public removeScenario(scenario: EmailScenario) {
    this._campaign.settings.emails = this._campaign.settings.emails.filter(
      (mail) => {
        return mail.nameWorkflow !== scenario.name;
      }
    );
    this._availableScenarios = this._availableScenarios.filter((scenar) => {
      return scenar.name !== scenario.name;
    });

    if (scenario.name === this._campaign.settings.defaultWorkflow) {
      this._campaign.settings.defaultWorkflow = '';
    }

    this._saveTemplates('The workflow is deleted.');
  }

  private _generateAvailableScenario() {
    this._availableScenarios = [];
    let scenariosNames: Set<string>;
    scenariosNames = new Set<string>();
    if (
      this._campaign &&
      this._campaign.settings &&
      this._campaign.settings.emails
    ) {
      this._campaign.settings.emails.forEach((x) => {
        scenariosNames.add(x.nameWorkflow);
      });
    }
    scenariosNames.forEach((name) => {
      const scenar = {} as EmailScenario;
      scenar.name = name;
      scenar.emails = this._campaign.settings.emails.filter((email) => {
        return email.nameWorkflow === name;
      });
      this._availableScenarios.push(scenar);
    });
  }

  public setDefaultScenario(workflow: string) {
    this._campaign.settings.defaultWorkflow = workflow;
    this._saveTemplates('The default template is updated.');
  }

  public canDelete(scenario: EmailScenario): boolean {
    return (
      this.canAccess(['delete']) &&
      this._campaign.settings &&
      this._campaign.settings.defaultWorkflow !== scenario.name &&
      this._campaign.settings.ABsettings &&
      this._campaign.settings.ABsettings.nameWorkflowA !== scenario.name &&
      this._campaign.settings.ABsettings &&
      this._campaign.settings.ABsettings.nameWorkflowB !== scenario.name
    );
  }

  get availableScenarios(): Array<EmailScenario> {
    return this._availableScenarios;
  }

  get modifiedScenarios(): Array<EmailScenario> {
    return this._modifiedScenarios;
  }

  get templates(): Array<EmailScenario> {
    return this._templates;
  }

  get campaign(): Campaign {
    return this._campaign;
  }

  get signatures(): Array<EmailSignature> {
    return this._signatures;
  }

  set templates(value: Array<EmailScenario>) {
    this._templates = value;
  }

  get modalImport(): boolean {
    return this._modalImport;
  }

  set modalImport(value: boolean) {
    this._modalImport = value;
  }

  get modalContent(): string {
    return this._modalContent;
  }

  get isImporting(): boolean {
    return this._isImporting;
  }

  get isTesting(): boolean {
    return this._isTesting;
  }
}
