import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SmartQueryService } from '../../../../services/smartQuery/smartQuery.service';
import { TranslateService, initTranslation } from './i18n/i18n';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-campaign',
  templateUrl: './client-campaign.component.html',
  styleUrls: ['./client-campaign.component.scss']
})
export class ClientCampaignComponent implements OnInit {

  private _innovations = [];
  private _total = 0;

  constructor(private _router: Router,
              private _translateService: TranslateService,
              private _titleService: Title,
              private _sq: SmartQueryService,
              private _notificationsService: NotificationsService) {
    this._sq.setRoute('/innovation');
  }

  ngOnInit(): void {
    initTranslation(this._translateService);
    this._titleService.setTitle('Campaigns'); // TODO translate

    this._sq.data$.subscribe(innovations => {
      this._innovations = innovations.result;
      this._total = innovations._metadata.totalCount;
    });
    this._sq.getData();
  }

  get sq(): any {
    return this._sq;
  }

  get total(): number {
    return this._total;
  }

  get innovations(): any[] {
    return this._innovations;
  }
}
