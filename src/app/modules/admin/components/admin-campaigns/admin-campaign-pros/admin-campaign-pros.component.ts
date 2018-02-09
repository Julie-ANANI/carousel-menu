import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { Professional } from '../../../../../models/professional';
import { Campaign } from '../../../../../models/campaign';

@Component({
  selector: 'app-admin-campaign-pros',
  templateUrl: './admin-campaign-pros.component.html',
  styleUrls: ['./admin-campaign-pros.component.scss']
})
export class AdminCampaignProsComponent implements OnInit {

  private _campaign: Campaign;
  private _pros: Array<Professional> = [];
  private _total = 0;
  private _config = {
    fields: 'language firstName lastName company email emailConfidence country',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _titleService: TranslateTitleService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.data['campaign'];
    this.loadPros(this._config);
  }

  loadPros(config: any): void {
    this._config = config;
    this._campaignService.getPros(this._campaign._id, this._config).subscribe(pros => {
      this._pros = pros.result;
      this._total = pros._metadata.totalCount;
    });
  }

  public buildImageUrl(country: string): string {
    if (country) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }

  set config(value: any) { this._config = value; }
  get config() { return this._config; }
  get total() { return this._total; }
  get pros() { return this._pros; }
}
