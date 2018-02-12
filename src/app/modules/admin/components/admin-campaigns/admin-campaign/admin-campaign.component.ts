import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';


@Component({
  selector: 'app-admin-campaign',
  templateUrl: './admin-campaign.component.html',
  styleUrls: ['./admin-campaign.component.scss']
})
export class AdminCampaignComponent implements OnInit {

  private _campaign: Campaign;
  private _tabs = ['details', 'history', 'search', 'pros', 'answers'];
  private _currentPage = 'details';

  constructor(private _activatedRoute: ActivatedRoute,
              private _router: Router) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.data['campaign'];
    const url = this._router.routerState.snapshot.url.split('/');
    if (url && url[5]) {
      this._currentPage = url[5];
    }
  }

  get baseUrl(): any { return `/admin/campaigns/campaign/${this._campaign._id}/`; }
  get campaign(): any { return this._campaign; }
  get tabs(): any { return this._tabs; }
  get currentPage() { return this._currentPage; }
}
