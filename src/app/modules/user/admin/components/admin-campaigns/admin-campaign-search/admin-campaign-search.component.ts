import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';

@Component({
  selector: 'app-admin-campaign-search',
  templateUrl: './admin-campaign-search.component.html',
  styleUrls: ['./admin-campaign-search.component.scss']
})

export class AdminCampaignSearchComponent implements OnInit {

  private _campaign: Campaign;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.parent.data['campaign'];
  }
  
  get campaign(): Campaign {
    return this._campaign;
  }

}
