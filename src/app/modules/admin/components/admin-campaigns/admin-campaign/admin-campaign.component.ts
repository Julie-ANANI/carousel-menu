import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { AuthService } from '../../../../../services/auth/auth.service';


@Component({
  selector: 'app-admin-campaign',
  templateUrl: './admin-campaign.component.html',
  styleUrls: ['./admin-campaign.component.scss']
})
export class AdminCampaignComponent implements OnInit {

  private _campaign: Campaign;
  private _tabs = ['details', 'history', 'search', 'pros', 'answers', 'mails', 'templates'];

  constructor(private _activatedRoute: ActivatedRoute,
              private _notificationsService: TranslateNotificationsService,
              private _campaignService: CampaignService,
              private _authService: AuthService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.data['campaign'];
    this.computeStats();
  }

  public ratio(value1: number, value2: number): any {
    if (value2 == 0) {
      return value1 == 0 ? 0 : '?';
    } else {
      return Math.round(100 * value1 / value2);
    }
  };

  public computeStats() {
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
  }

  public autorizedActions(level: number): boolean {
    const adminLevel = this._authService.adminLevel;
    return adminLevel > level;
  }

  public updateStats() {
    this._campaignService.updateStats(this._campaign._id)
      .first()
      .subscribe(stats => {
        this._campaign.stats = stats;
        this.computeStats();
      }, error => {
        this._notificationsService.error('ERROR', error.message);
      });
  };

  get authorizedTabs(): Array<string> {
    const adminLevel = this._authService.adminLevel;
    if(adminLevel > 2) {
      return this.tabs;
    } else {
      return ['answers'];
    }
  }

  get baseUrl(): any { return `/admin/campaigns/campaign/${this._campaign._id}/`; }
  get campaign(): any { return this._campaign; }
  get tabs(): any { return this._tabs; }
}
