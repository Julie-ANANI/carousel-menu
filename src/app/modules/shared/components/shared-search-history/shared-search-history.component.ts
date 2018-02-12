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
  private _total = 0;
  private _config = {
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
    this._searchService.getHistory(this._config)
      .first()
      .subscribe(result => {
      this._requests = result.requests;
      if (result._metadata) {
        this._total = result._metadata.totalCount;
      }
    });
  }

  public buildImageUrl(country: any): string {
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
