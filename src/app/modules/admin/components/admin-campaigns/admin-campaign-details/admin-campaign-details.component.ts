import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';


@Component({
  selector: 'app-admin-campaign-details',
  templateUrl: './admin-campaign-details.component.html',
  styleUrls: ['./admin-campaign-details.component.scss']
})
export class AdminCampaignDetailsComponent implements OnInit {

  private _campaign: Campaign;

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.data['campaign'];
  }
}
