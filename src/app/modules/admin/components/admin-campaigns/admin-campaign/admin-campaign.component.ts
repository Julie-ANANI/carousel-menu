import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';


@Component({
  selector: 'app-admin-campaign',
  templateUrl: './admin-campaign.component.html',
  styleUrls: ['./admin-campaign.component.scss']
})
export class AdminCampaignComponent implements OnInit {

  private _campaign: Campaign;
  private _tabs = ['details', 'history', 'search', 'pros', 'answers', 'mails'];

  constructor(private _activatedRoute: ActivatedRoute,
              private _notificationsService: TranslateNotificationsService,
              private _campaignService: CampaignService) { }

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
      for (const key in this._campaign.stats) {
        switch(key) {
          case('mail'):
            this._campaign.stats['nbProsSent'] = this._campaign.stats[key]['totalPros'] || 0;
            this._campaign.stats['nbProsOpened'] = this._campaign.stats[key]['statuses'] ? this._campaign.stats[key]['statuses']['opened'] || 0 : 0;
            this._campaign.stats['nbProsClicked'] = this._campaign.stats[key]['statuses'] ? this._campaign.stats[key]['statuses']['clicked'] || 0 : 0;
            break;
          case('answers'):
            this._campaign.stats['nbStartedAnswers'] = this._campaign.stats[key]['statusCount'] ? this._campaign.stats[key]['statusCount']['draft'] || 0 : 0;
            break;
          case('campaign'):
            /*
             nbProfessionals: 0,
             nbEmails: 0,
             nbFirstTierMails: 0,
             nbSecondTierMails: 0,
             elapsedTime: 0,
             nbValidatedResp: 0,
             nbToValidateResp: 0
             */
            this._campaign.stats['nbPros'] = this._campaign.stats[key]['nbProfessionals'] || 0;
            this._campaign.stats['nbPros90'] = this._campaign.stats[key]['nbFirstTierMails'] || 0;
            this._campaign.stats['nbValidatedAnswers'] = this._campaign.stats[key]['nbValidatedResp'] || 0;
            this._campaign.stats['nbSubmittedAnswers'] = this._campaign.stats[key]['nbToValidateResp'] || 0;
            break;
          default:
          //Do nothing for now...
        }
      }
    } else {
      this.campaign.stats = {
        nbPros: 0,
        nbPros90: 0,
        nbProsSent: 0,
        nbProsOpened: 0,
        nbProsClicked: 0,
        nbStartedAnswers: 0,
        nbSubmittedAnswers: 0,
        nbValidatedAnswers: 0
      }
    }
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

  get baseUrl(): any { return `/admin/campaigns/campaign/${this._campaign._id}/`; }
  get campaign(): any { return this._campaign; }
  get tabs(): any { return this._tabs; }
}
