import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CampaignService } from '../../../../../services/campaign/campaign.service';
import { EmailQueueModel } from '../../../../../models/mail.queue.model';
import { EmailService } from '../../../../../services/email/email.service';

@Component({
  selector: 'app-admin-email-queue',
  templateUrl: 'admin-emails-queue.component.html',
  styleUrls: ['admin-emails-queue.component.scss']
})
export class AdminEmailQueueComponent {

  @Input() queue: Array<EmailQueueModel>;

  private subscriptions = [];

  constructor(private _activatedRoute: ActivatedRoute,
              private _campaignService: CampaignService,
              private _emailService: EmailService) { }

  public campaignName(transaction: any): string {
    return transaction.payload.metadata.campaignName;
  }

  public batchSize(transaction: any): number {
    return transaction.payload.queueSize || 0;
  }

  private _stopBatch(batch: any): void {
    this._emailService.stopBatch(batch._id)
      .first()
      .subscribe((result) => {
        if (result && result.status === 200) {
          batch.status = 'CANCELED';
        }
        console.log(result);
      }, (error) => {
        console.error(error);
      })
  }

  public changeStatus(transaction: any) {
    if (transaction.status === 'PROCESSING') {
      this._stopBatch(transaction);
    }
  }

}
