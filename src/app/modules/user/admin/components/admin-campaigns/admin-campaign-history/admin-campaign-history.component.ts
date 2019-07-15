import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../../../models/campaign';
import { TranslateTitleService } from '../../../../../../services/title/title.service';

@Component({
  selector: 'app-admin-campaign-history',
  templateUrl: './admin-campaign-history.component.html',
  styleUrls: ['./admin-campaign-history.component.scss']
})

export class AdminCampaignHistoryComponent {

  private _campaign: Campaign;

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('History | Campaign');
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];

  }

  get campaignId(): string {
    return this._campaign && this._campaign._id ? this._campaign._id : '';
  }

}
