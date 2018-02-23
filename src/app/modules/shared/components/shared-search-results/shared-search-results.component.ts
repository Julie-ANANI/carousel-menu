import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../models/campaign';
import { SearchService } from '../../../../services/search/search.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { DownloadService } from '../../../../services/download/download.service';

@Component({
  selector: 'app-shared-search-results',
  templateUrl: './shared-search-results.component.html',
  styleUrls: ['./shared-search-results.component.scss']
})
export class SharedSearchResultsComponent implements OnInit {

  @Input() public campaign: Campaign;

  private _request: any;
  private _selection: any;
  public config: any = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    },
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _authService: AuthService,
              private _searchService: SearchService,
              private _downloadService: DownloadService) {}

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

  updateSelection(value: any) {
    this._selection = value;
  }

  getSelection(): any {
    const params: any = {
      user: this._authService.getUserInfo(),
      query: {
        motherRequestId: this._request._id
      }
    };
    if (this._selection.pros != 'all') {
      const prosWithoutEmail = this._selection.pros.map((person: any) => {
        return {
          id: person._id,
          requestId: this._request._id,
          email: person.email || ''
        };
      }).filter((p: any) => p.email === '');
      params.persons = prosWithoutEmail;
    } else {
      params.all = true;
      params.requestId = this._request._id;
      params.query = this._selection.query;
      params.query.motherRequestId = this._request._id;
      //FIXME: pour différencier l'ancienne interface de la nouvelle, à supprimer quand on supprime la vieille interface
      params.query.newInterface = true;
    }
    return params;
  }

  searchMails() {
    const params = this.getSelection();
    if (this._request.country) {
      params.country = this._request.country;
    }
    this._searchService.searchMails(params).first().subscribe(result => {
      console.log(result);
    });
  }

  addToCampaign() {
    //TODO
  }

  exportProsCSV() {
    const params = this.getSelection();

    this._searchService.export(params.requestId, params).first().subscribe((result: any) => {
      this._downloadService.saveCsv(result.csv, this.request.keywords[0].original);
    });
  }
  get totalSelected () { return this._selection && this._selection.total || 0};
  get request() { return this._request; }
}
