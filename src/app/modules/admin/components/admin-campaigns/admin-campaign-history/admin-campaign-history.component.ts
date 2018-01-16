import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { NotificationsService } from "angular2-notifications/dist";


@Component({
  selector: 'app-admin-campaign-history',
  templateUrl: './admin-campaign-history.component.html',
  styleUrls: ['./admin-campaign-history.component.scss']
})
export class AdminCampaignHistoryComponent implements OnInit {

  private _campaign: any;

  constructor(private _activatedRoute: ActivatedRoute,
              private _notificationsService: NotificationsService,
              private _titleService: TranslateTitleService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.data['campaign'];
  }
}
