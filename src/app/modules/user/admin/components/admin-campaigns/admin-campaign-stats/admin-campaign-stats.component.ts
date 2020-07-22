import {Component, Input} from '@angular/core';

export interface StatsInterface {
  heading: string;
  content: Array<{
    subHeading: string;
    value: string;
  }>;
}

@Component({
  selector: 'app-admin-campaign-stats',
  templateUrl: './admin-campaign-stats.component.html',
  styleUrls: ['./admin-campaign-stats.component.scss']
})

export class AdminCampaignStatsComponent {

  @Input() config: Array<StatsInterface> = [];

  constructor() { }

  /*getCampaignStat(searchKey: any): number {
    if (this._campaign) {
      return CampaignFrontService.getBatchCampaignStat(this._campaign, searchKey);
    }
  }*/

}
