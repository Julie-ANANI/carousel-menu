import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { EmailScenario } from '../../../../../models/email-scenario';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TemplatesService } from '../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
// import { EmailTemplate } from '../../../../../models/email-template';

@Component({
  selector: 'app-admin-campaign-templates',
  templateUrl: './admin-campaign-templates.component.html',
  styleUrls: ['./admin-campaign-templates.component.scss']
})
export class AdminCampaignTemplatesComponent implements OnInit {

  private _campaign: Campaign;
  public importModal: boolean = false;

  private _scenario: EmailScenario = {
    name: '',
    emails: []
  };
  private _availableScenarios: Array<EmailScenario> = [];
  private _modifiedScenarios: Array<EmailScenario> = [];

  private _templates: Array<EmailScenario> = [];
  private _config: any = {
    fields: '',
    limit: 20,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _templatesService: TemplatesService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    this.generateAvailableScenario();
    this.generateModifiedScenarios();
    this._templatesService.getAll(this._config).first().subscribe(templates => {
      this._templates = templates.result;
    });
  }

  public importTemplate(template: EmailScenario) {
    this._scenario.emails = template.emails;
    this._scenario.name = template.name;
    this._scenario.emails.forEach((x) => {
      x.name = template.name;
    });
    this.importModal = false;
    this._campaign.settings.emails = this._campaign.settings.emails.concat(this._scenario.emails);
    this.generateAvailableScenario();
    this._saveTemplates();
  }

  public updateAvailableScenario(scenario: EmailScenario) {
    // DROP
    this._campaign.settings.emails = this._campaign.settings.emails.filter(mail => {
      return mail.name !== scenario.name;
    });

    // on choppe l'index avant de l'enlever dans le but de le rajouter en bonne position
    // (evite le deplacement incrompréhensible de l'element dans le DOM)
    const index = this._availableScenarios.findIndex((x) => {
      return x.name === scenario.name;
    });
    this._availableScenarios = this._availableScenarios.filter((scenar) => {
      return scenar.name !== scenario.name;
    });
    // INSERT
    this._campaign.settings.emails = this._campaign.settings.emails.concat(scenario.emails);
    this._availableScenarios.splice(index, 0, scenario);
    this._saveTemplates();
  }

  private _saveTemplates() {
    this._campaignService.put(this._campaign).first().subscribe(savedCampaign => {
      this._notificationsService.success("ERROR.SUCCESS", "ERROR.ACCOUNT.UPDATE");
      this.generateModifiedScenarios();
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }

  public generateModifiedScenarios() {
    this._modifiedScenarios = this._availableScenarios.filter((x) => {
      return x.emails.reduce((acc, current) => {
        return (acc && current.modified);
      }, true);
    });
  }

  public changeDefaultWorkflow(scenarioName: string) {
    this._campaign.settings.defaultWorkflow = scenarioName;
    this._saveTemplates();
  }

  public removeScenario(scenario: EmailScenario) {
    this._campaign.settings.emails = this._campaign.settings.emails.filter(mail => {
      return mail.name !== scenario.name;
    });
    this._availableScenarios = this._availableScenarios.filter((scenar) => {
      return scenar.name !== scenario.name;
    });

    if (scenario.name === this._campaign.settings.defaultWorkflow) {
      this._campaign.settings.defaultWorkflow = '';
    }

    this._saveTemplates();
  }

  private generateAvailableScenario() {
    this._availableScenarios = [];
    let scenariosnames = new Set<string>();
    if (this._campaign.settings && this._campaign.settings.emails) {
      this._campaign.settings.emails.forEach((x) => {
        scenariosnames.add(x.name);
      });
    }
    scenariosnames.forEach((name) => {
      let scenar = {} as EmailScenario;
      scenar.name = name;
      scenar.emails = this._campaign.settings.emails.filter(email => {
        return email.name === name;
      });
      this._availableScenarios.push(scenar);
    });
  }

  get config(): any { return this._config; }

  get availableScenarios(): Array<EmailScenario> { return this._availableScenarios }
  get scenario(): EmailScenario { return this._scenario; }
  get modifiedScenarios(): Array<EmailScenario> { return this._modifiedScenarios };
  get templates(): Array<EmailScenario> { return this._templates; }
  get campaign(): Campaign { return this._campaign };

  set config(value: any) { this._config = value; }
  set scenario(value: EmailScenario) { this._scenario = value; }
  set templates(value: Array<EmailScenario>) { this._templates = value; }
}
