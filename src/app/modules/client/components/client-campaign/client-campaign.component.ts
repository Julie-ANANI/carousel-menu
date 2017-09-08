import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-campaign',
  templateUrl: './client-campaign.component.html',
  styleUrls: ['./client-campaign.component.styl']
})
export class ClientCampaignComponent implements OnInit {

  private _data = [];
  private _total = 0;
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
              private _innovationService: InnovationService,
              private _notificationsService: NotificationsService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('Campaigns'); // TODO translate

    this._innovationService.getAll().subscribe(innovations => {
      this._data = innovations.result;
      this._total = innovations._metadata.totalCount
    });
  }

  get total(): Number {
    return this._total;
  }
  get data(): any {
    return this._data;
  }

  get settings(): any {
    return this._settings;
  }
}
