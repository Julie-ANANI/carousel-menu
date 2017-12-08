import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { EmailService } from './../../../../services/email/email.service';
import { EmailQueueModel } from '../../../../models/mail.queue.model';

@Component({
  selector: 'app-admin-emails',
  templateUrl: './admin-emails.component.html',
  styleUrls: ['./admin-emails.component.scss']
})
export class AdminEmailsComponent implements OnInit {

  private _queueList: {mailqueues: Array<EmailQueueModel>, _metadata: any} = {
    mailqueues: [],
    _metadata: {}
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _emailService: EmailService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe(() => {

      this._emailService.getQueue({summarize: true})
        .subscribe(queue => {
          this._queueList = queue;
          console.log('yay!');
        },
        error => this._notificationsService.error('ERROR', error.message)
      );
    });
  }

  get queueSize(): number {
    return this._queueList._metadata.totalCount || 0;
  }

  get queue() {
    return this._queueList.mailqueues;
  }

}
