import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { EmailScenario } from '../../../../../../models/email-scenario';
import { EmailSignature } from '../../../../../../models/email-signature';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';
// import { EmailTemplate } from '../../../../../models/email-template';

@Component({
  selector: 'app-admin-campaign-workflows',
  templateUrl: './admin-campaign-workflows.component.html',
  styleUrls: ['./admin-campaign-workflows.component.scss']
})

export class AdminCampaignWorkflowsComponent implements OnInit {

  private _campaign: Campaign;

  private _selectedTemplate: EmailScenario;

  private _signatures: Array<EmailSignature> = [];

  private _templates: Array<EmailScenario> = [];

  private _availableScenarios: Array<EmailScenario> = [];

  private _modifiedScenarios: Array<EmailScenario> = [];

  private _modalImport: boolean;

  private _modalContent: string;

  private _config: any = {
    fields: '',
    limit: '0',
    offset: '0',
    search: '{}',
    sort: '{ "created" : -1 }'
  };

  constructor(private activatedRoute: ActivatedRoute,
              private campaignService: CampaignService,
              private templatesService: TemplatesService,
              private notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];
    this.getAllTemplates();
    this.getAllSignatures();
    this.generateAvailableScenario();
    this.generateModifiedScenarios();
  }

  /***
   * this is to get all the templates from the library and than we choose the first one
   * as selectedTemplate.
   */
  private getAllTemplates() {
    this.templatesService.getAll(this._config).pipe(first()).subscribe((templates: any) => {
      this._templates = templates.result;
      if (this._templates.length > 0) {
        this._selectedTemplate = this._templates[0];
      }
    }, () => {
      this.notificationsService.error('ERROR.ERROR', 'ERROR.CAMPAIGN.TEMPLATE_ERROR');
    });
  }

  /***
   * this is to get all the signatures that we have in the library and assign it to the variable.
   */
  private getAllSignatures() {
    this.templatesService.getAllSignatures({limit: '0', sort: '{"_id":-1}'}).pipe(first()).subscribe((signatures: any) => {
      this._signatures = signatures.result;
    }, () => {
      this.notificationsService.error('ERROR.ERROR', 'ERROR.CAMPAIGN.SIGNATURE_ERROR');
    });
  }

  public updateAvailableScenario(scenario: EmailScenario) {
    // DROP
    this._campaign.settings.emails = this._campaign.settings.emails.filter(mail => {
      return mail.nameWorkflow !== scenario.name;
    });

    // on choppe l'index avant de l'enlever dans le but de le rajouter en bonne position
    // (evite le deplacement incompréhensible de l'element dans le DOM)
    const index = this._availableScenarios.findIndex((x) => {
      return x.name === scenario.name;
    });
    this._availableScenarios = this._availableScenarios.filter((scenar) => {
      return scenar.name !== scenario.name;
    });
    // INSERT
    this._campaign.settings.emails = this._campaign.settings.emails.concat(scenario.emails);
    this._availableScenarios.splice(index, 0, scenario);
    if (this._availableScenarios.length === 1) {
      this._campaign.settings.defaultWorkflow = this._availableScenarios[0].name;
    }
    this.saveTemplates('ERROR.CAMPAIGN.WORKFLOW.ADDED');
  }


  public generateModifiedScenarios() {
    this._modifiedScenarios = this._availableScenarios.filter((x) => {
      return x.emails.reduce((acc, current) => {
        return (acc && current.modified);
      }, true);
    });
  }



  onClickSelect(template: EmailScenario) {
    this._selectedTemplate = template;
  }


  /***
   * this function is called when the user clicks on the import button than we assign
   * the selected template and the
   */
  onClickImport() {
    this._selectedTemplate = {
      name: this._selectedTemplate.name,
      emails: this._selectedTemplate.emails.map(m => {
        m.nameWorkflow = this._selectedTemplate.name;
        m.modified = false;
        return m;
      })
    };

    this._campaign.settings.emails = this._campaign.settings.emails.filter((x) => {
      return (x.nameWorkflow !== this._selectedTemplate.name);
    });

    this._campaign.settings.emails = this._campaign.settings.emails.concat(this._selectedTemplate.emails);

    this._modalImport = true;

    if (this._availableScenarios.map(scenario => scenario.name).indexOf(this._selectedTemplate.name) > -1) {
      this._modalContent = 'CAMPAIGNS.WORKFLOW_PAGE.MODAL.CONTENT_A';
    } else {
      this._modalContent = 'CAMPAIGNS.WORKFLOW_PAGE.MODAL.CONTENT_B';
    }
  }


  onClickTestWorkflow() {
    for (let i = 1; i < 4; i++) {
      this.campaignService.sendTestEmails(this._campaign._id, i).pipe(first()).subscribe((res) => {
        this.notificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.WORKFLOW.SENT');
      }, () => {
        this.notificationsService.error('ERROR.ERROR', 'ERROR.CAMPAIGN.WORKFLOW.SENT_ERROR');
      });
    }
  }

  private saveTemplates(message: string) {
    this.campaignService.put(this._campaign).pipe(first()).subscribe((savedCampaign: any) => {
      this.notificationsService.success("ERROR.SUCCESS", message);
      this.generateModifiedScenarios();
    }, (err: any) => {
      this.notificationsService.error('ERROR', err.message);
    });
  }

  /***
   * this function is called when the user clicks on the confirm button.
   */
  onClickConfirm() {
    this.updateAvailableScenario(this._selectedTemplate);
    this.saveTemplates('ERROR.CAMPAIGN.WORKFLOW.ADDED');
    this._modalImport = false;
  }

  public removeScenario(scenario: EmailScenario) {
    this._campaign.settings.emails = this._campaign.settings.emails.filter(mail => {
      return mail.nameWorkflow !== scenario.name;
    });
    this._availableScenarios = this._availableScenarios.filter((scenar) => {
      return scenar.name !== scenario.name;
    });

    if (scenario.name === this._campaign.settings.defaultWorkflow) {
      this._campaign.settings.defaultWorkflow = '';
    }

    this.saveTemplates('ERROR.CAMPAIGN.WORKFLOW.DELETED');
  }

  private generateAvailableScenario() {
    this._availableScenarios = [];
    let scenariosNames: Set<string>;
    scenariosNames = new Set<string>();
    if (this._campaign && this._campaign.settings && this._campaign.settings.emails) {
      this._campaign.settings.emails.forEach((x) => {
        scenariosNames.add(x.nameWorkflow);
      });
    }
    scenariosNames.forEach((name) => {
      let scenar = {} as EmailScenario;
      scenar.name = name;
      scenar.emails = this._campaign.settings.emails.filter(email => {
        return email.nameWorkflow === name;
      });
      this._availableScenarios.push(scenar);
    });
  }

  public setDefaultScenario(workflow: string) {
    this._campaign.settings.defaultWorkflow = workflow;
    this.saveTemplates('ERROR.CAMPAIGN.WORKFLOW.DEFAULT');
  }

  get availableScenarios(): Array<EmailScenario> {
    return this._availableScenarios;
  }

  get modifiedScenarios(): Array<EmailScenario> {
    return this._modifiedScenarios;
  };

  get templates(): Array<EmailScenario> {
    return this._templates;
  }
  get campaign(): Campaign {
    return this._campaign;
  };

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
}
