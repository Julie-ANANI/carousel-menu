import { Component, OnInit } from '@angular/core';
/*import { EmailQueueModel } from '../../../../../models/mail.queue.model';
import { EmailService } from '../../../../../services/email/email.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';*/

@Component({
  selector: 'app-admin-email-raw',
  templateUrl: 'admin-emails-rawlist.component.html',
  styleUrls: ['admin-emails-rawlist.component.scss']
})
export class AdminEmailRawlistComponent implements OnInit {

  /*private _queueList: {mailqueues: Array<EmailQueueModel>, _metadata: any} = {
    mailqueues: [],
    _metadata: {}
  };
  private _config = {
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };*/

  constructor(/*private _emailService: EmailService,
              private _notificationsService: TranslateNotificationsService*/) { }

  ngOnInit() {
    //this.loadQueue(this._config);
  }

  public campaignName(transaction: any): string {
    return transaction.payload.metadata.campaignName;
  }

  public batchSize(transaction: any): number {
    return transaction.payload.queueSize || 0;
  }

  public getRawMessages(config: any): void {

  }

}
