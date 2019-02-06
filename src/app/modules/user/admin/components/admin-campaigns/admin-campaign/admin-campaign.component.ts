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

  private _tabs = ['search', 'history', 'pros', 'quiz', 'templates', 'mails', 'answers'];

  private _selectedTab = 'answers';

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this._campaign = this.activatedRoute.snapshot.data['campaign'];
  }


  getHeading(): string {
    let value;

    switch (this._selectedTab) {

      case 'search' || 'history':
        value = 'Search';
        break;

      case 'mails':
        value = 'Batch';
        break;

      case 'quiz':
        value = 'Quiz';
        break;

      case 'history':
        value = 'Search';
        break;

      case 'templates':
        value = 'Batch';
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


  /*ratio(value1: number, value2: number): any {
    // don't use triple equal here, it seems sometimes value1 and 2 are not number but strings
    if (value2 == 0) {
      return value1 == 0 ? 0 : '?';
    } else {
      return Math.round(100 * value1 / value2);
    }
  };*/


  /*computeStats() {
    if (this._campaign.stats) {
      // Mail
      this._campaign.stats['nbProsSent'] = this._campaign.stats['mail'] ? this._campaign.stats['mail']['totalPros'] || 0 : 0;
      this._campaign.stats['nbProsOpened'] = this._campaign.stats['mail'] && this._campaign.stats['mail']['statuses'] ? this._campaign.stats['mail']['statuses']['opened'] || 0 : 0;
      this._campaign.stats['nbProsClicked'] = this._campaign.stats['mail'] && this._campaign.stats['mail']['statuses'] ? this._campaign.stats['mail']['statuses']['clicked'] || 0 : 0;

      // Answers
      this._campaign.stats['nbStartedAnswers'] = this._campaign.stats['answers'] && this._campaign.stats['answers']['statusCount'] ? this._campaign.stats['answers']['statusCount']['draft'] || 0 : 0;

      // Campaign
      this._campaign.stats['nbPros'] = this._campaign.stats['campaign'] ? this._campaign.stats['campaign']['nbProfessionals'] || 0 : 0;
      this._campaign.stats['nbPros90'] = this._campaign.stats['campaign'] ? this._campaign.stats['campaign']['nbFirstTierMails'] || 0 : 0;
      this._campaign.stats['nbAnswers'] = this._campaign.stats['campaign'] ? this._campaign.stats['campaign']['nbResp'] || 0 : 0;
      this._campaign.stats['nbValidatedAnswers'] = this._campaign.stats['campaign'] ? this._campaign.stats['campaign']['nbValidatedResp'] || 0 : 0;
    } else {
      this.updateStats();
    }

    console.log( this._campaign.stats );

  }*/


  /*authorizedActions(level: number): boolean {
    const adminLevel = this.authService.adminLevel;
    return adminLevel > level;
  }*/


  /*updateStats() {
    this.campaignService.updateStats(this._campaign._id).pipe(first()).subscribe((stats: any) => {
      this._campaign.stats = stats;
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.UPDATED');
      }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  };*/


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
