import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from '../../../../../../services/email/email.service';
import { CampaignService } from '../../../../../../services/campaign/campaign.service';
import { Campaign } from '../../../../../../models/campaign';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-batch-information',
  templateUrl: 'admin-batch-information.component.html',
  styleUrls: ['admin-batch-information.component.scss']
})
export class AdminBatchInformationComponent implements OnInit {

  private _batch: any = {}; // Utilisation particulière d'un batch, pas la meme semantique que lors d'une camapgne
  private _recipients: Array<any> = [];
  private _campaign: Campaign = null;

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _emailService: EmailService) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      const batchId = params['batchId'];
      this._emailService.getBatch(batchId)
        .pipe(first())
        .subscribe((batch: any) => {
          this._batch = batch.mailqueues[0];
          this._recipients = this._batch.payload.recipients;
          this._campaignService.get(this._batch.payload.metadata.campaign_id)
            .pipe(first())
            .subscribe((campaign: Campaign) => this._campaign = campaign, (error: any) => { console.log(error); });
        }, (error: any) => {
          console.error(error); // notify error
        });
    });
  }

  get batch() { return this._batch; }
  get campaign() { return this._campaign; }
  get recipients(): Array<any> { return this._recipients; }
}
