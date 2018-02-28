import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../models/campaign';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-admin-campaign-details',
  templateUrl: './admin-campaign-details.component.html',
  styleUrls: ['./admin-campaign-details.component.scss']
})
export class AdminCampaignDetailsComponent implements OnInit {

  private _campaign: Campaign;
  private _quizLinks: Array<string> = [];

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    if (this._campaign.innovation && this._campaign.innovation.quizId) {
      this._quizLinks = ['fr', 'en'].map((l) => {
        return environment.quizUrl + '/quiz/' + this._campaign.innovation.quizId + '/' + this._campaign._id + '?lang=' + l;
      });
    }
  }

  get campaign() { return this._campaign }
  get quizLinks() {return this._quizLinks }

}
