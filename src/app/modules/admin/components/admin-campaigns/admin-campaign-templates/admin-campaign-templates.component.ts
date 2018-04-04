import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { CampaignService } from '../../../../../services/campaign/campaign.service';

@Component({
  selector: 'app-admin-campaign-templates',
  templateUrl: './admin-campaign-templates.component.html',
  styleUrls: ['./admin-campaign-templates.component.scss']
})
export class AdminCampaignTemplatesComponent implements OnInit {

  private _campaign: Campaign;

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    this._campaignService;
  }
}
