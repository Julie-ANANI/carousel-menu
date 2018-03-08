import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';


@Component({
  selector: 'app-admin-campaign',
  templateUrl: './admin-campaign.component.html',
  styleUrls: ['./admin-campaign.component.scss']
})
export class AdminCampaignComponent implements OnInit {

  private _campaign: Campaign;
  private _tabs = ['details', 'history', 'search', 'pros', 'answers', 'mails'];

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.data['campaign'];
    
    if (this._campaign.stats) {
      for (const key in this._campaign.stats) {
        switch(key) {
          case('mail'):
            this.campaign.stats['nbProsSent'] = this._campaign.stats[key]['totalPros'] || 0;
            this.campaign.stats['nbProsOpened'] = this._campaign.stats[key]['statuses'] ? this._campaign.stats[key]['statuses']['opened'] || 0 : 0;
            this.campaign.stats['nbProsClicked'] = this._campaign.stats[key]['statuses'] ? this._campaign.stats[key]['statuses']['clicked'] || 0 : 0;
            break;
          case('answers'):
            this.campaign.stats['nbStartedAnswers'] = this._campaign.stats[key]['statusCount'] ? this._campaign.stats[key]['statusCount']['draft'] || 0 : 0;
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
            this.campaign.stats['nbPros'] = this._campaign.stats[key]['nbProfessionals'] || 0;
            this.campaign.stats['nbPros90'] = this._campaign.stats[key]['nbFirstTierMails'] || 0;
            this.campaign.stats['nbValidatedAnswers'] = this._campaign.stats[key]['nbValidatedResp'] || 0;
            this.campaign.stats['nbSubmittedAnswers'] = this._campaign.stats[key]['nbToValidateResp'] || 0;
            break;
          default:
          //Do nothing for now...
        }
      }
    }
  }

  public ratio(value1: number, value2: number): any {
    if (value2 == 0) {
      return value1 == 0 ? 0 : '?';
    } else {
      return Math.round(100 * value1 / value2);
    }
  };

  get baseUrl(): any { return `/admin/campaigns/campaign/${this._campaign._id}/`; }
  get campaign(): any { return this._campaign; }
  get tabs(): any { return this._tabs; }
}
