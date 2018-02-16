import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../models/campaign';

@Component({
  selector: 'app-shared-search-results',
  templateUrl: './shared-search-results.component.html',
  styleUrls: ['./shared-search-results.component.scss']
})
export class SharedSearchResultsComponent implements OnInit {

  @Input() public campaign: Campaign;

  private _request: any;
  public config: any = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    },
  };

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this._request = this._activatedRoute.snapshot.data['request'];
  }

  public buildImageUrl(country: string): string {
    if (country) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }

  get request() { return this._request; }
}
