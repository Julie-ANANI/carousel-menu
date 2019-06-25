import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';


@Component({
  selector: 'app-admin-campaign-history',
  templateUrl: './admin-campaign-history.component.html',
  styleUrls: ['./admin-campaign-history.component.scss']
})
export class AdminCampaignHistoryComponent implements OnInit {

  private _campaign: Campaign;

  constructor(private _activatedRoute: ActivatedRoute) {

    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];

  }

  ngOnInit() {
  }

  get campaignId(): string {
    return this._campaign && this._campaign._id ? this._campaign._id : '';
  }

}
