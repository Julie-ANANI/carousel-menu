import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';

@Component({
  selector: 'app-shared-search-history',
  templateUrl: './shared-search-history.component.html',
  styleUrls: ['./shared-search-history.component.scss']
})
export class SharedSearchHistoryComponent implements OnInit {

  @Input() campaignId: string;
  @Input() status: string;
  @Input() mails: boolean;

  private _requests: Array<any> = [];
  private _total: number = 0;
  private _config: any = {
    fields: 'entity keywords created country elapsedTime status cost flag campaign motherRequest totalResults metadata',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor(private _searchService: SearchService) {}

  ngOnInit(): void {
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
    this._searchService.getRequests(this._config)
      .first()
      .subscribe(result => {
        this._requests = result.requests;
        if (result._metadata) {
          this._total = result._metadata.totalCount;
        }
      });
  }
  
  public getChildren (request: any) {
    if (!request.loaded) {
      this._searchService.getRequests({
        'motherRequest': request._id,
        'region': '',
        'fields': 'entity keywords created country elapsedTime status cost flag campaign motherRequest totalResults metadata'
      })
        .first()
        .subscribe(children => {
          request.request = children.requests;
          request.loaded = true;
        });
    }
    request.show = !request.show;
  };

  public buildImageUrl(country: string): string {
    if (country) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }

  get requests(): Array<any> { return this._requests; }
  get total(): number { return this._total; }
  get config(): any { return this._config; }
}
