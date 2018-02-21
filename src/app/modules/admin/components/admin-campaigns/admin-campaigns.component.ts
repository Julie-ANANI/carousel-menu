import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { CampaignService } from '../../../../services/campaign/campaign.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { environment } from '../../../../../environments/environment';
import { Campaign } from '../../../../models/campaign';
import { Innovation } from '../../../../models/innovation';

@Component({
  selector: 'app-admin-campaigns',
  templateUrl: './admin-campaigns.component.html',
  styleUrls: ['./admin-campaigns.component.scss']
})
export class AdminCampaignsComponent implements OnInit {

  private _innovation: Innovation;
  private _newCampaign: any;
  private _campaigns: Array<Campaign> = [];

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _notificationsService: TranslateNotificationsService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    this._innovation =  this._activatedRoute.snapshot.data['innovation'];
    this._innovationService.campaigns(this._innovation._id)
      .first()
      .subscribe(campaigns => {
          this._campaigns = campaigns.result;
        },
        error => this._notificationsService.error('ERROR', error.message)
      );
  }

  public newCampaign(event: Event) {
    event.preventDefault();
    let newTitle = undefined;
    if (this._innovation && this._innovation.name) {
      newTitle = this._innovation.name;
    } else {
      newTitle = 'Nouvelle campagne';
    }

    this._newCampaign = {
      domain: environment.domain,
      innovation: this._innovation._id,
      owner: this._innovation.owner.id,
      title: (this._campaigns.length + 1) + '. ' + newTitle
    };

    this._campaignService.create(this._newCampaign).first().subscribe((c) => {
      this._notificationsService.success('SUCCESS', 'SUCCESS');
      this.campaigns.push(c);
    }, error => {
      this._notificationsService.error('ERROR', error.message);
    });
  }

  get campaigns(): Array<any> {
    return this._campaigns;
  }

  public updateStats(event: Event, campaign: Campaign) {
    event.preventDefault();
    this._campaignService.updateStats(campaign._id)
      .first()
      .subscribe(stats => {
        campaign.stats = stats;
      }, error => {
        this._notificationsService.error('ERROR', error.message);
      });
};
}
