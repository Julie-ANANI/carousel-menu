import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { EmailScenario } from '../../../../../../models/email-scenario';
import { EmailSignature } from '../../../../../../models/email-signature';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';
import {EmailTemplate} from '../../../../../../models/email-template';

@Component({
  selector: 'app-admin-campaign-workflows',
  templateUrl: './admin-campaign-workflows.component.html',
  styleUrls: ['./admin-campaign-workflows.component.scss']
})

export class AdminCampaignWorkflowsComponent implements OnInit {

  private _campaign: Campaign;

  modalSelectDefault: Array<any> = [false, ''];

  defaultSelectedTemplate: EmailScenario;

  private _signatures: Array<EmailSignature> = [];

  private _scenario: EmailScenario = {
    name: '',
    emails: []
  };

  private _templates: Array<EmailScenario> = [];

  private _availableScenarios: Array<EmailScenario> = [];

  private _modifiedScenarios: Array<EmailScenario> = [];

  modifiedScenario: EmailScenario;

  private _config: any = {
    fields: '',
    limit: '20',
    offset: '0',
    search: '{}',
    sort: '{ "created" : -1 }'
  };

  constructor(private activatedRoute: ActivatedRoute,
              private campaignService: CampaignService,
              private templatesService: TemplatesService,
              private translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];
    this.getAllTemplates();
    this.getAllSignatures();
    this.getAvailableScenarios();
    this.getModifiedScenario();
    console.log(this._campaign.settings);
  }


  private getAllTemplates() {
    this.templatesService.getAll(this._config).pipe(first()).subscribe((templates: any) => {
      this._templates = templates.result;
      if (this._templates.length > 0) {
        this.defaultSelectedTemplate = this._templates[0];
      }
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CAMPAIGN.TEMPLATE_ERROR');
    });
  }


  private getAllSignatures() {
    this.templatesService.getAllSignatures({limit: '0', sort: '{"_id":-1}'}).pipe(first()).subscribe((signatures: any) => {
      this._signatures = signatures.result;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CAMPAIGN.SIGNATURE_ERROR');
    });
  }


  private getAvailableScenarios() {
    this._availableScenarios = [];

    let scenariosNames: Set<string>;

    scenariosNames = new Set<string>();

    if (this._campaign.settings && this._campaign.settings.emails) {
      this._campaign.settings.emails.forEach((x) => {
        scenariosNames.add(x.nameWorkflow);
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

    console.log(this._availableScenarios);

  }


  private getModifiedScenario() {
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


  onClickSelect(template: EmailScenario) {
    this.defaultSelectedTemplate = template;
  }


  onClickImport() {
    const mails: EmailScenario = {
      name: this.defaultSelectedTemplate.name,
      emails: this.defaultSelectedTemplate.emails.map( m => {
        m.nameWorkflow = this.defaultSelectedTemplate.name;
        m.modified = false;
        return m;
      })
    };

    this._campaign.settings.emails = this._campaign.settings.emails.filter((x) => {
      return (x.nameWorkflow !== this.defaultSelectedTemplate.name);
    });

    this._campaign.settings.emails = this._campaign.settings.emails.concat(mails.emails);
    this.updateModifiedScenario(mails);
    this.getAvailableScenarios();
    this.saveTemplates('ERROR.CAMPAIGN.WORKFLOW.ADDED');
  }


  private saveTemplates(message: string) {
    this.campaignService.put(this._campaign).pipe(first()).subscribe((savedCampaign: any) => {
      this.translateNotificationsService.success("ERROR.SUCCESS", message);
      // this.getModifiedScenarios();
    }, () => {
      this.translateNotificationsService.error('ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  private updateModifiedScenario(scenario: EmailScenario) {
    this.modifiedScenario = scenario;
    this._campaign.settings.defaultWorkflow = scenario.name;
  }


















 /* public updateAvailableScenario(scenario: EmailScenario) {
    // DROP
    this._campaign.settings.emails = this._campaign.settings.emails.filter(mail => {
      return mail.nameWorkflow !== scenario.name;
    });

    // on choppe l'index avant de l'enlever dans le but de le rajouter en bonne position
    // (evite le deplacement incrompréhensible de l'element dans le DOM)
    /!*const index = this._availableScenarios.findIndex((x) => {
      return x.name === scenario.name;
    });
    this._availableScenarios = this._availableScenarios.filter((scenar) => {
      return scenar.name !== scenario.name;
    });
    // INSERT
    this._campaign.settings.emails = this._campaign.settings.emails.concat(scenario.emails);
    this._availableScenarios.splice(index, 0, scenario);
    this._saveTemplates();*!/
  }*/






  public changeDefaultWorkflow() {
    this.modalSelectDefault[0] = !this.modalSelectDefault[0];
    this._campaign.settings.defaultWorkflow = this.modalSelectDefault[1];
    // this.saveTemplates();
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

    this.saveTemplates('');
  }



  public areYouSureYouWantToChange(scenarioname: string) {
    this.modalSelectDefault[0] = true;
  }
  public resetDefaultWorkflow() {
    this.modalSelectDefault[0] = !this.modalSelectDefault[0];
    this.modalSelectDefault[1] = this._campaign.settings.defaultWorkflow;
  }


  get domain(): boolean {
    return (this._campaign.innovation.settings.domain !== '');

  }

  get config(): any {
    return this._config;
  }

  get availableScenarios(): Array<EmailScenario> {
    return this._availableScenarios
  }

  get scenario(): EmailScenario {
    return this._scenario;
  }

  get modifiedScenarios(): Array<EmailScenario> {
    return this._modifiedScenarios
  };

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

  set scenario(value: EmailScenario) {
    this._scenario = value;
  }

  set templates(value: Array<EmailScenario>) {
    this._templates = value;
  }

}
