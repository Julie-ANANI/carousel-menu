import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { CampaignService } from '../../../../services/campaign/campaign.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from "angular2-notifications/dist";


@Component({
  selector: 'app-admin-campaigns',
  templateUrl: './admin-campaigns.component.html',
  styleUrls: ['./admin-campaigns.component.scss']
})
export class AdminCampaignsComponent implements OnInit {

  private _campaigns = [];

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _notificationsService: NotificationsService,
              private _titleService: TranslateTitleService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      this._innovationService.campaigns(params.projectId)
          .subscribe(campaigns => {
                console.log(campaigns);
                this._campaigns = campaigns.result;
              },
              error => this._notificationsService.error('ERROR', error.message)
          );
    });
  }

  get campaigns(): Array<any> {
    return this._campaigns;
  }

  public updateStats(campaign) {
    this._campaignService.updateStats(campaign._id)
        .subscribe(stats=>{
          campaign.stats = stats;
        }, error => {
          this._notificationsService.error('ERROR', error.message);
        });
};
}
