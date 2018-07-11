import { Component, OnInit } from '@angular/core';
import { EmailQueueModel } from '../../../../../models/mail.queue.model';
import { EmailService } from '../../../../../services/email/email.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import {Table} from '../../../../shared/components/shared-table/models/table';

@Component({
  selector: 'app-admin-email-queue',
  templateUrl: 'admin-emails-queue.component.html',
  styleUrls: ['admin-emails-queue.component.scss']
})
export class AdminEmailQueueComponent implements OnInit {

  private _queueList: {mailqueues: Array<EmailQueueModel>, _metadata: any} = {
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
  };

  private _tableInfos: Table = null;

  constructor(private _emailService: EmailService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this.loadQueue(this._config);
  }

  public campaignName(transaction: any): string {
    return transaction.payload.metadata.campaignName;
  }

  public batchSize(transaction: any): number {
    return transaction.payload.queueSize || 0;
  }

  public loadQueue(config: any): void {
    this._config = config;
    this._emailService.getQueue(this._config)
      .first()
      .subscribe(queue => {
          this._queueList = queue;

          this._tableInfos = {
            _selector: 'admin-mailgun',
            _title: 'Batchs',
            _content: this._queueList.mailqueues,
            _total: this._queueList._metadata.totalCount,
            _isHeadable: true,
            _isFiltrable: true,
            _isEditable: true,
            _columns: [
              {_attrs: ['payload.metadata.campaignName'], _name: 'CAMPAIGNS.CAMPAIGN-NAME', _type: 'TEXT', _isSortable: false},
              {_attrs: ['payload.queueSize'], _name: 'COMMON.PROFESSIONALS', _type: 'TEXT', _isSortable: false},
              {_attrs: ['status'], _name: 'PROJECT_LIST.STATUS', _type: 'MULTI-CHOICES', _isSortable: false, _choices: [
                  {_name: 'QUEUED', _class: 'label-draft'},
                  {_name: 'PROCESSING', _class: 'label-progress'},
                  {_name: 'CANCELED', _class: 'label-editing'},
                  {_name: 'DONE', _class: 'label-validate'}
                ]}]
          };
        },
        error => this._notificationsService.error('ERROR', error.message)
      );
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

  set config(value: any) { this._config = value; }
  get config() { return this._config; }
  get queueSize(): number { return this._queueList._metadata.totalCount || 0; }
  get queue() { return this._queueList.mailqueues; }
  get tableInfos() { return this._tableInfos; }
}
