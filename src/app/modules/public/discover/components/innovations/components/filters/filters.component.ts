import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Tag } from '../../../../../../../models/tag';
import { MultilingPipe } from '../../../../../../../pipe/pipes/multiling.pipe';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import {environment} from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})

export class FiltersComponent implements OnInit {

  @Input() set tags(value: Array<Tag>) {
    if (value) {
      this.allFilters = value;
      this._sortTags();
      this._getHighlightedTags();
    }
  }

  @Output() appliedFilters = new EventEmitter<Array<Tag>>();

  private _userLang = '';

  private _modalShare: boolean = false;

  shareUrl: string;

  allFilters: Array<Tag> = [];

  selectedFilters: Array<Tag> = [];

  // highlight: Array<string> = ['construction', 'software', 'industry', 'energy', 'healthcare', 'chemistry', 'transportation', 'services', 'environment', 'aerospace', 'network', 'it'];

  highlight: Array<string> = ['sector-tag-1', 'sector-tag-2', 'sector-tag-3'];

  highLightTags: Array<Tag> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService) {

    this._userLang = this._translateService.currentLang || this._browserLang() || 'en' ;

  }

  ngOnInit() {
    this._initializeFunctions();
  }


  private _initializeFunctions() {
    this._checkStoredFilters();
    this._sendSelectedFilters();
  }


  private _sortTags() {

    this.allFilters = this.allFilters.sort((a: Tag, b: Tag) => {

      const labelA = MultilingPipe.prototype.transform(a.label, this._userLang).toLowerCase();
      const labelB =  MultilingPipe.prototype.transform(b.label, this._userLang).toLowerCase();

      if ( labelA > labelB) {
        return 1;
      }

      if (labelA < labelB) {
        return -1;
      }

      return 0;

    });

  }


  /***
   * this function is to get the highlighted tags from all the sector tags.
   * @private
   */
  private _getHighlightedTags() {
    this.highLightTags = [];

    this.allFilters.forEach((tag: Tag) => {
      const include = this.highlight.includes(tag.label.en.toLowerCase());
      if (include) {
        this.highLightTags.push(tag);
      }
    });

  }


  /***
   * this function checks do we have any filters stored in session storage.
   */
  private _checkStoredFilters() {
    if (isPlatformBrowser(this._platformId)) {
      const sessionValues = JSON.parse(sessionStorage.getItem('discover-filters')) || 0;
      if (sessionValues.length > 0) {
        this.selectedFilters = sessionValues;
      } else {
        this.selectedFilters = [];
      }
    }
  }


  public onClickShare(event: Event) {
    event.preventDefault();
    this._modalShare = true;
    this._getShareLink();
  }


  private _getShareLink() {
    if (this.selectedFilters.length === 0) {
      this.shareUrl = this._getClientUrl();
    }
  }


  private _sendSelectedFilters() {
    this.appliedFilters.emit(this.selectedFilters);
  }


  private _browserLang(): string {
    return this._translateService.getBrowserLang();
  }


  private _getClientUrl(): string {
    return `${environment.clientUrl}/discover`;
  }

  get modalShare(): boolean {
    return this._modalShare;
  }

  set modalShare(value: boolean) {
    this._modalShare = value;
  }

  get userLang(): string {
    return this._userLang;
  }

}
