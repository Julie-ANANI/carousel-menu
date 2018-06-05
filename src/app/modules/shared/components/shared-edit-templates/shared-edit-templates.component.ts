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
  private _availableScenarios: Array<EmailScenario>;
  private _campaign: Campaign;

  constructor(private _activatedRoute: ActivatedRoute,
              private _notificationsService: TranslateNotificationsService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    this._availableScenarios = this.ArgScenarios;
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
      this._notificationsService.success("ERROR.SUCCESS", "ERROR.ACCOUNT.UPDATE");
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
  }

  public removeScenario(scenario: EmailScenario) {
    this._campaign.settings.emails = this._campaign.settings.emails.filter(mail => {
      return mail.name !== scenario.name;
    });
    this._availableScenarios = this._availableScenarios.filter((scenar) => {
      return scenar.name !== scenario.name;
    });
    this._saveTemplates();
  }

}
