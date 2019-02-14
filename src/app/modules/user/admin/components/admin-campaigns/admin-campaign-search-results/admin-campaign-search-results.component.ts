import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';

@Component({
  selector: 'app-admin-campaign-search-results',
  templateUrl: './admin-campaign-search-results.component.html',
  styleUrls: ['./admin-campaign-search-results.component.scss']
})
export class AdminCampaignSearchResultsComponent implements OnInit {
  
  private _campaign: Campaign;

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
  }

  get campaign(): Campaign { return this._campaign; }
}
