import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { RolesFrontService } from "../../../../../../services/roles/roles-front.service";

@Component({
  templateUrl: './admin-campaign-history.component.html',
  styleUrls: ['./admin-campaign-history.component.scss']
})

export class AdminCampaignHistoryComponent implements OnInit {

  private _campaign: Campaign = <Campaign>{};

  private _accessPath: Array<string> = ['projects', 'project', 'campaigns', 'campaign', 'history'];

  constructor(private _activatedRoute: ActivatedRoute,
              private _rolesFrontService: RolesFrontService) { }

  ngOnInit(): void {
    if (this._activatedRoute.snapshot.parent.data['campaign']
      && typeof this._activatedRoute.snapshot.parent.data['campaign'] !== undefined) {
      this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    }
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
