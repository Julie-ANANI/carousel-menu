import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Tag } from '../../../../../../../models/tag';
import { MultilingPipe } from '../../../../../../../pipe/pipes/multiling.pipe';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../../../../../environments/environment';
import { FilterService } from '../../services/filter.service';

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

  private _modalTag: boolean = false;

  private _shareUrl: string;

  private _urlCopied: boolean = false;

  allFilters: Array<Tag> = [];

  selectedFilters: Array<Tag> = [];

  // highlight: Array<string> = ['construction', 'software', 'industry', 'energy', 'healthcare', 'chemistry', 'transportation', 'services', 'environment', 'aerospace', 'network', 'it'];

  highlight: Array<string> = ['sector-tag-1', 'sector-tag-2', 'sector-tag-3'];

  highLightTags: Array<Tag> = [];


  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _filterService: FilterService) {

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


  public showAllTags(event: Event) {
    event.preventDefault();
    this._modalTag = true;
  }


  public searchOutput(value: string) {
    this._filterService.setSearchOutput(value);
  }


  /***
   * this function will open the share modal to share the
   * page url.
   * @param event
   */
  public onClickShare(event: Event) {
    event.preventDefault();
    this._urlCopied = false;
    this._modalShare = true;
    this._getShareLink();
  }


  private _getShareLink() {
    if (this.selectedFilters.length === 0) {
      this._shareUrl = FiltersComponent._getClientUrl();
    }
  }


  /***
   * this function is to copy the share url to clipboard when the user clicks on it.
   * @param event
   * @constructor
   */
  public OnClickCopy(event: Event) {
    event.preventDefault();

    if (isPlatformBrowser(this._platformId)) {

      let textbox = document.createElement('textarea');
      textbox.style.position = 'fixed';
      textbox.style.left = '0';
      textbox.style.top = '0';
      textbox.style.opacity = '0';
      textbox.value = this._shareUrl;
      document.body.appendChild(textbox);
      textbox.focus();
      textbox.select();
      document.execCommand('copy');
      document.body.removeChild(textbox);

      this._urlCopied = true;

      setTimeout(() => {
        this._closeBanner(event);
      }, 8000)

    }

  }


  private _closeBanner(event: Event) {
    event.preventDefault();
    this._urlCopied = false;
  }


  private _sendSelectedFilters() {
    this.appliedFilters.emit(this.selectedFilters);
  }


  private _browserLang(): string {
    return this._translateService.getBrowserLang();
  }


  private static _getClientUrl(): string {
    return `${environment.clientUrl}/discover`;
  }

  get modalShare(): boolean {
    return this._modalShare;
  }

  set modalShare(value: boolean) {
    this._modalShare = value;
  }

  get modalTag(): boolean {
    return this._modalTag;
  }

  set modalTag(value: boolean) {
    this._modalTag = value;
  }

  get shareUrl(): string {
    return this._shareUrl;
  }

  get urlCopied(): boolean {
    return this._urlCopied;
  }

  get userLang(): string {
    return this._userLang;
  }

}
