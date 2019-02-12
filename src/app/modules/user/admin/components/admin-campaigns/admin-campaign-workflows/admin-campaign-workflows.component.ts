import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { EmailScenario } from '../../../../../../models/email-scenario';
import { EmailSignature } from '../../../../../../models/email-signature';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-campaign-workflows',
  templateUrl: './admin-campaign-workflows.component.html',
  styleUrls: ['./admin-campaign-workflows.component.scss']
})

export class AdminCampaignWorkflowsComponent implements OnInit {

  private _campaign: Campaign;

  public importModal = false;

  public modalSelectDefault: Array<any> = [false, ''];

  private _signatures: Array<EmailSignature> = [];

  private _scenario: EmailScenario = {
    name: '',
    emails: []
  };

  private _availableScenarios: Array<EmailScenario> = [];

  private _modifiedScenarios: Array<EmailScenario> = [];

  private _templates: Array<EmailScenario> = [];

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
    console.log(this._campaign.settings.emails);
    this.getAvailableScenario();
    this.getModifiedScenarios();

    this.templatesService.getAll(this._config).pipe(first()).subscribe((templates: any) => {
      this._templates = templates.result;
    });

    this.templatesService.getAllSignatures({limit: '0', sort: '{"_id":-1}'}).pipe(first()).subscribe((signatures: any) => {
      this._signatures = signatures.result;
    });
  }


  private getAvailableScenario() {
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


  private getModifiedScenarios() {
    this._modifiedScenarios = this._availableScenarios.filter((x) => {
      return x.emails.reduce((acc, current) => {
        return (acc && current.modified);
      }, true);
    });
    console.log(this._modifiedScenarios);
  }


  public importTemplate(template: EmailScenario) {
    const mails: EmailScenario = {
      name: template.name,
      emails: template.emails.map( m => {
        m.nameWorkflow = template.name;
        m.modified = false;
        return m;
      })
    };
    this.importModal = false;
    this._campaign.settings.emails = this._campaign.settings.emails.filter((x) => {
      return (x.nameWorkflow !== template.name);
    });
    this._campaign.settings.emails = this._campaign.settings.emails.concat(mails.emails);
    this.getAvailableScenario();
    this._saveTemplates();
  }

  public updateAvailableScenario(scenario: EmailScenario) {
    // DROP
    this._campaign.settings.emails = this._campaign.settings.emails.filter(mail => {
      return mail.nameWorkflow !== scenario.name;
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
    this.campaignService.put(this._campaign).pipe(first()).subscribe((savedCampaign: any) => {
      this.translateNotificationsService.success("ERROR.SUCCESS", "ERROR.ACCOUNT.UPDATE");
      this.getModifiedScenarios();
    }, (err: any) => {
      this.translateNotificationsService.error('ERROR', err);
    });
  }



  public changeDefaultWorkflow() {
    this.modalSelectDefault[0] = !this.modalSelectDefault[0];
    this._campaign.settings.defaultWorkflow = this.modalSelectDefault[1];
    this._saveTemplates();
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

    this._saveTemplates();
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
