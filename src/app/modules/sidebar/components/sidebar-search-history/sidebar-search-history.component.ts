import {Component, EventEmitter, Input, Output} from '@angular/core';
import {first} from "rxjs/operators";
import { SearchService } from "../../../../services/search/search.service";
import { Table } from "../../../table/models/table";
import {Config} from "../../../../models/config";
import { TranslateNotificationsService } from "../../../../services/notifications/notifications.service";

@Component({
  selector: 'app-sidebar-search-history',
  templateUrl: './sidebar-search-history.component.html',
  styleUrls: ['./sidebar-search-history.component.scss']
})
export class SidebarSearchHistoryComponent {

  @Output() paramsChange = new EventEmitter <any>();
  @Output() close = new EventEmitter <any>();
  @Input() set request(value: any) {
    this._request = value;
    this._requests = [];
    this._showChildren = false
  }
  private _request: any;
  private _requests: Array<any> = [];
  private _total = 0;
  private _showChildren: boolean = false;
  private _tableInfos: Table;
  private _config: Config = {
    fields: 'created country status countries flag totalResults results',
    limit: "10",
    offset: "0",
    search: "{}",
    sort: '{ "created": -1 }'
  };

  constructor(private _searchService: SearchService,
              private _notificationsService: TranslateNotificationsService
  ) {}

  public getChildren () {
    if (!this._requests.length) {
      this._searchService.getRequests({
        'motherRequest': this._request._id,
        'region': '',
        'fields': 'entity keywords created country elapsedTime status cost flag campaign motherRequest totalResults metadata results'
      })
        .pipe(first())
        .subscribe((result: any) => {
          if(result.requests) {
            this._requests = result.requests.map((request: any) => {
              request.pros = (request.results.person.length || request.totalResults || 0) + " pros";
              return request;
            });
          }

          this._tableInfos = {
            _selector: 'admin-search-history-limit',
            _title: 'SEARCH.HISTORY.SEARCHES',
            _content: this._requests,
            _total: this._total,
            _editIndex: 1,
            _isSearchable: false,
            _isPaginable: false,
            _isSelectable: true,
            _isEditable: false,
            _isTitle: true,
            _isLocal: true,
            _buttons: [
              { _icon: 'fas fa-times', _label: 'SEARCH.HISTORY.CANCEL' },
              { _icon: 'fas fa-hourglass-half', _label: 'SEARCH.HISTORY.BACK_QUEUE' }
            ],
            _columns: [
              {_attrs: ['pros'], _name: '', _type: 'TEXT', _isSearchable: false, _isSortable: false},
              {_attrs: ['country'], _name: 'SEARCH.HISTORY.TARGETTING', _type: 'COUNTRY'},
              {_attrs: ['status'], _name: 'SEARCH.HISTORY.STATUS', _type: 'MULTI-CHOICES', _choices: [
                  {_name: 'DONE', _alias: 'SEARCH.HISTORY.DONE', _class: 'label is-success'},
                  {_name: 'PROCESSING', _alias: 'SEARCH.HISTORY.PROCESSING', _class: 'label is-progress'},
                  {_name: 'QUEUED', _alias: 'SEARCH.HISTORY.QUEUED', _class: 'label is-danger'},
                  {_name: 'CANCELED', _alias: 'SEARCH.HISTORY.CANCELED', _class: 'label is-danger'}
                ]},
              {_attrs: ['flag'], _name: 'SEARCH.HISTORY.FLAG', _type: 'MULTI-CHOICES', _choices: [
                  {_name: 'PROS_ADDED', _alias: 'SEARCH.HISTORY.PROS_ADDED', _class: 'label is-success'},
                  {_name: 'EMAILS_FOUND', _alias: 'SEARCH.HISTORY.EMAILS_FOUND', _class: 'label is-success'},
                  {_name: 'EMAILS_SEARCHING', _alias: 'SEARCH.HISTORY.EMAILS_SEARCHING', _class: 'label is-progress'},
                  {_name: 'EMAILS_QUEUED', _alias: 'SEARCH.HISTORY.EMAILS_QUEUED', _class: 'label is-danger'}
                ]},
            ]
          };
        });
    }
    this._showChildren = !this._showChildren;
  };

  private _getRequestIndex(requestId: string, array: Array<any>): number {
    for (const request of array) {
      if (requestId === request._id) {
        return array.indexOf(request);
      }
    }
  }

  public onClickActions(value: any) {
    const requestsIds = value._rows.map((r: any) => r._id);
    if (value._action === 'SEARCH.HISTORY.CANCEL') {
      this._searchService.cancelManyRequests(requestsIds).pipe(first()).subscribe((_: any) => {
        requestsIds.forEach((requestId : string) => {
          this._requests[this._getRequestIndex(requestId, this._requests)].status = 'CANCELED';
        });
        this._notificationsService.success('Requêtes annulées', `Les requêtes ont bien été annulées`);
      });
    } else if (value._action === 'SEARCH.HISTORY.BACK_QUEUE') {
      this._searchService.queueManyRequests(requestsIds).pipe(first()).subscribe((_: any) => {
        requestsIds.forEach((requestId : string) => {
          const request = this._requests[this._getRequestIndex(requestId, this._requests)]
          if (request.status != "DONE") request.status = 'QUEUED';
        });
        this._notificationsService.success('Requêtes mises en attente', `Les requêtes ont bien été mises en attente`);
      });
    }
  }

  public goToRequest(request: any) {
    window.open(`user/admin/search/results/${request._id}`, '_blank')
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

}

