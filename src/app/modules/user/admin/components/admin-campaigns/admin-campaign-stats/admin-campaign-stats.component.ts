import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';

@Component({
  selector: 'app-admin-campaign-stats',
  templateUrl: './admin-campaign-stats.component.html',
  styleUrls: ['./admin-campaign-stats.component.scss']
})

export class AdminCampaignStatsComponent implements OnInit {
  private _campaign: Campaign;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];
  }


  getCampaignStat(searchKey: any): number {
    if (this._campaign) {
      return CampaignFrontService.getBatchCampaignStat(this._campaign, searchKey);
    }
  }
}
