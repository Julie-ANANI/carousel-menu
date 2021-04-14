import { Component, EventEmitter, Input, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { SearchService } from '../../../../services/search/search.service';
import { Table } from '../../../table/models/table';
import { Config } from '../../../../models/config';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { RolesFrontService } from '../../../../services/roles/roles-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../services/error/error-front.service';

@Component({
  selector: 'app-sidebar-search-history',
  templateUrl: './sidebar-search-history.component.html',
  styleUrls: ['./sidebar-search-history.component.scss'],
})
export class SidebarSearchHistoryComponent {
  @Input() accessPath: Array<string> = [];

  @Input() set request(value: any) {
    this._request = value;
    this._requests = [];
    this._showChildren = false;
    if (value) {
      this._searchService
        .getRecycleData(value._id)
        .pipe(first())
        .subscribe((result: any) => {
          this._lastTimeUsed = result.date;
        });
    }
  }

  @Output() paramsChange = new EventEmitter<any>();

  @Output() close = new EventEmitter<any>();

  private _request: any = null;

  private _lastTimeUsed = 'N/A';

  private _requests: Array<any> = [];

  private _total = -1;

  private _showChildren = false;

  private _tableInfos: Table = <Table>{};

  private _config: Config = {
    fields: 'created country status countries flag totalResults results',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }',
  };

  constructor(
    private _searchService: SearchService,
    private _rolesFrontService: RolesFrontService,
    private _translateNotificationsService: TranslateNotificationsService
  ) {}

  public getChildren() {
    this._showChildren = !this._showChildren;

    if (!this._requests.length) {
      this._initTable();

      this._searchService
        .getRequests({
          motherRequest: this._request._id,
          region: '',
          fields:
            'entity keywords created country elapsedTime status cost flag campaign motherRequest ' +
            'totalResults metadata results',
        })
        .pipe(first())
        .subscribe(
          (result: any) => {
            if (result.requests) {
              this._requests = result.requests.map((request: any) => {
                request.pros =
                  (request.results.person.length || request.totalResults || 0) +
                  ' pros';
                return request;
              });
            }
            this._initTable();
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorMessage(err.status)
            );
            console.error(err);
          }
        );
    }
  }

  private _initTable() {
    this._tableInfos = {
      _selector: 'admin-sidebar-search-history-limit',
      _title: 'searches',
      _content: this._requests,
      _total: this._total,
      _clickIndex: this.canAccess(['view', 'results']) ? 1 : null,
      _isPaginable: true,
      _isSelectable: true,
      _isTitle: true,
      _isLocal: true,
      _isNoMinHeight: this._total < 11,
      _buttons: [
        {
          _icon: 'fas fa-times',
          _label: 'Stop the requests',
          _colorClass: 'text-alert',
          _isHidden: !this.canAccess(['stop', 'requests']),
        },
        {
          _icon: 'fas fa-times',
          _label: 'Cancel the requests',
          _isHidden: !this.canAccess(['cancel', 'requests']),
        },
        {
          _icon: 'fas fa-hourglass-half',
          _label: 'Put back in queue',
          _isHidden: !this.canAccess(['putBackInQueue']),
        },
      ],
      _columns: [
        {
          _attrs: ['pros'],
          _name: 'Pros',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'pros']),
        },
        {
          _attrs: ['country'],
          _name: 'Country',
          _type: 'COUNTRY',
          _isHidden: !this.canAccess(['tableColumns', 'targeting']),
        },
        {
          _attrs: ['status'],
          _name: 'Status',
          _type: 'MULTI-CHOICES',
          _isHidden: !this.canAccess(['tableColumns', 'status']),
          _choices: [
            { _name: 'DONE', _alias: 'Done', _class: 'label is-success' },
            {
              _name: 'PROCESSING',
              _alias: 'Processing',
              _class: 'label is-progress',
            },
            { _name: 'QUEUED', _alias: 'Queued', _class: 'label is-danger' },
            {
              _name: 'CANCELED',
              _alias: 'Canceled',
              _class: 'label is-danger',
            },
          ],
        },
        {
          _attrs: ['flag'],
          _name: 'Email status',
          _type: 'MULTI-CHOICES',
          _isHidden: !this.canAccess(['tableColumns', 'emailStatus']),
          _choices: [
            {
              _name: 'PROS_ADDED',
              _alias: 'Pros added',
              _class: 'label is-success',
            },
            {
              _name: 'EMAILS_FOUND',
              _alias: 'Found',
              _class: 'label is-success',
            },
            {
              _name: 'EMAILS_SEARCHING',
              _alias: 'Searching',
              _class: 'label is-progress',
            },
            {
              _name: 'EMAILS_QUEUED',
              _alias: 'Queued',
              _class: 'label is-danger',
            },
          ],
        },
      ],
    };
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(
      this.accessPath.concat(path)
    );
  }

  private static _getRequestIndex(
    requestId: string,
    array: Array<any>
  ): number {
    for (const request of array) {
      if (requestId === request._id) {
        return array.indexOf(request);
      }
    }
  }

  public onClickActions(value: any) {
    const requestsIds = value._rows.map((r: any) => r._id);

    if (value._action === 'Cancel the requests') {
      this._searchService
        .cancelManyRequests(requestsIds)
        .pipe(first())
        .subscribe(
          (_: any) => {
            requestsIds.forEach((requestId: string) => {
              this._requests[
                SidebarSearchHistoryComponent._getRequestIndex(
                  requestId,
                  this._requests
                )
              ].status = 'CANCELED';
            });
            this._translateNotificationsService.success(
              'Success',
              'The requests have been cancelled.'
            );
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorMessage(err.status)
            );
            console.error(err);
          }
        );
    } else if (value._action === 'Put back in queue') {
      this._searchService
        .queueManyRequests(requestsIds)
        .pipe(first())
        .subscribe(
          (_: any) => {
            requestsIds.forEach((requestId: string) => {
              const request = this._requests[
                SidebarSearchHistoryComponent._getRequestIndex(
                  requestId,
                  this._requests
                )
              ];
              if (request.status != 'DONE') request.status = 'QUEUED';
            });
            this._translateNotificationsService.success(
              'Success',
              'The queries have been put on hold.'
            );
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorMessage(err.status)
            );
            console.error(err);
          }
        );
    } else if (value._action === 'Stop the requests') {
      this._searchService
        .stopManyRequests(requestsIds)
        .pipe(first())
        .subscribe(
          (_: any) => {
            requestsIds.forEach((requestId: string) => {
              const request = this._requests[
                SidebarSearchHistoryComponent._getRequestIndex(
                  requestId,
                  this._requests
                )
              ];
              request.status = 'DONE';
            });
            this._translateNotificationsService.success(
              'Success',
              'The requests have been stopped.'
            );
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorMessage(err.status)
            );
            console.error(err);
          }
        );
    }
  }

  public goToRequest(request: any) {
    window.open(`user/admin/search/results/${request._id}`, '_blank');
  }

  get campaignLink(): string {
    return this._request['campaign'] && this._request['innovation']
      ? `/user/admin/projects/project/${this._request['innovation']}/preparation/campaigns/campaign/${this._request['campaign']}/batch`
      : '';
  }

  get showChildren(): boolean {
    return this._showChildren;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
  }

  get request(): any {
    return this._request;
  }

  get lastTimeUsed(): string {
    return this._lastTimeUsed;
  }
}
