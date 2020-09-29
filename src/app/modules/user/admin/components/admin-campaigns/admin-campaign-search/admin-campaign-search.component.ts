import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { RolesFrontService } from "../../../../../../services/roles/roles-front.service";
import { takeUntil } from 'rxjs/operators';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './admin-campaign-search.component.html',
  styleUrls: ['./admin-campaign-search.component.scss']
})

export class AdminCampaignSearchComponent implements OnInit, OnDestroy {

  private _campaign: Campaign = <Campaign>{};

  private _accessPath: Array<string> = ['projects', 'project', 'campaigns', 'campaign', 'search'];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignFrontService: CampaignFrontService,
              private _rolesFrontService: RolesFrontService) { }

  ngOnInit(): void {

    if (this._activatedRoute.snapshot.parent.data['campaign']
      && typeof this._activatedRoute.snapshot.parent.data['campaign'] !== undefined) {
      this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
      this._campaignFrontService.setActiveCampaign(this._campaign);
      this._campaignFrontService.setActiveCampaignTab('search');
    }

    this._campaignFrontService.activeCampaign().pipe(takeUntil(this._ngUnsubscribe)).subscribe((campaign) => {
      if (!!campaign && this._campaign._id !== campaign._id) {
        this._campaign = campaign;
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

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
