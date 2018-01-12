import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from "angular2-notifications/dist";


@Component({
  selector: 'app-admin-campaign-details',
  templateUrl: './admin-campaign-details.component.html',
  styleUrls: ['./admin-campaign-details.component.scss']
})
export class AdminCampaignDetailsComponent implements OnInit {

  private _campaign: any;

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _notificationsService: NotificationsService,
              private _titleService: TranslateTitleService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.data['campaign'];
    console.log(this._campaign);
  }

  public updateStats() {
    this._campaignService.updateStats(this._campaign._id)
      .subscribe(stats=>{
        this._campaign.stats = stats;
      }, error => {
        this._notificationsService.error('ERROR', error.message);
      });
  };

  get baseUrl(): any { return `/admin/campaigns/campaign${this._campaign._id}/details`; }
  get campaign(): any { return this._campaign; }
}
