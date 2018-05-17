import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';

@Component({
  selector: 'app-admin-campaign-pros',
  templateUrl: './admin-campaign-pros.component.html',
  styleUrls: ['./admin-campaign-pros.component.scss']
})
export class AdminCampaignProsComponent implements OnInit {

  private _campaign: Campaign;
  private _config : any;

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    this._config = {
      fields: 'language firstName lastName company email emailConfidence country jobTitle',
      limit: 10,
      offset: 0,
      search: {},
      campaigns: this._campaign._id,
      sort: {
        created: -1
      }
    };
  }

  set config(value: any) { this._config = value; }
  get config() { return this._config; }
  get campaign() { return this._campaign; }
}
