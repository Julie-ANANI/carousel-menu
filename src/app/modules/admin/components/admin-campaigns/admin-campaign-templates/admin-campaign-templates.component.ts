import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { EmailScenario } from '../../../../../models/email-scenario';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TemplatesService } from '../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import {InnovationService} from '../../../../../services/innovation/innovation.service';

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
  private _domain: string;

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _templatesService: TemplatesService,
              private _notificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    this._domain = this._campaign.innovation.settings.domain;
    this._scenario.name = this._campaign.title;
    if (this._campaign.settings && this._campaign.settings.emails) {
      this._scenario.emails = this._campaign.settings.emails;
    }
    this._templatesService.getAll(this._config).first().subscribe(templates => {
      this._templates = templates.result;
    });
  }

  public importTemplate(template: EmailScenario) {
    this._scenario.emails = template.emails;
    this.importModal = false;
    this._saveTemplates();
  }

  public updateScenario(scenario: EmailScenario) {
    this._scenario = scenario;
    this._saveTemplates();
  }

  public updateDomain() {
    this._innovationService.updateSettingsDomain(this._campaign.innovation._id, this._domain).first().subscribe( x => {
      this._notificationsService.success("ERROR.SUCCESS", "|*DOMAIN*| is set");
      this._domain = x.domain;
    }, error => {
      this._notificationsService.error('ERROR', error);
    });
  }

  private _saveTemplates() {
    this._campaign.settings.emails = this._scenario.emails;
    this._campaignService.put(this._campaign).first().subscribe(savedCampaign => {
      this._notificationsService.success("ERROR.SUCCESS", "ERROR.ACCOUNT.UPDATE");
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }
  get domain(): string { return this._domain; }
  set domain(d: string) { this._domain = d; }
  get config(): any { return this._config; }
  set config(value: any) { this._config = value; }
  get scenario(): EmailScenario { return this._scenario; }
  set scenario(value: EmailScenario) { this._scenario = value; }
  get templates(): Array<EmailScenario> { return this._templates; }
  set templates(value: Array<EmailScenario>) { this._templates = value; }
}
