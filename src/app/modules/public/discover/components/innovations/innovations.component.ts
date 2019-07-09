import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';
import { Tag } from '../../../../../models/tag';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { FilterService } from './services/filter.service';
import { Config } from '../../../../../models/config';
import { isPlatformBrowser } from '@angular/common';
import { first } from 'rxjs/operators';
import { Response } from '../../../../../models/response';
import { AuthService } from '../../../../../services/auth/auth.service';

@Component({
  selector: 'app-innovations',
  templateUrl: './innovations.component.html',
  styleUrls: ['./innovations.component.scss']
})

export class InnovationsComponent implements OnInit {

  private _config: Config = {
    fields: 'created principalMedia innovationCards tags status projectStatus',
    limit: '0',
    offset: '',
    isPublic: '1',
    search: '{}',
    $or: '[{ "status": "EVALUATING" },{ "status": "DONE" }]',
    sort: '{ "created": -1 }'
  };

  private _fetchingError: boolean;

  private _totalInnovations: Array<Innovation> = []; // hold all the innovations that we get from the server.

  private _recommendedInnovations: Array<Innovation> = [];

  private _recommendedInnovationId: string;

  private _latestInnovations: Array<Innovation> = [];

  private _trendingInnovations: Array<Innovation> = [];

  private _filteredInnovations: Array<Innovation> = [];

  private _sectorTags: Array<Tag> = []; // hold all the tags type of sector in the fetched innovations.

  private _selectedFilters: Array<Tag> = [];

  private _userAuthenticated: boolean;

  private _filterActivated: boolean;

  private _searchKey = '';

  private _stopLoading: boolean;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateTitleService: TranslateTitleService,
              private _translateService: TranslateService,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _authService: AuthService,
              private _filterService: FilterService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.DISCOVER');
    this._userAuthenticated = this._authService.isAuthenticated;

    this._activatedRoute.queryParams.subscribe(params => {
      if (params['innovation']) {
        this._recommendedInnovationId = params['innovation'];
      }
    });

  }

  ngOnInit() {

    if (isPlatformBrowser(this._platformId)) {
      this._innovationService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
        this._totalInnovations = response.result;
        this._applyInnoRecommendation();
        this._getLatestInnovations();
        this._getTrendingInnovations();
        this._getAllSectorTags();
        this._stopLoading = true;
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
    this._latestInnovations = this._totalInnovations.length > 0 ? this._totalInnovations.slice(0, 4) : [];
  }

  /***
   * this function will get the remaining innovations that are not latest t
   * o show in the section trending.
   * @private
   */
  private _getTrendingInnovations() {
    this._trendingInnovations = this._totalInnovations.length > 0 ? this._totalInnovations.slice(4) : [];
  }

  /***
   * this function searches for the tags of type sector and push them to the attribute
   * sectorTags.
   */
  private _getAllSectorTags() {
    this._sectorTags = FilterService.getAllSectorTags(this._totalInnovations);
  }

  public onSelectFilters(filters: Array<Tag>) {
    this._selectedFilters = filters;
    this._checkFilterActivation();
    this._getFilteredInnovations();
  }

  public onInputField(value: string) {
    this._searchKey = value;
    this._checkFilterActivation();
    this._getFilteredInnovations();
  }

  private _checkFilterActivation() {
    this._filterActivated = this._selectedFilters.length > 0 || this._searchKey !== '';
  }

  private _getFilteredInnovations() {
    this._filteredInnovations = FilterService.getFilteredInnovations(this._totalInnovations, this._selectedFilters, this._searchKey);
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

  get totalInnovations(): Array<Innovation> {
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

  get trendingInnovations(): Array<Innovation> {
    return this._trendingInnovations;
  }

  get sectorTags(): Array<Tag> {
    return this._sectorTags;
  }

  get userLang(): string {
    return this._translateService.currentLang;
  }

  get userAuthenticated(): boolean {
    return this._userAuthenticated;
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

}
