import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Innovation} from '../../../../../models/innovation';
import {Tag} from '../../../../../models/tag';
import {TranslateTitleService} from '../../../../../services/title/title.service';
import {TranslateService} from '@ngx-translate/core';
import {InnovationService} from '../../../../../services/innovation/innovation.service';
import {DiscoverService} from '../../../../../services/discover/discover.service';
import {Config} from '../../../../../models/config';
import {isPlatformBrowser} from '@angular/common';
import {first} from 'rxjs/operators';
import {Response} from '../../../../../models/response';
import {LocalStorageService} from '../../../../../services/localStorage/localStorage.service';

@Component({
  templateUrl: './discover-innovations.component.html',
  styleUrls: ['./discover-innovations.component.scss']
})

export class DiscoverInnovationsComponent implements OnInit {

  private _config: Config = {
    fields: 'created principalMedia innovationCards tags status projectStatus',
    limit: this._localStorage.getItem('discover-limit') || '25',
    offset: '0',
    isPublic: '1',
    search: '{}',
    $or: '[{ "status": "EVALUATING" },{ "status": "DONE" }]',
    sort: '{ "created": -1 }'
  };

  private _fetchingError: boolean;

  private _totalFilteredInnovations: number;

  private _recommendedInnovations: Array<Innovation> = [];

  private _recommendedInnovationId: string;

  private _latestInnovations: Array<Innovation> = [];


  private _filteredInnovations: Array<Innovation> = [];

  private _sectorTags: Array<Tag> = []; // hold all the tags type of sector in the fetched innovations.

  private _selectedFilters: Array<Tag> = [];

  private _filterActivated: boolean;

  private _searchKey = '';

  private _stopLoading = false;

  private _stopLoadingLatest = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateTitleService: TranslateTitleService,
              private _translateService: TranslateService,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _localStorage: LocalStorageService,
              private _filterService: DiscoverService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.DISCOVER');

    this._activatedRoute.queryParams.subscribe(params => {
      if (params['innovation']) {
        this._recommendedInnovationId = params['innovation'];
      }
    });

    if (Array.isArray(this._activatedRoute.snapshot.data['tags'])) {
      this._sectorTags = this._activatedRoute.snapshot.data['tags'];
    }
  }

  ngOnInit() {

    if (isPlatformBrowser(this._platformId)) {
      setTimeout(() => {
        const sessionValues = JSON.parse(sessionStorage.getItem('discover-filters')) || 0;
        if (!sessionValues.length) {
          this._innovationService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
            this._totalFilteredInnovations = response._metadata.totalCount;
            this._filteredInnovations = response.result.slice(4);
            if (this._recommendedInnovationId) {
              this._applyInnoRecommendation();
            }
            this._getLatestInnovations(response.result);
            this._stopLoading = true;
            this._stopLoadingLatest = true;
          }, () => {
            this._fetchingError = true;
          });
        }
      }, 1000);

    }

  }

  /***
   * this function is to get the recommend innovations for the
   * logged user.
   * @private
   */
  private _applyInnoRecommendation() {
    this._innovationService.getRecommendation(this._recommendedInnovationId).subscribe((response) => {
      this._recommendedInnovations = response;
    });
  }

  /***
   * this function will slice first four innovations to show in the section
   * latest.
   * @private
   */
  private _getLatestInnovations(innovations: Array<Innovation>) {
    this._latestInnovations = innovations.length > 0 ? innovations.slice(0, 4) : [];
  }

  onChangePage(event: { offset: number; limit: number }) {
    this._config.limit = event.limit.toString();
    this._config.offset = event.offset.toString();
    this._getFilteredInnovations();
  }

  public onSelectFilters(filters: Array<Tag>) {
    this._selectedFilters = filters;
    if (filters && filters.length) {
      this._config.tags = JSON.stringify({$in: filters.map((filter: Tag) => filter._id)});
      this._config.offset = '0';
    } else {
      delete this._config.tags;
    }
    this._checkFilterActivation();
    this._getFilteredInnovations();
  }

  public onInputField(value: string) {
    this._searchKey = value;
    if (value) {
      this._config.offset = '0';
      this._config.fromCollection = {
        model: 'innovationcard',
        title: value
      };
    } else {
      delete this._config.fromCollection;
    }
    this._checkFilterActivation();
    this._getFilteredInnovations();
  }

  private _checkFilterActivation() {
    this._filterActivated = this._selectedFilters.length > 0 || this._searchKey !== '';
  }

  private _getFilteredInnovations() {
    this._stopLoading = false;
    const oldOffset = this._config.offset;
    if (oldOffset === '0' && !this.filterActivated) {
      this._config.offset = '4';
    }
    if (this._config.fromCollection && this._config.fromCollection.model) {
      this._innovationService.advancedSearch({
        config: encodeURI(Buffer.from(JSON.stringify(this._config)).toString('base64'))
      }).pipe(first()).subscribe(response => {
        this._filteredInnovations = response.result;
        this._totalFilteredInnovations = response._metadata.totalCount;
        this._config.offset = oldOffset;
        this._stopLoading = true;
      }, err => {
        this._fetchingError = true;
      });
    } else {
      this._innovationService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
        this._filteredInnovations = response.result;
        this._totalFilteredInnovations = response._metadata.totalCount;
        this._config.offset = oldOffset;
        this._stopLoading = true;
      }, () => {
        this._fetchingError = true;
      });
    }
  }

  public onClickRemove(tagId: string) {
    this._filterService.setFilterToRemove(tagId);
  }

  public getCommunityUrl(): string {
    return this.userLang === 'fr' ? 'https://www.umi.us/fr/communaute/' : 'https://www.umi.us/community/';
  }

  get config(): Config {
    return this._config;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get totalFilteredInnovations(): number {
    return this._totalFilteredInnovations;
  }

  get recommendedInnovations(): Array<Innovation> {
    return this._recommendedInnovations;
  }

  get recommendedInnovationId(): string {
    return this._recommendedInnovationId;
  }

  get latestInnovations(): Array<Innovation> {
    return this._latestInnovations;
  }

  get sectorTags(): Array<Tag> {
    return this._sectorTags;
  }

  get userLang(): string {
    return this._translateService.currentLang;
  }

  get filteredInnovations(): Array<Innovation> {
    return this._filteredInnovations;
  }

  get selectedFilters(): Array<Tag> {
    return this._selectedFilters;
  }

  get filterActivated(): boolean {
    return this._filterActivated;
  }

  get searchKey(): string {
    return this._searchKey;
  }

  get stopLoading(): boolean {
    return this._stopLoading;
  }

  get stopLoadingLatest(): boolean {
    return this._stopLoadingLatest;
  }

}
