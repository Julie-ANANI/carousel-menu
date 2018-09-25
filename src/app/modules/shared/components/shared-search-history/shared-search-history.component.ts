import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import {PaginationTemplate} from '../../../../models/pagination';

@Component({
  selector: 'app-shared-search-history',
  templateUrl: './shared-search-history.component.html',
  styleUrls: ['./shared-search-history.component.scss']
})
export class SharedSearchHistoryComponent implements OnInit {

  @Input() campaignId: string;
  @Input() status: string;
  @Input() mails: boolean;


  private _paused = false;
  private _requests: Array<any> = [];
  private _total = 0;
  private _googleQuota = 30000;
  private _config: any = {
    fields: 'entity keywords oldKeywords created country elapsedTime status cost flag campaign motherRequest totalResults metadata results',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  private _paginationConfig: PaginationTemplate = {limit: this._config.limit, offset: this._config.offset};

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
      .first()
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
      });
  }

  configChange(value: any) {
    this._paginationConfig = value;
    this._config.limit = value.limit
    this._config.offset = value.offset;
    window.scroll(0, 0);
    this.loadHistory();
  }

  public relaunchRequests() {
    this._searchService.relaunchRequests().first().subscribe((_: any) => {
      this.loadHistory();
    });
  }

  public relaunchMailRequests() {
    this._searchService.relaunchMailRequests().first().subscribe((_: any) => {
      this.loadHistory();
    });
  }

  public getGoogleQuota() {
    this._searchService.dailyStats().first().subscribe((result: any) => {
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
        .first()
        .subscribe((children: any) => {
          request.request = children.requests;
          request.loaded = true;
        });
    }
    request.show = !request.show;
  };

  public stopRequest (requestId: string) {
    this._searchService.stopRequest(requestId).first().subscribe((res: any) => {
      this._requests[this._getRequestIndex(requestId, this._requests)].status = 'DONE';
    });
  }

  public stopChildRequest (requestId: string, motherRequestId: string) {
    this._searchService.stopRequest(requestId).first().subscribe((res: any) => {
      const motherRequestIndex = this._getRequestIndex(motherRequestId, this._requests);
      const childRequestIndex = this._getRequestIndex(requestId, this._requests[motherRequestIndex].request);
      this._requests[motherRequestIndex].request[childRequestIndex].status = 'DONE';
    });
  }

  public cancelRequest (requestId: string, cancel: boolean) {
    const newStatus = cancel ? 'CANCELED' : 'QUEUED';
    this._searchService.cancelRequest(requestId, cancel).first().subscribe((res: any) => {
      this._requests[this._getRequestIndex(requestId, this._requests)].status = newStatus;
    });
  }

  public cancelChildRequest (requestId: string, motherRequestId: string, cancel: boolean) {
    const newStatus = cancel ? 'CANCELED' : 'QUEUED';
    this._searchService.cancelRequest(requestId, cancel).first().subscribe((res: any) => {
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
  get config(): any { return this._config; }
  get paused(): boolean { return this._paused; }
  get paginationConfig(): PaginationTemplate { return this._paginationConfig; }
}
