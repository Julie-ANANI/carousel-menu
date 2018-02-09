import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { Campaign } from '../../../../../models/campaign';


@Component({
  selector: 'app-admin-campaign-search',
  templateUrl: './admin-campaign-search.component.html',
  styleUrls: ['./admin-campaign-search.component.scss']
})
export class AdminCampaignSearchComponent implements OnInit {

  private _campaign: Campaign;

  constructor(private _activatedRoute: ActivatedRoute,
              private _titleService: TranslateTitleService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.data['campaign'];
  }
}
