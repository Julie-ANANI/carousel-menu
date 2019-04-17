import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';
import { Tag } from '../../../../../models/tag';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { TagsService } from '../../../../../services/tags/tags.service';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { environment } from '../../../../../../environments/environment';
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
  }; // config to get the innovations from the server.

  private _totalInnovations: Array<Innovation> = []; // hold all the innovations that we get from the server.

  private _totalLocalResults: number; // hold the total number of innovations.

  private _sectorTags: Array<Tag> = []; // hold all the tags type of sector in the fetched innovations.

  private _appliedFilters: Array<Tag> = []; // hold all the filters that are selected by the user.

  private _appliedSimilarFilter: Array<Tag> = []; //

  private _localInnovations: Array<Innovation> = []; // we store the result of the total innovation to do functions on it.

  private _innovationTitles: Array<{text: string}> = []; // to store the innovation title to send to the search field.

  private _moreTagsIndex = 22; // to display the number of label item.

  private _noResultFound = false; // when no result is while respect to search filed.

  private _modalShare = false; // open the modal to share the filtered result.

  private _shareUrl = ''; // share url.

  private _tagUrl = ''; // contains all the applied tag in a string.

  private _suggestedTags: Array<Tag> = []; // array containing suggested tags id for the selected tag

  private _userSuggestedInnovations: Array<Innovation> = [];

  userLang = '';

  displayLoading: boolean = true;

  selectedFilters: Array<Tag> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateTitleService: TranslateTitleService,
              private _tagsService: TagsService,
              private _translateService: TranslateService,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.DISCOVER');

    this._totalInnovations = this._activatedRoute.snapshot.data.innovations;

    this._userSuggestedInnovations = this._totalInnovations.slice(0, 4); //temp

    this._activatedRoute.queryParams.subscribe(params => {
      if (params['innovation']) {
        this._applyInnoRecommendation(params['innovation']);
      }
    });

    this.userLang = this._translateService.currentLang || this.browserLang() || 'en' ;

  }

  ngOnInit() {
    this._getAllSectorTags();
    this._getInnovationTitles();
    this._stopLoading();
  }


  private _applyInnoRecommendation(idInno: string) {
    this._innovationService.getRecommendation(idInno).subscribe((response) => {
      response.forEach((inno_similar: Innovation) => {
        this._userSuggestedInnovations.push(this._totalInnovations.find((inno: Innovation) => (inno._id) === inno_similar._id));
      });
    });
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


  /***
   * this functions is to get the titles of the innovation for the search
   * field.
   */
  private _getInnovationTitles() {
    this._innovationTitles = [];
    let index = 0;

    this._totalInnovations.forEach((innovation: Innovation) => {
      if (innovation.innovationCards.length > 1) {
        const userLangIndex = innovation.innovationCards.findIndex((card) => card.lang === this.userLang);
        if (userLangIndex !== -1) {
          index = userLangIndex;
        }
      } else {
        const indexEn = innovation.innovationCards.findIndex((card) => card.lang === 'en');
        if (indexEn !== -1) {
          index = indexEn;
        } else {
          index = 0;
        }
      }

      this._innovationTitles.push({text: innovation.innovationCards[index].title});

    });

  }


  public onSelectFilters(filters: Array<Tag>) {
    this.selectedFilters = filters;

    if (this.selectedFilters.length > 0) {
      // this._applyFilters();
    } else {
      this._localInnovations = this._totalInnovations;
      this._totalLocalResults = this._localInnovations.length;
    }

  }


  private _stopLoading() {
    setTimeout(() => {
      this.displayLoading = false;
    }, 500);
  }


  /***
   * this function is to determine which filter is active or not.
   * @param id
   */
  public getCheckedFilter(id: string): boolean {
    const index = this._appliedFilters.findIndex((item) => item._id === id);
    return index !== -1;
  }

  /***
   * this function is to determine which filter is active or not in the similar tab.
   * @param id
   */
  public getCheckedSimilarFilter(id: string): boolean {
    const index = this._appliedSimilarFilter.findIndex((item) => item._id === id);
    return index !== -1;
  }


  /***
   * based on the filter is checked or unchecked we do the respective functions.
   * @param event
   * @param tag
   */
  public toggleFilter(event: Event, tag: Tag) {

    if (event.target['checked']) {
      this._appliedFilters.push(tag);
    } else {
      this._removeFilter(tag._id);
      this._appliedSimilarFilter = [];
    }

    this._applyFilters();

    this._storeFilters();

    this._getTagsRecommendation();

  }

  /***
   * based on the similar filter is checked or unchecked we do the respective functions.
   * @param event
   * @param tag
   */
  public toggleSimilarFilter(event: Event, tag: Tag) {

    if (event.target['checked']) {
      this._appliedSimilarFilter.push(tag);
    } else {
      this._removeSimilarFilter(tag._id);
    }

    this._applySimilarFilters();

  }


  /***
   * this function is to remove the applied filter from the variable appliedFilter.
   * @param id
   */
  private _removeFilter(id: string) {
    const index = this._appliedFilters.findIndex((tag) => tag._id === id);
    this._appliedFilters.splice(index, 1);
  }

  /***
   * this function is to remove the applied filter from the variable appliedSimilarFilter.
   * @param id
   */
  private _removeSimilarFilter(id: string) {
    const index = this._appliedSimilarFilter.findIndex((tag) => tag._id === id);
    this._appliedSimilarFilter.splice(index, 1);
  }



  /***
   * this function searches for the innovations that contains the applied filters.
   */
  private _applyFilters() {

    if (this._appliedFilters.length > 0) {

      this._localInnovations = [];

      this._totalInnovations.forEach((innovation: Innovation) => {
        if (innovation.tags.length > 0) {
          innovation.tags.forEach((tag: Tag) => {
            const index = this._appliedFilters.findIndex((filter: Tag) => filter._id === tag._id);
            if (index !== -1) {
              const innovationIndex = this._localInnovations.findIndex((inno: Innovation) => inno._id === innovation._id);
              if (innovationIndex === -1) {
                this._localInnovations.push(innovation);
              }
            }
          });
        }
      });

      this._totalLocalResults = this._localInnovations.length;

    } else {
      //this._initializeInnovations();
    }

  }

  /***
   * this function searches for the innovations that contains the applied filters AND the similar filter.
   */
  private _applySimilarFilters() {
    if (this._appliedSimilarFilter.length > 0) {

      this._localInnovations = [];


      this._totalInnovations.forEach((innovation: Innovation) => {
        if (innovation.tags.length > 0) {
          innovation.tags.forEach((tag: Tag) => {
            const indexFilter = this._appliedFilters.findIndex((filter: Tag) => filter._id === tag._id);
            const indexSimilarFilter = this._appliedSimilarFilter.findIndex((filter: Tag) => filter._id === tag._id);
            if (indexFilter !== -1 || indexSimilarFilter !== -1) {
              const innovationIndex = this._localInnovations.findIndex((inno: Innovation) => inno._id === innovation._id);
              if (innovationIndex === -1) {
                this._localInnovations.push(innovation);
              }
            }
          });
        }
      });

      this._totalLocalResults = this._localInnovations.length;

    } else {
      //this._initializeInnovations();
    }
  }


  /***
   * this function stores the appliedFilters in the session storage.
   */
  private _storeFilters() {
    if (isPlatformBrowser(this._platformId)) {
      sessionStorage.setItem('discover-filters', JSON.stringify(this._appliedFilters));
    }
  }


  /***
   * this function checks the length of the sectorTags and according to that display the tags
   * when click on See more sectors.
   * @param event
   */
  public onClickMore(event: Event) {
    event.preventDefault();

    if (this._moreTagsIndex < this._sectorTags.length) {
      const diff = this._sectorTags.length - this._moreTagsIndex;
      if (diff >= 22) {
        this._moreTagsIndex += 22;
      } else {
        this._moreTagsIndex += diff;
      }
    }

  }


  public onClickClose(event: Event) {
    event.preventDefault();
    this._moreTagsIndex = 22;
  }


  /***
   * this function is to generate the url to share and open the modal.
   * @param event
   */
  public onClickShare(event: Event) {
    event.preventDefault();

    this._tagUrl = '';

    this._appliedFilters.forEach((tag: Tag) => {
      this._tagUrl += 'tag=' + tag._id + '&';
    });

    this._shareUrl = `${this.getUrl()}${this._tagUrl.slice(0, this._tagUrl.length - 1)}`;

    this._modalShare = true;

  }


  public getUrl(): string {
    return `${environment.clientUrl}/discover?`;
  }


  /***
   * this functions is called when the user types in the search field.
   * @param value
   */
  public onValueTyped(value: string) {

    if (value !== '') {
      this._localInnovations = [];
      this._appliedFilters = [];
      this._totalInnovations.forEach((innovation: Innovation) => {
        innovation.innovationCards.forEach((card: InnovCard) => {
          if (card.title.toLowerCase().includes(value.toLowerCase())) {
            const innovationIndex = this._localInnovations.findIndex((inno: Innovation) => inno._id === innovation._id);
            if (innovationIndex === -1) {
              this._localInnovations.push(innovation);
            }
          }
        });
      });
    } else {
      //this._checkStoredFilters();
      //this._initializeInnovations();
    }

    this._noResultFound = this._localInnovations.length === 0;

  }









  /***
   * Update the list of recommended tags based on the most recent applied filter. If there is no filter selected,
   * we set the recommended list to [].
   */
  private _getTagsRecommendation() {

    if (this._appliedFilters.length === 0) {
      this._suggestedTags = [];
    } else {
      this._tagsService.getSimilarTags(this._appliedFilters[this._appliedFilters.length - 1]._id).subscribe((response) => {
        this._suggestedTags = response;
      });
    }
  }





  public browserLang(): string {
    return this._translateService.getBrowserLang();
  }

  get config() {
    return this._config;
  }

  get totalInnovations(): Array<Innovation> {
    return this._totalInnovations;
  }

  get totalLocalResults(): number {
    return this._totalLocalResults;
  }

  get sectorTags(): Array<Tag> {
    return this._sectorTags;
  }

  get appliedFilters(): Array<Tag> {
    return this._appliedFilters;
  }

  get localInnovations(): Array<Innovation> {
    return this._localInnovations;
  }

  get innovationTitles(): Array<{ text: string }> {
    return this._innovationTitles;
  }

  get moreTagsIndex(): number {
    return this._moreTagsIndex;
  }

  get noResultFound(): boolean {
    return this._noResultFound;
  }

  get modalShare(): boolean {
    return this._modalShare;
  }

  set modalShare(value: boolean) {
    this._modalShare = value;
  }

  get shareUrl(): string {
    return this._shareUrl;
  }

  get tagUrl(): string {
    return this._tagUrl;
  }

  get suggestedTags(): Array<Tag> {
    return this._suggestedTags;
  }

  get userInnovations(): Array<Innovation> {
    return this._userSuggestedInnovations;
  }

}
