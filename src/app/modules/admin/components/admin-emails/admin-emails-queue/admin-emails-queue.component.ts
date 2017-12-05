import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { EmailQueueModel } from '../../../../../models/mail.queue.model';

@Component({
  selector: 'app-admin-email-queue',
  templateUrl: 'admin-emails-queue.component.html',
  styleUrls: ['admin-emails-queue.component.scss']
})
export class AdminEmailQueueComponent implements OnInit, OnDestroy {

  @Input() queue: Array<EmailQueueModel>;

  private subscriptions = [];

  constructor(private _activatedRoute: ActivatedRoute,
              private _notificationsService: NotificationsService,
              private _campaignService: CampaignService) { }

  ngOnInit() {
    console.log(this.queue);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subs=>{
      subs.unsbscribe();
    })
  }

  public campaignName(transaction: any): string {
    return transaction.payload.metadata.campaign_id
  }

  public batchSize(transaction: any): number {
    return transaction.payload.queueSize || 0;
  }

}
