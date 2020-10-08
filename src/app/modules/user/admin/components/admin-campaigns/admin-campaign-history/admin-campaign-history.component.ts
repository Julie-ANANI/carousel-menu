import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { RolesFrontService } from "../../../../../../services/roles/roles-front.service";
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';

@Component({
  templateUrl: './admin-campaign-history.component.html',
  styleUrls: ['./admin-campaign-history.component.scss']
})

export class AdminCampaignHistoryComponent implements OnInit {

  private _campaign: Campaign = <Campaign>{};

  private _accessPath: Array<string> = ['projects', 'project', 'campaigns', 'campaign', 'history'];

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignFrontService: CampaignFrontService,
              private _rolesFrontService: RolesFrontService) { }

  ngOnInit(): void {
    this._activatedRoute.data.subscribe((data) => {
      if (data['campaign']) {
        this._campaign = data['campaign'];
        this._campaignFrontService.setActiveCampaign(this._campaign);
        this._campaignFrontService.setActiveCampaignTab('history');
        this._campaignFrontService.setLoadingCampaign(false);
      }
    });
  }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
  }

  get campaign(): Campaign {
    return this._campaign;
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

}
