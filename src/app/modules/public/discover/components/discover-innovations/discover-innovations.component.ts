import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';
import { Tag } from '../../../../../models/tag';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { DiscoverService } from '../../../../../services/discover/discover.service';
import { Config } from '../../../../../models/config';
import { isPlatformBrowser } from '@angular/common';
import { first } from 'rxjs/operators';
import { Response } from '../../../../../models/response';

@Component({
  templateUrl: './discover-innovations.component.html',
  styleUrls: ['./discover-innovations.component.scss']
})

export class DiscoverInnovationsComponent implements OnInit {

  private _config: Config = {
    fields: 'created principalMedia innovationCards tags status projectStatus',
    limit: '25',
    offset: '',
    isPublic: '1',
    search: '{}',
    $or: '[{ "status": "EVALUATING" },{ "status": "DONE" }]',
    sort: '{ "created": -1 }'
  };

  private _fetchingError: boolean;

  private _totalInnovations: number;

  private _recommendedInnovations: Array<Innovation> = [];

  private _recommendedInnovationId: string;

  private _latestInnovations: Array<Innovation> = [];


  private _filteredInnovations: Array<Innovation> = [];

  private _sectorTags: Array<Tag> = []; // hold all the tags type of sector in the fetched innovations.

  private _selectedFilters: Array<Tag> = [];

  private _filterActivated: boolean;

  private _searchKey = '';

  private _stopLoading: boolean = false;

  private _stopLoadingLatest: boolean = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateTitleService: TranslateTitleService,
              private _translateService: TranslateService,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _filterService: DiscoverService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.DISCOVER');

    this._activatedRoute.queryParams.subscribe(params => {
      if (params['innovation']) {
        this._recommendedInnovationId = params['innovation'];
      }
    });

  }

  ngOnInit() {

    if (isPlatformBrowser(this._platformId)) {
      this._innovationService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
        this._totalInnovations = response._metadata.totalCount;
        this._filteredInnovations = response.result;
        if (this._recommendedInnovationId) {
          this._applyInnoRecommendation();
        }
        this._getLatestInnovations();
        this._getAllSectorTags();
        this._stopLoading = true;
        this._stopLoadingLatest = true;
      }, () => {
        this._fetchingError = true;
      });
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
  private _getLatestInnovations() {
    this._latestInnovations = this._filteredInnovations.length > 0 ? this._filteredInnovations.slice(0, 4) : [];
  }

  /***
   * this function searches for the tags of type sector and push them to the attribute
   * sectorTags.
   */
  private _getAllSectorTags() {
    //this._sectorTags = DiscoverService.getAllSectorTags(this._totalInnovations);
  }

  onChangePage(event: {offset: number; limit: number}) {
    this._config.limit = event.limit.toString();
    this._config.offset = event.offset ? event.offset.toString() : '4';
    this._getFilteredInnovations();
  }

  public onSelectFilters(filters: Array<Tag>) {
    this._selectedFilters = filters;
    if (filters && filters.length) {
      this._config.tags = JSON.stringify({$in: filters.join(',')});
    }
    this._checkFilterActivation();
    this._getFilteredInnovations();
  }

  public onInputField(value: string) {
    this._searchKey = value;
    if (value) {
      this._config.search = JSON.stringify({
        title: value
      });
    }
    this._checkFilterActivation();
    this._getFilteredInnovations();
  }

  private _checkFilterActivation() {
    this._filterActivated = this._selectedFilters.length > 0 || this._searchKey !== '';
  }

  private _getFilteredInnovations() {
    this._stopLoading = false;
    this._innovationService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._filteredInnovations = response.result;
      this._stopLoading = true;
    }, () => {
      this._fetchingError = true;
    });
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

  get totalInnovations(): number {
    return this._totalInnovations;
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
