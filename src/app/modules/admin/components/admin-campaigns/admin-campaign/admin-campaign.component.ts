import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';


@Component({
  selector: 'app-admin-campaign',
  templateUrl: './admin-campaign.component.html',
  styleUrls: ['./admin-campaign.component.scss']
})
export class AdminCampaignComponent implements OnInit {

  private _campaign: Campaign;
  private _tabs = ['details', 'history', 'search', 'pros', 'answers'];

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.data['campaign'];
  }

  get baseUrl(): any { return `/admin/campaigns/campaign/${this._campaign._id}/`; }
  get campaign(): any { return this._campaign; }
  get tabs(): any { return this._tabs; }
}
