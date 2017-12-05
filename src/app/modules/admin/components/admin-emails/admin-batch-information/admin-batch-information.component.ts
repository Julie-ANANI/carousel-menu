import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { EmailService } from '../../../../../services/email/email.service';
import { CampaignService } from '../../../../../services/campaign/campaign.service';


@Component({
  selector: 'app-admin-batch-information',
  templateUrl: 'admin-batch-information.component.html',
  styleUrls: ['admin-batch-information.component.scss']
})
export class AdminBatchInformationComponent implements OnInit, OnDestroy {

  private _batch: any = {};
  private _recipients: Array<any> = [];

  constructor(private _activatedRoute: ActivatedRoute,
              private _notificationsService: NotificationsService,
              private _campaignService: CampaignService,
              private _emailService: EmailService,) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      const batchId = params['batchId'];
      this._emailService.getBatch(batchId)
        .subscribe(batch=>{
          console.log(batch);
          this._batch = batch.mailqueues[0];
          this._recipients = this._batch.payload.recipients;
        }, error=>{
          console.error(error);//notify error
        });
    });
  }

  ngOnDestroy() {

  }

  get batch(): any {
    return this._batch;
  }


  get recipients(): Array<any> {
    return this._recipients;
  }
}
