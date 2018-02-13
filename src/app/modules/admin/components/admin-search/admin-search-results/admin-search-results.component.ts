import { Component, OnInit, Input } from '@angular/core';
import { SearchService } from '../../../../../services/search/search.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-search-results',
  templateUrl: './admin-search-results.component.html',
  styleUrls: ['./admin-search-results.component.scss']
})
export class AdminSearchResultsComponent implements OnInit {

  @Input() campaign: any;

  private _request: any;

  constructor(private _activatedRoute: ActivatedRoute,
              private _searchService: SearchService,
              private _authService: AuthService) {}

  ngOnInit(): void {
    this._request = this._activatedRoute.snapshot.data['request'];
    console.log(this._request);
  }

  public buildImageUrl(country: string): string {
    if (country) {
      return `https://res.cloudinary.com/umi/image/upload/app/${country}.png`;
    } else {
      return 'https://res.cloudinary.com/umi/image/upload/app/00.png';
    }
  }

  get results() { return this._request.results.person; }
}
