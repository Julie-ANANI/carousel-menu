import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { EmailScenario } from '../../../../../../models/email-scenario';
import { EmailSignature } from '../../../../../../models/email-signature';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';
import { EmailTemplate } from '../../../../../../models/email-template';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';

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

  private _modifiedScenario: EmailScenario;

  private _modalImport: boolean;

  private _noResult = false;

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
              private translateNotificationsService: TranslateNotificationsService,
              private campaignFrontService: CampaignFrontService) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];
    this.getAllTemplates();
    this.getAllSignatures();
    this.generateAvailableScenarios();
    this.getModifiedScenario();
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
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CAMPAIGN.TEMPLATE_ERROR');
    });
  }


  /***
   * this is to get all the signatures that we have in the library and assign it to the variable.
   */
  private getAllSignatures() {
    this.templatesService.getAllSignatures({limit: '0', sort: '{"_id":-1}'}).pipe(first()).subscribe((signatures: any) => {
      this._signatures = signatures.result;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CAMPAIGN.SIGNATURE_ERROR');
    });
  }


  /***
   * this is to generate the available scenarios. We also group them under the same workflow, and than
   * assign it to the variable availableScenarios. Based on that we also we assign the value of the
   * variable noResult.
   */
  private generateAvailableScenarios() {
    this._availableScenarios = [];

    let scenariosNames: Set<string> = new Set<string>();

    if (this._campaign.settings && this._campaign.settings.emails) {
      this._campaign.settings.emails.forEach((mail) => {
        scenariosNames.add(mail.nameWorkflow);
      });
    }

    scenariosNames.forEach((name) => {
      let scenario = {} as EmailScenario;
      scenario.name = name;

      scenario.emails = this._campaign.settings.emails.filter(email => {
        return email.nameWorkflow === name;
      });

      this._availableScenarios.push(scenario);
    });

    this._noResult = this._availableScenarios.length === 0;

  }


  /***
   * first we check do we have the default workflow, if yes than we search for that workflow in the availableScenarios
   * and assign that to modifiedScenario. If no than we search in the emails and look which email is modified than
   * we take the workflow name than look for that in the availableScenarios and that assign it to the modifiedScenario.
   * If all conditions failed than we assign the first one of availableScenarios to the modifiedScenario.
   */
  private getModifiedScenario() {
    if (this._availableScenarios.length > 0) {

      if (this._campaign.settings.defaultWorkflow) {
        const index = this._availableScenarios.findIndex((scenario: EmailScenario) => this._campaign.settings.defaultWorkflow === scenario.name);
        if (index !== -1) {
          this.updateModifiedScenario(this._availableScenarios[index]);
        }
      } else {
        let nameWorkflow: string;

        this._campaign.settings.emails.forEach((mail: EmailTemplate) => {
          if (mail.modified) {
            nameWorkflow = mail.nameWorkflow;
            return;
          }
        });

        if (nameWorkflow) {
          const index = this._availableScenarios.findIndex((scenario: EmailScenario) => scenario.name === nameWorkflow);
          if (index !== -1) {
            this.updateModifiedScenario(this._availableScenarios[index]);
          }
        } else {
          this.updateModifiedScenario(this._availableScenarios[0]);
        }

      }

    }
  }


  getCampaignStat(searchKey: any): number {
    if (this._campaign) {
      return this.campaignFrontService.getBatchCampaignStat(this._campaign, searchKey);
    }
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

    if (this._modifiedScenario && this._modifiedScenario.name && this._modifiedScenario.name === this._selectedTemplate.name) {
      this._modalContent = 'CAMPAIGNS.WORKFLOW_PAGE.MODAL.CONTENT_A';
    } else {
      this._modalContent = 'CAMPAIGNS.WORKFLOW_PAGE.MODAL.CONTENT_B';
    }

  }


  onClickTestWorkflow() {
    for (let i = 1; i < 4; i++) {
      this.campaignService.sendTestEmails(this._campaign._id, i).pipe(first()).subscribe((res) => {
        this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.WORKFLOW.SENT');
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CAMPAIGN.WORKFLOW.SENT_ERROR');
      });
    }
  }


  private saveTemplates(message: string) {
    this.campaignService.put(this._campaign).pipe(first()).subscribe((savedCampaign: any) => {
      this.translateNotificationsService.success("ERROR.SUCCESS", message);
    }, () => {
      this.translateNotificationsService.error('ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  /***
   * this function is called when the user clicks on the confirm button.
   */
  onClickConfirm() {
    this.updateModifiedScenario(this._selectedTemplate);
    this.generateAvailableScenarios();
    this.saveTemplates('ERROR.CAMPAIGN.WORKFLOW.ADDED');
    this._modalImport = false;
  }


  private updateModifiedScenario(scenario: EmailScenario) {
    this._modifiedScenario = scenario;
    this._campaign.settings.defaultWorkflow = scenario.name;
  }


  removeScenario() {
    this._campaign.settings.defaultWorkflow = '';
    this._campaign.settings.emails = [];
    this.generateAvailableScenarios();
    this._modifiedScenario = null;
    this.saveTemplates('ERROR.CAMPAIGN.WORKFLOW.DELETED');
  }


  /***
   * for the moment we are keeping it like this because we have old campaigns.
   * @param scenario
   */
  updateAvailableScenario(scenario: EmailScenario) {
    // DROP
    this._campaign.settings.emails = this._campaign.settings.emails.filter((mail: EmailTemplate) => {
      return mail.nameWorkflow !== scenario.name;
    });

    // on choppe l'index avant de l'enlever dans le but de le rajouter en bonne position
    // (evite le deplacement incrompréhensible de l'element dans le DOM)
    const index = this._availableScenarios.findIndex((x: EmailScenario) => {
      return x.name === scenario.name;
    });

    this._availableScenarios = this._availableScenarios.filter((scenar: EmailScenario) => {
      return scenar.name !== scenario.name;
    });

    this._campaign.settings.emails = this._campaign.settings.emails.concat(scenario.emails);
    this._availableScenarios.splice(index, 0, scenario);
    this.saveTemplates('ERROR.CAMPAIGN.WORKFLOW.UPDATED');
  }


  /*get domain(): boolean {
    return (this._campaign.innovation.settings.domain !== '');

  }*/

  get config(): any {
    return this._config;
  }

  get availableScenarios(): Array<EmailScenario> {
    return this._availableScenarios
  }

  get templates(): Array<EmailScenario> {
    return this._templates;
  }

  get campaign(): Campaign {
    return this._campaign
  };

  get signatures(): Array<EmailSignature> {
    return this._signatures;
  }

  set config(value: any) {
    this._config = value;
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

  get selectedTemplate(): EmailScenario {
    return this._selectedTemplate;
  }

  get modifiedScenario(): EmailScenario {
    return this._modifiedScenario;
  }

  get noResult(): boolean {
    return this._noResult;
  }

  get modalContent(): string {
    return this._modalContent;
  }

}
