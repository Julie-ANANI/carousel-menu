import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { CampaignFrontService } from '../../../../../../services/campaign/campaign-front.service';

export interface SearchModule {
  option: string;
  context: string;
}

@Component({
  templateUrl: './admin-campaign-search.component.html',
  styleUrls: ['./admin-campaign-search.component.scss']
})

export class AdminCampaignSearchComponent implements OnInit {

  private _campaign: Campaign = <Campaign>{};

  private _accessPath: Array<string> = ['projects', 'project', 'campaigns', 'campaign', 'search'];

  private _searchModules: Array<SearchModule> = [
    {
      option: 'scraping',
      context: 'use the scraping module',
    },
    {
      option: 'research',
      context: 'use the research module',
    },
    {
      option: 'import',
      context: 'import a list of pros',
    }
  ];

  private _moduleSelected: SearchModule = {
    option: 'scraping',
    context: 'Use the scraping module',
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignFrontService: CampaignFrontService,
              private _rolesFrontService: RolesFrontService) { }

  ngOnInit(): void {
    this._activatedRoute.data.subscribe((data) => {
      if (data['campaign']) {
        this._campaign = data['campaign'];
        this._campaignFrontService.setActiveCampaign(this._campaign);
        this._campaignFrontService.setActiveCampaignTab('search');
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

  get moduleSelected(): SearchModule {
    return this._moduleSelected;
  }

  set moduleSelected(value: SearchModule) {
    this._moduleSelected = value;
  }

  get searchModules(): Array<SearchModule> {
    return this._searchModules;
  }

  moduleOnChange() {
    console.log(this._moduleSelected);
  }
}
