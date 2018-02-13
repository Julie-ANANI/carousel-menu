import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../services/search/search.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Campaign } from '../../../../models/campaign';

@Component({
  selector: 'app-shared-search-pros',
  templateUrl: './shared-search-pros.component.html',
  styleUrls: ['./shared-search-pros.component.scss']
})
export class SharedSearchProsComponent implements OnInit {

  public displaySettings = false;
  private _params: any = {
    keywords: '',
    websites: {
      linkedin: true,
      viadeo: false,
      kompass: false,
      xing: false
    },
    count: '10',
    country: '',
    automated: false,
    smart: false,
    regions: false,
    indexSearch: false,
    countries: [],
    queued: false
  };

  @Input() campaign: Campaign;

  constructor(private _searchService: SearchService,
              private _authService: AuthService) {}

  ngOnInit(): void {
    if (this.campaign) {
      this._params.automated = true;
      this._params.smart = true;
      this._params.regions = true;
      this._params.queued = true;
    }
  }

  public search(event: Event): void {
    event.preventDefault();
    const searchParams = this._params;
    searchParams.name = 'people';
    searchParams.user = this._authService.getUserInfo();
    searchParams.websites = Object.keys(searchParams.websites).filter(key => searchParams.websites[key]).join(' ');
    this._searchService.search(searchParams).first().subscribe(result => {

    });
  }

  public buildImageUrl(country: string): string {
    if (country) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }

  get params(): any { return this._params; }
  set params(value: any) { this._params = value; }
}
