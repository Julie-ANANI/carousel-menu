import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { CampaignService } from '../../../../services/campaign/campaign.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateNotificationsService } from "../../../../services/notifications/notifications.service";
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-admin-campaigns',
  templateUrl: './admin-campaigns.component.html',
  styleUrls: ['./admin-campaigns.component.scss']
})
export class AdminCampaignsComponent implements OnInit {

  private _innovation: any;
  private _newCampaign: any;
  private _campaigns = [];

  constructor(private _activatedRoute: ActivatedRoute,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _notificationsService: TranslateNotificationsService,
              private _titleService: TranslateTitleService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._innovation =  this._activatedRoute.snapshot.data['innovation'];
    this._innovationService.campaigns(this._innovation._id)
      .subscribe(campaigns => {
          console.log(campaigns);
          this._campaigns = campaigns.result;
        },
        error => this._notificationsService.error('ERROR', error.message)
      );
  }

  public newCampaign(cloneInfo?) {
    let newTitle = '';
    if (this._innovation && this._innovation.name) {
      newTitle = this._innovation.name;
    }
    if (!newTitle) { newTitle = 'Nouvelle campagne'; }
    if (cloneInfo && cloneInfo.title) { newTitle = cloneInfo.title; }

    this._newCampaign = {
      'domain': environment.domain,
      'innovation' : this._innovation.id,
      'user'      : this._innovation.owner.id,
      'title'     : (this._campaigns.length + 1) + '. ' + newTitle
    };

    if (cloneInfo && cloneInfo.searchCriteria && cloneInfo.settings) {
      this._newCampaign.searchCriteria = cloneInfo.searchCriteria;
      this._newCampaign.settings = cloneInfo.settings;
      this._newCampaign.searchCriteria.clonedInfo = true;
      this._newCampaign.settings.clonedInfo = true;
    }

    this._campaignService.create(this._newCampaign).subscribe(() => {
      this._notificationsService.success('SUCCESS', 'SUCCESS');
    }, error => {
      this._notificationsService.error('ERROR', error.message);
    });
  }

  get campaigns(): Array<any> {
    return this._campaigns;
  }

  public updateStats(campaign) {
    this._campaignService.updateStats(campaign._id)
        .subscribe(stats => {
          campaign.stats = stats;
        }, error => {
          this._notificationsService.error('ERROR', error.message);
        });
};
}
