import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from '../../../../../services/email/email.service';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { Campaign } from '../../../../../models/campaign';

@Component({
  selector: 'app-admin-batch-information',
  templateUrl: 'admin-batch-information.component.html',
  styleUrls: ['admin-batch-information.component.scss']
})
export class AdminBatchInformationComponent implements OnInit {

  private _batch: any = {};
  private _recipients: Array<any> = [];
  private _campaign: Campaign = null;

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _emailService: EmailService) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      const batchId = params['batchId'];
      this._emailService.getBatch(batchId)
        .first()
        .subscribe(batch => {
          console.log(batch);
          this._batch = batch.mailqueues[0];
          this._recipients = this._batch.payload.recipients;
          this._campaignService.get(this._batch.payload.metadata.campaign_id)
            .first()
            .subscribe(campaign => this._campaign = campaign, error => { console.log(error)});
        }, error => {
          console.error(error); // notify error
        });
    });
  }

  get batch() { return this._batch; }
  get campaign() { return this._campaign; }
  get recipients(): Array<any> { return this._recipients; }
}
