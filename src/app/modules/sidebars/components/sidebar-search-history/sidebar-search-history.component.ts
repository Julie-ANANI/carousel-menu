import { Component, EventEmitter, Input, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { SearchService } from '../../../../services/search/search.service';
import { TranslateNotificationsService } from '../../../../services/translate-notifications/translate-notifications.service';
import { RolesFrontService } from '../../../../services/roles/roles-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../services/error/error-front.service';
import { JobConfig } from '../../../../models/target-pros';
import {Table, UmiusConfigInterface} from '@umius/umi-common-component';

@Component({
  selector: 'app-sidebar-search-history',
  templateUrl: './sidebar-search-history.component.html',
})
export class SidebarSearchHistoryComponent {
  @Input() accessPath: Array<string> = [];

  @Input() set request(value: any) {
    this._request = value;
    this._requests = [];
    this._showChildren = false;
    if (value) {
      this.prepareSeniorityLevels();
      this.prepareJobsTypologies();
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

  private _seniorityLevels: any = {
    included: '',
    excluded: ''
  };

  private _includedJobCate: Array<any> = [];

  private _excludedJobCate: Array<any> = [];

  private _mixedJobCate: Array<any> = [];


  private _config: UmiusConfigInterface = {
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
  ) {
  }

  public getChildren() {
    this._showChildren = !this._showChildren;

    if (!this._requests.length) {
      this._initTable();

      this._searchService
        .getRequests({
          motherRequest: this._request._id,
          region: '',
          entity: '{"$ne": "MAIL_ADDRESS"}',
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
              this._total = this._requests.length;
            }
            this._initTable();
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorKey(err.error)
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
      _actions: [
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
            {_name: 'DONE', _alias: 'Done', _class: 'label is-success'},
            {
              _name: 'PROCESSING',
              _alias: 'Processing',
              _class: 'label is-progress',
            },
            {_name: 'QUEUED', _alias: 'Queued', _class: 'label is-danger'},
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
              ErrorFrontService.getErrorKey(err.error)
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
              if (request.status !== 'DONE') {
                request.status = 'QUEUED';
              }
            });
            this._translateNotificationsService.success(
              'Success',
              'The queries have been put on hold.'
            );
          },
          (err: HttpErrorResponse) => {
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorKey(err.error)
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
              ErrorFrontService.getErrorKey(err.error)
            );
            console.error(err);
          }
        );
    }
  }

  /**
   * prepare SeniorityLevels in side bar
   */
  prepareSeniorityLevels() {
    const included: any[] = [];
    const excluded: any[] = [];
    if (this._request.targetPros && this._request.targetPros.seniorityLevels) {
      Object.keys(this._request.targetPros.seniorityLevels).forEach(key => {
        if (this._request.targetPros.seniorityLevels[key].state === 0) {
          excluded.push(this._request.targetPros.seniorityLevels[key].name);
        } else if (this._request.targetPros.seniorityLevels[key].state === 1) {
          included.push(this._request.targetPros.seniorityLevels[key].name);
        }
      });
    }
    this._seniorityLevels = {
      included: included.toString(),
      excluded: excluded.toString()
    };
  }

  /**
   * prepare to list job typologies in side bar
   */
  prepareJobsTypologies() {
    this._includedJobCate = [];
    this._excludedJobCate = [];
    this._mixedJobCate = [];
    if (this._request.targetPros && this._request.targetPros.jobsTypologies) {
      Object.keys(this._request.targetPros.jobsTypologies).forEach(key => {
        const jobToAdd = {
          jobName: '',
          included: 0,
          excluded: 0
        };
        if (this._request.targetPros.jobsTypologies[key].state === 0) {
          jobToAdd.excluded = this._request.targetPros.jobsTypologies[key].jobs.length;
          jobToAdd.jobName = this._request.targetPros.jobsTypologies[key].name.en;
          this._excludedJobCate.push(jobToAdd);
        } else if (this._request.targetPros.jobsTypologies[key].state === 1) {
          jobToAdd.included = this._request.targetPros.jobsTypologies[key].jobs.length;
          jobToAdd.jobName = this._request.targetPros.jobsTypologies[key].name.en;
          this._includedJobCate.push(jobToAdd);
        } else if (this._request.targetPros.jobsTypologies[key].state === 3) {
          jobToAdd.included =
            this._request.targetPros.jobsTypologies[key].jobs.filter((job: JobConfig) => job.state === 1).length;
          jobToAdd.excluded =
            this._request.targetPros.jobsTypologies[key].jobs.filter((job: JobConfig) => job.state === 0).length;
          jobToAdd.jobName = this._request.targetPros.jobsTypologies[key].name.en;
          this._mixedJobCate.push(jobToAdd);
        }
      });
    }
  }

  professionalTargeting() {

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

  get config(): UmiusConfigInterface {
    return this._config;
  }

  set config(value: UmiusConfigInterface) {
    this._config = value;
  }

  get request(): any {
    return this._request;
  }

  get lastTimeUsed(): string {
    return this._lastTimeUsed;
  }


  get includedJobCate(): Array<any> {
    return this._includedJobCate;
  }

  get excludedJobCate(): Array<any> {
    return this._excludedJobCate;
  }

  get mixedJobCate(): Array<any> {
    return this._mixedJobCate;
  }

  get seniorityLevels(): any {
    return this._seniorityLevels;
  }
}
