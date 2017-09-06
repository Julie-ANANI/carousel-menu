import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from '../../../../services/campaign/campaign.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';
import { LocalDataSource, Ng2SmartTableModule } from 'ng2-smart-table';

@Component({
  selector: 'app-client-campaign',
  templateUrl: './client-campaign.component.html',
  styleUrls: ['./client-campaign.component.styl']
})
export class ClientCampaignComponent implements OnInit {

  private _campaigns: [any];
  private _source: LocalDataSource;
  private _settings = {
    columns: {
      title: {
        title: 'Titre',
      },
      'stats.totalResponded': {
        title: 'Réponses',
      },
      status: {
        title: 'Statut',
      },
      created: {
        title: 'Création',
      },
    },
  };

  constructor(private _router: Router,
              private _translateService: TranslateService,
              private _titleService: Title,
              private _campaignService: CampaignService,
              private _notificationsService: NotificationsService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('Campaigns'); // TODO translate

    this._source = new LocalDataSource();
    this._campaignService.getAll().subscribe(campaigns => {
      this._source.load(campaigns.result);
    });
  }

  get source(): LocalDataSource {
    return this._source;
  }

  get settings(): any {
    return this._settings;
  }
}
