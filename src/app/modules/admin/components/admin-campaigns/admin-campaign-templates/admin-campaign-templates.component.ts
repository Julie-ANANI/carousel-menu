import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { EmailScenario } from '../../../../../models/email-scenario';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TemplatesService } from '../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';

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
    // this._scenario.name = this._campaign.title;
    let scenariosnames = new Set<String>();
    if (this._campaign.settings && this._campaign.settings.emails) {
       this._scenario.emails = this._campaign.settings.emails;
      console.log(this._campaign.settings.emails.length);
     this._campaign.settings.emails.forEach((x) => {
        scenariosnames.add(x.name);
      });

    }
    // Ne pas passer par tout les scenar de la base (templates) =>
    // Reconstruire les scenarios avec les emails importés de la campagne
    console.log(JSON.stringify(scenariosnames));
    this._templatesService.getAll(this._config).first().subscribe(templates => {
      this._templates = templates.result;
      this._availableScenarios = this._templates.filter( (x) => {
        scenariosnames.has(x.name);
      });
      console.log(JSON.stringify(this._availableScenarios));
      // Ici je n'ai que les noms dans les scenarios. il faut remplir les emails maintenant...
      this._availableScenarios.forEach((scenar) => {
        scenar.emails = this._campaign.settings.emails.filter(email => {
          email.name === scenar.name;
        });

      });
      //console.log(JSON.stringify(this._availableScenarios));
    });
  }

  public importTemplate(template: EmailScenario) {
    this._scenario.emails = template.emails;
    this._scenario.name = template.name;
    this.importModal = false;
    this._saveTemplates();
  }

  public updateScenario(scenario: EmailScenario) {
    this._scenario = scenario;
    this._saveTemplates();
  }

  private _saveTemplates() {
    // TODO : Si concat, mail non modifiable aprés import => Interface AVANT back
    // this._campaign.settings.emails = this._campaign.settings.emails.concat(this._scenario.emails);
    this._campaign.settings.emails = this._scenario.emails;
    this._campaign.settings.emails.forEach( (email) => {
      email.name = this._scenario.name;
    });
    console.log(this._campaign.settings.emails);
    this._campaignService.put(this._campaign).first().subscribe(savedCampaign => {
      this._notificationsService.success("ERROR.SUCCESS", "ERROR.ACCOUNT.UPDATE");
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }

  get config(): any { return this._config; }
  set config(value: any) { this._config = value; }
  get availableScenarios(): Array<EmailScenario> {return this._availableScenarios}
  get scenario(): EmailScenario { return this._scenario; }
  set scenario(value: EmailScenario) { this._scenario = value; }
  get templates(): Array<EmailScenario> { return this._templates; }
  set templates(value: Array<EmailScenario>) { this._templates = value; }
}
