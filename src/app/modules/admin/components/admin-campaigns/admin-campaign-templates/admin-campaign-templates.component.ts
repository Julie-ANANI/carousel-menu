import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { EmailScenario } from '../../../../../models/email-scenario';
import { EmailSignature } from '../../../../../models/email-signature';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TemplatesService } from '../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { first } from 'rxjs/operators';
// import { EmailTemplate } from '../../../../../models/email-template';

@Component({
  selector: 'app-admin-campaign-templates',
  templateUrl: './admin-campaign-templates.component.html',
  styleUrls: ['./admin-campaign-templates.component.scss']
})
export class AdminCampaignTemplatesComponent implements OnInit {

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
    sort: '{"created":-1}'
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _templatesService: TemplatesService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    this.generateAvailableScenario();
    this.generateModifiedScenarios();
    this._templatesService.getAll(this._config).pipe(first()).subscribe((templates: any) => {
      this._templates = templates.result;
    });
    this._templatesService.getAllSignatures({limit: '0', sort: '{"_id":-1}'}).pipe(first()).subscribe((signatures: any) => {
      this._signatures = signatures.result;
    });
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
    this.generateAvailableScenario();
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
    this._campaignService.put(this._campaign).pipe(first()).subscribe((savedCampaign: any) => {
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

  private generateAvailableScenario() {
    this._availableScenarios = [];
    let scenariosnames: Set<string>;
    scenariosnames = new Set<string>();
    if (this._campaign.settings && this._campaign.settings.emails) {
      this._campaign.settings.emails.forEach((x) => {
        scenariosnames.add(x.nameWorkflow);
      });
    }
    scenariosnames.forEach((name) => {
      let scenar = {} as EmailScenario;
      scenar.name = name;
      scenar.emails = this._campaign.settings.emails.filter(email => {
        return email.nameWorkflow === name;
      });
      this._availableScenarios.push(scenar);
    });
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

  get config(): any { return this._config; }

  get availableScenarios(): Array<EmailScenario> { return this._availableScenarios }
  get scenario(): EmailScenario { return this._scenario; }
  get modifiedScenarios(): Array<EmailScenario> { return this._modifiedScenarios };
  get templates(): Array<EmailScenario> { return this._templates; }
  get campaign(): Campaign { return this._campaign };
  get signatures(): Array<EmailSignature> { return this._signatures; }
  set config(value: any) { this._config = value; }
  set scenario(value: EmailScenario) { this._scenario = value; }
  set templates(value: Array<EmailScenario>) { this._templates = value; }
}
