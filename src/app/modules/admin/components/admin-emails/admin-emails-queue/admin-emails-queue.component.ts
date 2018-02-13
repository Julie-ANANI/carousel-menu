import { Component, Input } from '@angular/core';
import { EmailQueueModel } from '../../../../../models/mail.queue.model';
import { EmailService } from '../../../../../services/email/email.service';

@Component({
  selector: 'app-admin-email-queue',
  templateUrl: 'admin-emails-queue.component.html',
  styleUrls: ['admin-emails-queue.component.scss']
})
export class AdminEmailQueueComponent {

  @Input() queue: Array<EmailQueueModel>;

  constructor(private _emailService: EmailService) { }

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
      }, (error) => {
        console.error(error);
      })
  }

  public changeStatus(event: Event, transaction: any) {
    event.preventDefault();
    if (transaction.status === 'PROCESSING') {
      this._stopBatch(transaction);
    }
  }

}
