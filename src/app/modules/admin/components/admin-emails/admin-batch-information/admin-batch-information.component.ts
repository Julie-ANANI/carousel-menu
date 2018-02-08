import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from '../../../../../services/email/email.service';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { Subscription } from 'rxjs/Subscription';
import { Campaign } from '../../../../../models/campaign';

@Component({
  selector: 'app-admin-batch-information',
  templateUrl: 'admin-batch-information.component.html',
  styleUrls: ['admin-batch-information.component.scss']
})
export class AdminBatchInformationComponent implements OnInit, OnDestroy {

  private _batch: any = {};
  private _recipients: Array<any> = [];
  private _campaign: Campaign = null;

  private _subscriptions: Array<Subscription> = [];

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _emailService: EmailService) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      const batchId = params['batchId'];
      this._emailService.getBatch(batchId)
        .subscribe(batch => {
          console.log(batch);
          this._batch = batch.mailqueues[0];
          this._recipients = this._batch.payload.recipients;
          const campaignSubscription = this._campaignService.get(this._batch.payload.metadata.campaign_id)
            .subscribe(campaign => this._campaign, error => { console.log(error)});
          this._subscriptions.push(campaignSubscription);
        }, error => {
          console.error(error); // notify error
        });
    });
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subs => {
      subs.unsubscribe();
    })
  }

  get batch() { return this._batch; }
  get campaign() { return this._campaign; }
  get recipients(): Array<any> { return this._recipients; }
}
