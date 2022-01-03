import { Component, OnInit } from '@angular/core';
import { EmailQueueModel } from '../../../../../../models/mail-queue';
import { EmailService } from '../../../../../../services/email/email.service';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { Table } from '@umius/umi-common-component/models';
import { SidebarInterface } from '../../../../../sidebars/interfaces/sidebar-interface';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-email-queue',
  templateUrl: 'admin-emails-queue.component.html',
})
export class AdminEmailQueueComponent implements OnInit {

  private _queueList: { mailqueues: Array<EmailQueueModel>, _metadata: any } = {
    mailqueues: [],
    _metadata: {}
  };

  private _config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _tableInfos: Table;
  private _more: SidebarInterface = {};
  sidebarState = new Subject<string>();
  private _currentQueue: EmailQueueModel = null;

  constructor(private _emailService: EmailService,
              private _notificationsService: TranslateNotificationsService) {
  }

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
      .pipe(first())
      .subscribe((queue: any) => {
          this._queueList = queue;

          this._tableInfos = {
            _selector: 'admin-mailgun',
            _title: 'batch(s)',
            _content: this._queueList.mailqueues,
            _total: this._queueList._metadata.totalCount,
            _isSearchable: true,
            _isTitle: true,
            _isPaginable: true,
            _clickIndex: 1,
            _columns: [
              {
                _attrs: ['payload.metadata.campaignName'],
                _name: 'CAMPAIGNS.CAMPAIGN-NAME',
                _type: 'TEXT',
                _isSearchable: true
              },
              {_attrs: ['payload.queueSize'], _name: 'COMMON.PROFESSIONALS', _type: 'TEXT', _isSearchable: true},
              {
                _attrs: ['status'], _name: 'COMMON.STATUS', _type: 'MULTI-CHOICES', _isSearchable: true,
                _choices: [
                  {_name: 'QUEUED', _alias: 'Queued', _class: 'label is-draft'},
                  {_name: 'PROCESSING', _alias: 'Processing', _class: 'label is-progress'},
                  {_name: 'CANCELED', _alias: 'Canceled', _class: 'label is-secondary'},
                  {_name: 'DONE', _alias: 'Done', _class: 'label is-success'}
                ]
              }
            ]
          };
        },
        (error: any) => this._notificationsService.error('ERROR', error.message)
      );
  }

  private _stopBatch(batch: any): void {
    this._emailService.stopBatch(batch._id)
      .pipe(first())
      .subscribe((result: any) => {
        if (result && result.status === 200) {
          batch.status = 'CANCELED';
        }
      }, (error: any) => {
        console.error(error);
      })
  }

  public changeStatus(event: Event, transaction: any) {
    event.preventDefault();
    if (transaction.status === 'PROCESSING') {
      this._stopBatch(transaction);
    }
  }

  showCampaignInfos(queueToShow: EmailQueueModel) {
    this._currentQueue = new EmailQueueModel(queueToShow);
    this._more = {
      animate_state: 'active',
      title: this.campaignName(this._currentQueue),
      type: 'showCampaignInfos',
      size: '726px'
    };
  }

  closeSidebar(value: SidebarInterface) {
    this.more.animate_state = value.animate_state;
    this.sidebarState.next(this.more.animate_state);
  }

  set config(value: any) {
    this._config = value;
    this.loadQueue(value);
  }

  get config(): any {
    return this._config;
  }

  get queueSize(): number {
    return this._queueList._metadata.totalCount || 0;
  }

  get queue() {
    return this._queueList.mailqueues;
  }

  get tableInfos() {
    return this._tableInfos;
  }

  get currentQueue(): any {
    return this._currentQueue;
  }

  get more(): SidebarInterface {
    return this._more;
  }

}
