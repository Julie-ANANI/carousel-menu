import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';
import { Tag } from '../../../../../models/tag';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { FilterService } from './services/filter.service';
import { InnovCard } from '../../../../../models/innov-card';


@Component({
  templateUrl: './innovations.component.html',
  styleUrls: ['./innovations.component.scss'],
})

export class InnovationsComponent implements OnInit {

  private _config = {
    fields: 'created innovationCards tags status projectStatus principalMedia',
    limit: '0',
    offset: '0',
    isPublic: '1',
    $or: '[{ "status": "EVALUATING" },{ "status": "DONE" }]',
    sort: '{ "created": -1 }'
  };

  private _totalInnovations: Array<Innovation> = []; // hold all the innovations that we get from the server.

  private _recommendedInnovations: Array<Innovation> = [];

  private _latestInnovations: Array<Innovation> = [];

  private _trendingInnovations: Array<Innovation> = [];

  filteredInnovations: Array<Innovation> = [];

  private _sectorTags: Array<Tag> = []; // hold all the tags type of sector in the fetched innovations.

  private _userLang = '';

  selectedFilters: Array<Tag> = [];

  private _userAuthenticated: boolean = false;

  searchingInnovations: boolean = false;

  filterActivated: boolean = false;

  noResultFound: boolean = false;

  searchKey: string;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateTitleService: TranslateTitleService,
              private _translateService: TranslateService,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _authService: AuthService,
              private _filterService: FilterService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.DISCOVER');

    this._totalInnovations = this._activatedRoute.snapshot.data.innovations;

    this._recommendedInnovations = this._totalInnovations.slice(4, 8); //temp

    this._activatedRoute.queryParams.subscribe(params => {
      if (params['innovation']) {
        this._applyInnoRecommendation(params['innovation']);
      }
    });

    this._getLatestInnovations();

    this._getTrendingInnovations();

    this._userLang = this._translateService.currentLang || this.browserLang() || 'en' ;

    this._userAuthenticated = this._authService.isAuthenticated;

    this._filterService.getSearchOutput().subscribe((searchKey: string) => {
      this._searchInnovations(searchKey);
    });

  }

  ngOnInit() {
    this._getAllSectorTags();
  }


  /***
   * this function is to get the recommend innovations for the
   * logged user.
   * @param idInno
   * @private
   */
  private _applyInnoRecommendation(idInno: string) {
    this._innovationService.getRecommendation(idInno).subscribe((response) => {
      response.forEach((inno_similar: Innovation) => {
        this._recommendedInnovations.push(this._totalInnovations.find((inno: Innovation) => (inno._id) === inno_similar._id));
      });
    });
  }


  /***
   * this function will slice first four innovations to show in the section
   * latest.
   * @private
   */
  private _getLatestInnovations() {
    this._latestInnovations = this._totalInnovations.slice(0, 4);
  }


  /***
   * this function will get the remaining innovations that are not latest t
   * o show in the section trending.
   * @private
   */
  private _getTrendingInnovations() {
    this._trendingInnovations = this._totalInnovations.slice(4);
  }


  /***
   * this function searches for the tags of type sector and push them to the attribute
   * sectorTags.
   */
  private _getAllSectorTags() {
    this._sectorTags = [];

    this._totalInnovations.forEach((innovation) => {
      innovation.tags.forEach((tag: Tag) => {
        if (tag.type === 'SECTOR') {
          const find = this._sectorTags.find((item: Tag) => item._id === tag._id);
          if (!find) {
            this._sectorTags.push(tag);
          }
        }
      });
    });

  }


  public onSelectFilters(filters: Array<Tag>) {
    this.selectedFilters = filters;
    console.log(this.selectedFilters);

    if (this.selectedFilters.length > 0) {
      this.filterActivated = true;

      if (this.filteredInnovations.length === 0) {
        this.filteredInnovations = this._totalInnovations;
      }


    } else {
      this.filterActivated = false;
    }

  }


  /***
   * this function is to search the innovation based on the search input field.
   * @param input
   * @private
   */
  private _searchInnovations(input: string) {
    this.filteredInnovations = [];

    if (input) {
      this.searchingInnovations = true;

      this._totalInnovations.forEach((innovation: Innovation) => {
        innovation.innovationCards.forEach((card: InnovCard) => {

          const find = card.title.toLowerCase().includes(input.toLowerCase());

          if (find) {
            const innovationIndex = this.filteredInnovations.findIndex((inno: Innovation) => inno._id === innovation._id);
            if (innovationIndex === -1) {
              this.filteredInnovations.push(innovation);
            }
          }

        });
      });

      this.searchKey = input;

      this.noResultFound = this.filteredInnovations.length === 0;

    } else {
      this.searchKey = '';
      this.searchingInnovations = false;
    }

  }


  public browserLang(): string {
    return this._translateService.getBrowserLang();
  }


  public getCommunityUrl(): string {
    return this._userLang === 'fr' ? 'https://www.umi.us/fr/communaute/' : 'https://www.umi.us/community/';
  }


  get config() {
    return this._config;
  }

  get totalInnovations(): Array<Innovation> {
    return this._totalInnovations;
  }


  get recommendedInnovations(): Array<Innovation> {
    return this._recommendedInnovations;
  }

  get latestInnovations(): Array<Innovation> {
    return this._latestInnovations;
  }

  get trendingInnovations(): Array<Innovation> {
    return this._trendingInnovations;
  }

  get sectorTags(): Array<Tag> {
    return this._sectorTags;
  }

  get userLang(): string {
    return this._userLang;
  }

  get userAuthenticated(): boolean {
    return this._userAuthenticated;
  }

}
