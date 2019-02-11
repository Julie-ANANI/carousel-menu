import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { AuthService } from '../../../../../../services/auth/auth.service';

@Component({
  selector: 'app-admin-campaign',
  templateUrl: './admin-campaign.component.html',
  styleUrls: ['./admin-campaign.component.scss']
})

export class AdminCampaignComponent implements OnInit {

  private _campaign: Campaign;

  private _tabs = ['search', 'history', 'pros', 'quiz', 'workflows', 'batch', 'answers'];

  private _selectedTab = 'answers';

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.data['campaign'];

    if (this._campaign.stats) {
      this._campaign.stats.nbPros = this._campaign.stats.campaign ? this._campaign.stats.campaign.nbProfessionals || 0 : 0;
      this._campaign.stats.nbProsSent = this._campaign.stats.mail ? this._campaign.stats.mail['totalPros'] || 0 : 0;
      this._campaign.stats.nbProsOpened = this._campaign.stats.mail && this._campaign.stats.mail['statuses'] ? this._campaign.stats.mail['statuses']['opened'] || 0 : 0;
      this._campaign.stats.nbProsClicked = this._campaign.stats.mail && this._campaign.stats.mail['statuses'] ? this._campaign.stats.mail['statuses']['clicked'] || 0 : 0;
    }

  }


  getHeading(): string {
    let value;

    switch (this._selectedTab) {

      case 'search' || 'history':
        value = 'Search';
        break;

      case 'batch':
        value = 'Batch';
        break;

      case 'quiz':
        value = 'Quiz';
        break;

      case 'history':
        value = 'Search';
        break;

      case 'workflows':
        value = 'Workflows';
        break;

      case 'answers':
        value = 'Insights';
        break;

      case 'pros':
        value = 'Insights';
        break;
    }

    return value;

  }


  onClickTab(event: Event, tab: string) {
    event.preventDefault();
    this._selectedTab = tab;
  }


  get authorizedTabs(): Array<string> {
    const adminLevel = this.authService.adminLevel;

    if(adminLevel > 2) {
      return this.tabs;
    } else {
      return ['answers'];
    }

  }

  get baseUrl(): any {
    return `/user/admin/campaigns/campaign/${this._campaign._id}/`;
  }

  get campaign(): any {
    return this._campaign;
  }

  get tabs(): any {
    return this._tabs;
  }

  get selectedTab(): string {
    return this._selectedTab;
  }

}
