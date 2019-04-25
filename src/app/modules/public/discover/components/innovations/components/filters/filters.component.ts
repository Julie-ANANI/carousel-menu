import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Tag } from '../../../../../../../models/tag';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../../../../../environments/environment';
import { FilterService } from '../../services/filter.service';
import { TagsService } from '../../../../../../../services/tags/tags.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})

export class FiltersComponent implements OnInit {

  @Input() set tags(value: Array<Tag>) {
    if (value) {
      this._allTags = value;
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

  private _allTags: Array<Tag> = [];

  private _selectedTags: Array<Tag> = [];

  private _highLightTags: Array<Tag> = [];

  private _suggestedTags: Array<Tag> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _tagsService: TagsService,
              private _activatedRoute: ActivatedRoute,
              private _filterService: FilterService) {

    this._filterService.getFilterToRemove().subscribe((tagId: string) => {
      this.removeFilter(tagId);
    });

    this._userLang = this._translateService.currentLang || this._browserLang() || 'en' ;

  }

  ngOnInit() {
    this._checkStoredFilters();
    this._checkSharedResult();
    this._getSuggestedTags();
    this._sendSelectedFilters();
  }


  /***
   * this function is to sort tags based on the type.
   * @param type
   * @private
   */
  private _sortTags(type: string) {
    switch (type) {

      case 'allTags':
        this._allTags = FilterService.sortTags(this._allTags, this._userLang);
        break;

      case 'suggested':
        this._suggestedTags = FilterService.sortTags(this._suggestedTags, this._userLang);
        break;

      case 'highlight':
        this._highLightTags = FilterService.sortTags(this._highLightTags, this._userLang);
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
    this._highLightTags = FilterService.getHighlightedTags(this._allTags);
    this._sortTags('highlight');
  }


  /***
   * this function checks do we have any filters stored in session storage.
   */
  private _checkStoredFilters() {
    if (isPlatformBrowser(this._platformId)) {
      const sessionValues = JSON.parse(sessionStorage.getItem('discover-filters')) || 0;
      if (sessionValues.length > 0) {
        this._selectedTags = sessionValues;
      }
    }
  }


  /***
   * this function is to check if we contain any params or not.
   */
  private _checkSharedResult() {
    this._activatedRoute.queryParams.subscribe((params: any) => {
      if (params['tag']) {
        this._selectedTags = [];
        if (typeof params['tag'] === 'string') {
          const index = this._allTags.findIndex((tag: Tag) => tag._id === params['tag']);
          if (index !== -1) {
            const existTagIndex = this._selectedTags.findIndex((filter: Tag) => filter._id === params['tag']);
            if (existTagIndex === -1) {
              this._selectedTags.push(this._allTags[index]);
            }
          }
        } else {
          params['tag'].forEach((tagId: string) => {
            const index = this._allTags.findIndex((tag: Tag) => tag._id === tagId);
            if (index !== -1) {
              const existTagIndex = this._selectedTags.findIndex((filter: Tag) => filter._id === tagId);
              if (existTagIndex === -1) {
                this._selectedTags.push(this._allTags[index]);
              }
            }
          });
        }

      }
    });
  }


  /***
   * this function is to get the suggested tags based on the tag selected.
   * @private
   */
  private _getSuggestedTags() {
    this._suggestedTags = [];

    if (this._selectedTags.length !== 0 ) {
      this._tagsService.getSimilarTags(this._selectedTags[this._selectedTags.length - 1]._id).subscribe((response: Array<any>) => {
        if (response) {
          response.forEach((tag: Tag) => {
            const find = this._selectedTags.find((selectTag: Tag) => selectTag._id === tag._id);
            if (!find) {
              this._suggestedTags.push(tag);
            }
          });
        }
        this._sortTags('suggested');
      });
    }
  }


  /***
   * this function is to determine which filter is active or not.
   * @param id
   */
  public checkFilter(id: string): boolean {
    return this._selectedTags.some((item) => item._id === id);
  }


  /***
   * based on the filter is checked or unchecked we do the respective functions.
   * @param event
   * @param tag
   */
  toggleFilter(event: Event, tag: Tag) {

    if (event.target['checked']) {
      this._selectedTags.push(tag);
      this._getSuggestedTags();
      this._sendSelectedFilters();
    } else {
      this.removeFilter(tag._id);
    }
  }


  /***
   * this function is to remove the selected filter from the variable selectedTags.
   * @param id
   */
  public removeFilter(id: string) {
    const index = this._selectedTags.findIndex((tag) => tag._id === id);
    this._selectedTags.splice(index, 1);
    this._getSuggestedTags();
    this._sendSelectedFilters();
  }


  public showAllTags(event: Event) {
    event.preventDefault();
    this._modalTag = true;
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


  /***
   * this function is to copy the share url to clipboard when the user clicks on it.
   * @param event
   * @constructor
   */
  public onClickCopy(event: Event) {
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


  /***
   * this function is to generate the share link of the page.
   * @private
   */
  private _getShareLink() {
    if (this._selectedTags.length === 0) {
      this._shareUrl = FiltersComponent._getClientUrl();
    } else {
      let tags = '';
      this._selectedTags.forEach((tag: Tag) => {
        tags += 'tag=' + tag._id + '&';
      });
      this._shareUrl = `${FiltersComponent._getClientUrl()}?${tags.slice(0, tags.length - 1)}`;
    }
  }


  private _closeBanner(event: Event) {
    event.preventDefault();
    this._urlCopied = false;
  }


  private _sendSelectedFilters() {

    if (isPlatformBrowser(this._platformId)) {
      sessionStorage.setItem('discover-filters', JSON.stringify(this._selectedTags));
    }

    this.appliedFilters.emit(this._selectedTags);

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

  get allTags(): Array<Tag> {
    return this._allTags;
  }

  get selectedTags(): Array<Tag> {
    return this._selectedTags;
  }

  get highLightTags(): Array<Tag> {
    return this._highLightTags;
  }

  get suggestedTags(): Array<Tag> {
    return this._suggestedTags;
  }

}
