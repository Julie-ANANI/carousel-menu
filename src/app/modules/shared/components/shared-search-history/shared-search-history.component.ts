import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { first } from 'rxjs/operators';
import { Config } from "../../../../models/config";
import { Table } from '../../../table/models/table';

@Component({
  selector: 'app-shared-search-history',
  templateUrl: './shared-search-history.component.html',
  styleUrls: ['./shared-search-history.component.scss']
})
export class SharedSearchHistoryComponent implements OnInit {

  @Input() campaignId: string;
  @Input() status: string;
  @Input() mails: boolean;


  private _tableInfos: Table;
  private _paused = false;
  private _requests: Array<any> = [];
  private _total = 0;
  private _googleQuota = 30000;
  private _config: Config = {
    fields: 'entity keywords oldKeywords created country elapsedTime status cost flag campaign motherRequest totalResults metadata results',
    limit: "10",
    offset: "0",
    search: "{}",
    sort: '{ "created": -1 }'
  };

  constructor(private _searchService: SearchService) {}

  ngOnInit(): void {
    // On récupère le quota Google
    this.getGoogleQuota();
    if (this.campaignId) {
      this._config.campaign = this.campaignId;
    }
    if (this.mails) {
      this.config.entity = 'MAIL_ADDRESS';
    } else {
      if (this.status) {
        this.config.entity = 'PERSON';
      } else {
        this.config.motherRequest = 'null';
      }
    }
    if (this.status) {
      this.config.status = this.status;
    }
    this.loadHistory();
  }

  public loadHistory() {
    this._searchService.getRequests(this._config)
      .pipe(first())
      .subscribe((result: any) => {
        if(result.requests) {
          this._requests = result.requests.map((request: any) => {
            request.keywords = request.keywords || request.oldKeywords[0].original;
            return request;
          });
        }
        if (result._metadata) {
          this._total = result._metadata.totalCount;
          this._paused = result._metadata.paused;
        }

        this._tableInfos = {
          _selector: 'admin-search-history-limit',
          _title: 'SEARCH.HISTORY.SEARCHES',
          _content: this._requests,
          _total: this._total,
          _editIndex: 1,
          _isSearchable: true,
          _isPaginable: true,
          _isTitle: true,
          _columns: [
            {_attrs: ['keywords'], _name: 'SEARCH.HISTORY.KEYWORDS', _type: 'TEXT', _isSearchable: true, _isSortable: false},
            {_attrs: ['country'], _name: 'SEARCH.COUNTRY', _type: 'COUNTRY', _enableTooltip: false},
            {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE', _isSortable: true},
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

  public relaunchRequests() {
    this._searchService.relaunchRequests().pipe(first()).subscribe((_: any) => {
      this.loadHistory();
    });
  }

  public getGoogleQuota() {
    this._searchService.dailyStats().pipe(first()).subscribe((result: any) => {
      this._googleQuota = 30000;
      if (result.hours) {
        this._googleQuota -= result.hours.slice(7).reduce((sum: number, hour: any) => sum + hour.googleQueries, 0)
      }
    });
  }

  public getChildren (request: any) {
    if (!request.loaded) {
      this._searchService.getRequests({
        'motherRequest': request._id,
        'region': '',
        'fields': 'entity keywords oldKeywords created country elapsedTime status cost flag campaign motherRequest totalResults metadata results'
      })
        .pipe(first())
        .subscribe((children: any) => {
          request.request = children.requests;
          request.loaded = true;
        });
    }
    request.show = !request.show;
  };

  public stopRequest (requestId: string) {
    this._searchService.stopRequest(requestId).pipe(first()).subscribe((res: any) => {
      this._requests[this._getRequestIndex(requestId, this._requests)].status = 'DONE';
    });
  }

  public stopChildRequest (requestId: string, motherRequestId: string) {
    this._searchService.stopRequest(requestId).pipe(first()).subscribe((res: any) => {
      const motherRequestIndex = this._getRequestIndex(motherRequestId, this._requests);
      const childRequestIndex = this._getRequestIndex(requestId, this._requests[motherRequestIndex].request);
      this._requests[motherRequestIndex].request[childRequestIndex].status = 'DONE';
    });
  }

  public cancelRequest (requestId: string, cancel: boolean) {
    const newStatus = cancel ? 'CANCELED' : 'QUEUED';
    this._searchService.cancelRequest(requestId, cancel).pipe(first()).subscribe((res: any) => {
      this._requests[this._getRequestIndex(requestId, this._requests)].status = newStatus;
    });
  }

  public cancelChildRequest (requestId: string, motherRequestId: string, cancel: boolean) {
    const newStatus = cancel ? 'CANCELED' : 'QUEUED';
    this._searchService.cancelRequest(requestId, cancel).pipe(first()).subscribe((res: any) => {
      const motherRequestIndex = this._getRequestIndex(motherRequestId, this._requests);
      const childRequestIndex = this._getRequestIndex(requestId, this._requests[motherRequestIndex].request);
      this._requests[motherRequestIndex].request[childRequestIndex].status = newStatus;
    });
  }

  private _getRequestIndex(requestId: string, array: Array<any>): number {
    for (const request of array) {
      if (requestId === request._id) {
        return array.indexOf(request);
      }
    }
  }

  getTotalCost() {
    let totalCost = 0;
    if (this._requests) {
      for (const cost of this._requests) {
        if (cost.cost) {
          totalCost += cost.cost.totalCost;
        }
      }
    }
    return totalCost.toFixed(2);
  }

  get requests(): Array<any> { return this._requests; }
  get total(): number { return this._total; }
  get googleQuota(): number { return this._googleQuota; }
  get config(): Config { return this._config; }
  set config(value: Config) {
    this._config = value;
    this.loadHistory();
  }
  get paused(): boolean { return this._paused; }
  get tableInfos(): Table { return this._tableInfos; }
}
