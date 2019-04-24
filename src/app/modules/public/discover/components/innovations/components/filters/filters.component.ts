import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Tag } from '../../../../../../../models/tag';
import { MultilingPipe } from '../../../../../../../pipe/pipes/multiling.pipe';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../../../../../environments/environment';
import { FilterService } from '../../services/filter.service';
import { TagsService } from '../../../../../../../services/tags/tags.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})

export class FiltersComponent implements OnInit {

  @Input() set tags(value: Array<Tag>) {
    if (value) {
      this.allTags = value;
      this._sortTags('allTags');
      this._getHighlightedTags();
    }
  }

  @Output() appliedFilters = new EventEmitter<Array<Tag>>();

  private _userLang = '';

  private _modalShare: boolean = false;

  private _modalTag: boolean = false;

  private _shareUrl: string;

  private _urlCopied: boolean = false;

  allTags: Array<Tag> = [];

  selectedTags: Array<Tag> = [];

  selectedSimilarTags: Array<Tag> = [];

  highLightTags: Array<Tag> = [];

  suggestedTags: Array<Tag> = [];

  highlight: Array<string> = ['construction', 'software', 'industry', 'energy', 'healthcare', 'chemistry', 'transportation', 'services', 'environment', 'aerospace', 'network', 'it', 'sector-tag-1', 'sector-tag-2'];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _filterService: FilterService,
              private _tagsService: TagsService) {

    this._userLang = this._translateService.currentLang || this._browserLang() || 'en' ;

  }

  ngOnInit() {
    this._initializeFunctions();
  }


  private _initializeFunctions() {
    this._checkStoredFilters();
    this._sendSelectedFilters();
  }


  private _sortTags(type: string) {
    const userLang = this._userLang;

    function sortTag(tags: Array<Tag>) {

      return tags.sort((a: Tag, b: Tag) => {

        const labelA = MultilingPipe.prototype.transform(a.label, userLang).toLowerCase();
        const labelB =  MultilingPipe.prototype.transform(b.label, userLang).toLowerCase();

        if ( labelA > labelB) {
          return 1;
        }

        if (labelA < labelB) {
          return -1;
        }

        return 0;

      });
    }

    switch (type) {

      case 'allTags':
        this.allTags = sortTag(this.allTags);
        break;

      case 'suggested':
        this.suggestedTags = sortTag(this.suggestedTags);
        break;

      case 'highlight':
        this.highLightTags = sortTag(this.highLightTags);
        break;

      default:
      // do nothing...
    }

  }


  /***
   * this function is to get the highlighted tags from all the sector tags.
   * @private
   */
  private _getHighlightedTags() {
    this.highLightTags = [];

    this.allTags.forEach((tag: Tag) => {
      const include = this.highlight.includes(tag.label.en.toLowerCase());
      if (include) {
        this.highLightTags.push(tag);
      }
    });

    this._sortTags('highlight');

  }


  /***
   * this function checks do we have any filters stored in session storage.
   */
  private _checkStoredFilters() {
    if (isPlatformBrowser(this._platformId)) {
      const sessionValues = JSON.parse(sessionStorage.getItem('discover-filters')) || 0;
      if (sessionValues.length > 0) {
        this.selectedTags = sessionValues;
        this._getSuggestedTags();
      } else {
        this.selectedTags = [];
      }
    }
  }


  /***
   * this function is to get the suggested tags based on the tag selected.
   * @private
   */
  private _getSuggestedTags() {
    if (this.selectedTags.length === 0 ) {
      this.suggestedTags = [];
    } else {
      this._tagsService.getSimilarTags(this.selectedTags[this.selectedTags.length - 1]._id).subscribe((response) => {
        this.suggestedTags = response;
        this._sortTags('suggested');
      });
    }
  }


  /***
   * this function is to determine which filter is active or not.
   * @param id
   */
  public checkFilter(id: string): boolean {
    return this.selectedTags.some((item) => item._id === id);
  }


  /***
   * based on the filter is checked or unchecked we do the respective functions.
   * @param event
   * @param tag
   */
  toggleFilter(event: Event, tag: Tag) {

    if (event.target['checked']) {
      this.selectedTags.push(tag);
    } else {
      this._removeFilter(tag._id);
      this.selectedSimilarTags = [];
    }

    this._sendSelectedFilters();

  }


  /***
   * this function is to remove the selected filter from the variable selectedTags.
   * @param id
   */
  private _removeFilter(id: string) {
    const index = this.selectedTags.findIndex((tag) => tag._id === id);
    this.selectedTags.splice(index, 1);
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
    if (this.selectedTags.length === 0) {
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
    this.appliedFilters.emit(this.selectedTags);
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
