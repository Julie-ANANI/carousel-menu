import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailScenario } from '../../../../models/email-scenario';
// import { EmailTemplate } from '../../../../models/email-template';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../models/campaign';
import {CampaignService} from '../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-shared-edit-templates',
  templateUrl: 'shared-edit-templates.component.html',
  styleUrls: ['shared-edit-templates.component.scss']
})
export class SharedEditTemplatesComponent implements OnInit {

  @Input() public ArgScenarios: Array<EmailScenario>;
  @Output() scenarioChange = new EventEmitter <Array<EmailScenario>>();
  private _availableScenarios: Array<EmailScenario>; // All scenarios available
  private _campaign: Campaign;
  private _modifiedScenarios: Array<EmailScenario>;

  constructor(private _activatedRoute: ActivatedRoute,
              private _notificationsService: TranslateNotificationsService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    this._availableScenarios = this.ArgScenarios;
    this.modifiedScenarios();
  }


  // Je sors l'array d'email de la camp et je le reinsere.
  public updateAvailableScenario(scenario: EmailScenario) {
    //RETIRER
    this._campaign.settings.emails = this._campaign.settings.emails.filter(mail => {
      return mail.name !== scenario.name;
    });
    this._availableScenarios = this._availableScenarios.filter((scenar) => {
      return scenar.name !== scenario.name;
    });
    //INSERER
    this._campaign.settings.emails = this._campaign.settings.emails.concat(scenario.emails);
    this._availableScenarios = this._availableScenarios.concat(scenario);
    this._saveTemplates();
  }

  private _saveTemplates() {
    this._campaignService.put(this._campaign).first().subscribe(savedCampaign => {
      this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
      this.modifiedScenarios();
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }

  public changeDefaultWorkflow(scenarioName: string) {
   // scenario = scenario as EmailScenario;
    console.log(scenarioName);
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

  public modifiedScenarios() {
    this._modifiedScenarios = this._availableScenarios.filter((x) => {
      return x.emails.reduce((acc, current) => {
        return (acc && current.modified);
      }, true);
    });
  }
}
