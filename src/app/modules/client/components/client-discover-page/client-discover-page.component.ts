import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { Innovation } from '../../../../models/innovation';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Tag } from '../../../../models/tag';
import { TagsService} from '../../../../services/tags/tags.service';
import { TranslateService } from '@ngx-translate/core';
import { MultilingPipe } from '../../../../pipe/pipes/multiling.pipe';
import { InnovCard } from '../../../../models/innov-card';
import { PaginationTemplate } from '../../../../models/pagination';
import { animate, query, style, transition, trigger, stagger, keyframes } from '@angular/animations';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-discover-page',
  templateUrl: './client-discover-page.component.html',
  styleUrls: ['./client-discover-page.component.scss'],
  animations: [

    trigger('tagAnimation', [
      transition('* => *', [

        query('.tag-content', style({ opacity: 0, transform: 'translateX(-15%)' })),

        query('.tag-content', stagger('50ms', [
          animate('.15s ease-in-out', style({ opacity: 1, transform: 'translateX(0)' })),
        ])),

      ])
    ]),

    trigger('cardAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('50ms', [
          animate('.5s ease-in-out', keyframes([
            style({ opacity: 0, transform: 'translateX(15%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)',     offset: 1.0 }),
            ])
          )]
        ), { optional: true }),

      ])
    ])

  ]
})

export class ClientDiscoverPageComponent implements OnInit {

  private _config = {
    fields: 'created innovationCards tags status projectStatus principalMedia',
    limit: 0,
    offset: 0,
    search: {
      isPublic: 1
    },
    sort: {
      created: -1
    }
  }; // config to get the innovations from the server.

  private _totalInnovations: Array<Innovation> = []; // hold all the innovations that we get from the server.

  private _totalResults: number; // hold the total number of innovations we get from the server.

  private _localResults: number; // hold the total number of innovations.

  private _displaySpinner = true; // show the spinner until we are fetching the innovation from the server.

  private _allTags: Array<Tag> = []; // hold all the tags type of sector in the fetched innovations.

  private _appliedFilters: Array<Tag> = []; // hold all the filters that are selected by the user.

  private _appliedSimilarFilter: Array<Tag> = []; //

  private _localInnovations: Array<Innovation> = []; // we store the result of the total innovation to do functions on it.

  private _innovationTitles: Array<{text: string}> = []; // to store the innovation title to send to the search field.

  private _paginationValue: PaginationTemplate = {}; // to pass the value in the pagination component.

  private _startingIndex: number; // starting index of the innovation.

  private _endingIndex: number; // upto which index we have to show the innovation.

  private _moreTagsIndex = 22; // to display the number of label item.

  private _noResultFound = false; // when no result is while respect to search filed.

  private _shareModal = false; // open the modal to share the filtered result.

  private _shareUrl = ''; // share url.

  private _tagUrl = ''; // contains all the applied tag in a string.

  private _suggestedTags: Array<Tag> = []; // array containing suggested tags id for the selected tag

  constructor(private translateTitleService: TranslateTitleService,
              private innovationService: InnovationService,
              private tagsService: TagsService,
              private translateNotificationsService: TranslateNotificationsService,
              private translateService: TranslateService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.translateTitleService.setTitle('DISCOVER.MENU_BAR_TITLE');
    this._config.search['$or'] = [{'status': 'EVALUATING'}, {'status': 'DONE'}];
    this._paginationValue = { limit: 50, offset: this._config.offset };
    this.checkStoredFilters();
    this.getAllInnovations();
  }


  /***
   * this function checks do we have any filters stored in session storage.
   */
  private checkStoredFilters() {
    const sessionValues = JSON.parse(sessionStorage.getItem('discover-filters')) || 0;

    if (sessionValues.length > 0) {
      this._appliedFilters = sessionValues;
    } else {
      this._appliedFilters = [];
    }

  }


  /***
   * this function is to get all the innovations from the server.
   */
  private getAllInnovations() {
    this.innovationService.getAll(this._config).first().subscribe((response) => {
      this._totalInnovations = response.result;
      this._totalResults = response._metadata.totalCount;
      this.getTitles();
      this.getAllTags();
      this.checkSharedResult();
      this.initialize();
    }, () => {
      this._displaySpinner = false;
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    }, () => {
      this._displaySpinner = false;
    });
  }


  /***
   * this function searches for the tags of type sector and push them to the attribute
   * allTags.
   */
  private getAllTags() {

    this._totalInnovations.forEach((innovation) => {
      innovation.tags.forEach((tag: Tag) => {
        if (tag.type === 'SECTOR') {
          const index = this._allTags.findIndex((item: Tag) => item._id === tag._id);
          if (index === -1) {
            this._allTags.push(tag);
          }
        }
      });
    });

    this.sortTags();

  }


  private sortTags() {
    this._allTags = this._allTags.sort((a: Tag, b: Tag) => {

      const labelA = MultilingPipe.prototype.transform(a.label, this.browserLang()).toLowerCase();
      const labelB =  MultilingPipe.prototype.transform(b.label, this.browserLang()).toLowerCase();

      if ( labelA > labelB) {
        return 1;
      }

      if (labelA < labelB) {
        return -1;
      }

      return 0

    });

  }


  browserLang(): string {
    return this.translateService.getBrowserLang() || 'en';
  }


  /***
   * this function is to check if we contain any params or not.
   */
  private checkSharedResult() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params['tag']) {
        this._appliedFilters = [];
        if (typeof params['tag'] === 'string') {
          const index = this._allTags.findIndex((tag: Tag) => tag._id === params['tag']);
          if (index !== -1) {
            const existTagIndex = this._appliedFilters.findIndex((filter: Tag) => filter._id === params['tag']);
            if (existTagIndex === -1) {
              this._appliedFilters.push(this._allTags[index]);
            }
          }
        } else {
          params['tag'].forEach((tagId: string) => {
            const index = this._allTags.findIndex((tag: Tag) => tag._id === tagId);
            if (index !== -1) {
              const existTagIndex = this._appliedFilters.findIndex((filter: Tag) => filter._id === tagId);
              if (existTagIndex === -1) {
                this._appliedFilters.push(this._allTags[index]);
              }
            }
          });
        }

      }
    });
  }



  /***
   * this functions is to get the titles of the innovation for the search
   * field.
   */
  private getTitles() {
    this._innovationTitles = [];
    let index = 0;

    this._totalInnovations.forEach((innovation: Innovation) => {
      if (innovation.innovationCards.length > 1) {
        const browserLangIndex = innovation.innovationCards.findIndex((card) => card.lang === this.browserLang());
        if (browserLangIndex !== -1) {
          index = browserLangIndex;
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


  /***
   * this function first check the length of the appliedFilters and do the
   * respective functionality.
   */
  private initialize() {

    this._startingIndex = 0;
    this._endingIndex = parseInt(localStorage.getItem('discover-page-limit'), 10) || 50;

    if (this._appliedFilters.length > 0) {
      this.applyFilters();
    } else {
      this._localInnovations = this._totalInnovations;
      this._localResults = this._localInnovations.length;
    }


  }


  /***
   * this function is to determine which filter is active or not.
   * @param id
   */
  getCheckedFilter(id: string): boolean {
    const index = this._appliedFilters.findIndex((item) => item._id === id);
    return index !== -1;
  }

  /***
   * this function is to determine which filter is active or not in the similar tab.
   * @param id
   */
  getCheckedSimilarFilter(id: string): boolean {
    const index = this._appliedSimilarFilter.findIndex((item) => item._id === id);
    return index !== -1;
  }


  /***
   * based on the filter is checked or unchecked we do the respective functions.
   * @param event
   * @param tag
   */
  toggleFilter(event: Event, tag: Tag) {

    if (event.target['checked']) {
      this._appliedFilters.push(tag);
    } else {
      this.removeFilter(tag._id);
      this._appliedSimilarFilter = [];
    }

    this.applyFilters();

    this.storeFilters();

    this.getTagsRecommendation();

  }

  /***
   * based on the similar filter is checked or unchecked we do the respective functions.
   * @param event
   * @param tag
   */
  toggleSimilarFilter(event: Event, tag: Tag) {

    if (event.target['checked']) {
      this._appliedSimilarFilter.push(tag);
    } else {
      this.removeSimilarFilter(tag._id);
    }

    this.applySimilarFilters();

  }


  /***
   * this function is to remove the applied filter from the variable appliedFilter.
   * @param id
   */
  private removeFilter(id: string) {
    const index = this._appliedFilters.findIndex((tag) => tag._id === id);
    this._appliedFilters.splice(index, 1);
  }

  /***
   * this function is to remove the applied filter from the variable appliedSimilarFilter.
   * @param id
   */
  private removeSimilarFilter(id: string) {
    const index = this._appliedSimilarFilter.findIndex((tag) => tag._id === id);
    this._appliedSimilarFilter.splice(index, 1);
  }



  /***
   * this function searches for the innovations that contains the applied filters.
   */
  private applyFilters() {

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

      this._localResults = this._localInnovations.length;

    } else {
      this.initialize();
    }

  }

  /***
   * this function searches for the innovations that contains the applied filters AND the similar filter.
   */
  private applySimilarFilters() {

    if (this._appliedSimilarFilter.length > 0) {

      this._localInnovations = [];
      let sameTag = -1;
      let sameSimilarTag = -1;

      this._totalInnovations.forEach((innovation: Innovation) => {
        if (innovation.tags.length > 0) {
          innovation.tags.forEach((tag: Tag) => {
            const indexFilter = this._appliedFilters.findIndex((filter: Tag) => filter._id === tag._id);
            const indexSimilarFilter = this._appliedSimilarFilter.findIndex((filter: Tag) => filter._id === tag._id);
            if (indexFilter !== -1) {
              sameTag = 1;
            }
            if (indexSimilarFilter !== -1) {
              sameSimilarTag = 1;
            }
          });
          if (sameTag !== -1 && sameSimilarTag !== -1) {
            const innovationIndex = this._localInnovations.findIndex((inno: Innovation) => inno._id === innovation._id);
            if (innovationIndex === -1) {
              this._localInnovations.push(innovation);
            }
            sameTag = -1;
            sameSimilarTag = -1;
          }
        }
      });

      this._localResults = this._localInnovations.length;

    } else {
      this.initialize();
    }
  }


  /***
   * this function stores the appliedFilters in the session storage.
   */
  private storeFilters() {
    sessionStorage.setItem('discover-filters', JSON.stringify(this._appliedFilters));
  }


  /***
   * this function checks the length of the allTags and according to that display the tags
   * when click on See more sectors.
   * @param event
   */
  onClickMore(event: Event) {
    event.preventDefault();

    if (this._moreTagsIndex < this._allTags.length) {
      const diff = this._allTags.length - this._moreTagsIndex;
      if (diff >= 22) {
        this._moreTagsIndex += 22;
      } else {
        this._moreTagsIndex += diff;
      }
    }

  }


  onClickClose(event: Event) {
    event.preventDefault();
    this._moreTagsIndex = 22;
  }


  /***
   * this function is to generate the url to share and open the modal.
   * @param event
   */
  onClickShare(event: Event) {
    event.preventDefault();

    this._tagUrl = '';

    this._appliedFilters.forEach((tag: Tag) => {
      this._tagUrl += 'tag=' + tag._id + '&';
    });

    this._shareUrl = `${this.getUrl()}/discover/result?${this._tagUrl.slice(0, this._tagUrl.length - 1)}`;

    this._shareModal = true;

  }


  getUrl(): string {
    return environment.innovationUrl;
  }


  /***
   * this function closes the share modal.
   * @param event
   */
  closeModal(event: Event) {
    event.preventDefault();
    this._shareModal = false;
  }


  /***
   * this functions is called when the user types in the search field.
   * @param value
   */
  onValueTyped(value: string) {

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
      this.checkStoredFilters();
      this.initialize();
    }

    this._noResultFound = this._localInnovations.length === 0;

  }


  /***
   * this function is to get image src.
   * @param innovation
   */
  getImageSrc(innovation: Innovation): string {

    let src = '';
    const defaultSrc = 'https://res.cloudinary.com/umi/image/upload/v1535383716/app/default-images/image-not-available.png';

    if (innovation.principalMedia && innovation.principalMedia.url && innovation.principalMedia.type === 'PHOTO') {
      src = innovation.principalMedia.url;
    } else if (innovation.innovationCards) {
      const index = innovation.innovationCards.findIndex((card: InnovCard) => card.lang === this.browserLang());
      if (index !== -1) {
        if (innovation.innovationCards[index].principalMedia && innovation.innovationCards[index].principalMedia.url
          && innovation.innovationCards[index].principalMedia.type === 'PHOTO') {
          src = innovation.innovationCards[index].principalMedia.url;
        } else {
          if (innovation.innovationCards[index].media.length > 0) {
            const photoIndex = innovation.innovationCards[index].media.findIndex((image) => image.type === 'PHOTO');
            if (photoIndex !== -1) {
              src = innovation.innovationCards[index].media[photoIndex].url;
            }
          }
        }
      }
    }

    if (src === '') {
      const index = innovation.innovationCards.findIndex((card: InnovCard) => card.lang !== this.browserLang());
      if (index !== -1) {
        if (innovation.innovationCards[index].media.length > 0) {
          const photoIndex = innovation.innovationCards[index].media.findIndex((image) => image.type === 'PHOTO');
          if (photoIndex !== -1) {
            src = innovation.innovationCards[index].media[photoIndex].url;
          }
        }
      } else {
        src = defaultSrc;
      }
    }

    return src;

  }


  /***
   * this function is to return the detail of the innovation card based on the parameter toReturn.
   * @param toReturn
   * @param innovation
   */
  getInnovationDetail(toReturn: string, innovation: Innovation): string {
    let value = '';
    let index = 0;

    if (innovation.innovationCards.length > 1) {
      const browserLangIndex = innovation.innovationCards.findIndex((card: InnovCard) => card.lang === this.browserLang());
      if (browserLangIndex !== -1) {
        index = browserLangIndex;
      }
    } else {
      const indexEn = innovation.innovationCards.findIndex((card: InnovCard) => card.lang === 'en');
      if (indexEn !== -1) {
        index = indexEn;
      } else {
        index = 0;
      }
    }


    if (toReturn === 'title') {
    value = innovation.innovationCards[index].title;
    }

    if (toReturn === 'summary') {
      value = innovation.innovationCards[index].summary;
    }

    if (toReturn === 'reference') {
      value = innovation.innovationCards[index].innovation_reference;
    }

    if (toReturn === 'lang') {
      value = innovation.innovationCards[index].lang;
    }

    return value;

  }


  /***
   * this function is to return the sector tags associated with the particular
   * innovation.
   * @param innovation
   */
  getInnovationTags(innovation: Innovation): Array<Tag> {
    let tags: Array<Tag>;
    tags = innovation.tags.filter((items) => {
      return items.type === 'SECTOR';
    });
    return tags;
  }


  /***
   * this function is to get the all the langs of the particular innovation.
   * @param innovation
   */
  getLangs(innovation: Innovation): Array<string> {
    const langs: Array<string> = [];

    if (innovation.innovationCards.length > 1) {
      innovation.innovationCards.forEach((card: InnovCard) => {
        if (card.lang !== this.browserLang()) {
          langs.push(card.lang);
        }
      });
    }

    return langs.sort();
  }


  /***
   * when there is change in the pagination we detect the change and
   * update the innovation cards with the new limit and offset value.
   * @param paginationValues
   */
  onChangePagination(paginationValues: PaginationTemplate) {
    window.scroll(0, 0);

    const tempOffset = parseInt(paginationValues.offset, 10);
    const tempLimit = parseInt(paginationValues.limit, 10);

    this._startingIndex = tempOffset;
    this._endingIndex = tempLimit;

    if (paginationValues.limit >= this._localResults) {
      this._startingIndex = 0;
      this._endingIndex = this._localResults;
    } else {
      if (paginationValues.offset === 0) {
        this._startingIndex = 0;
        this._endingIndex = tempLimit;
      } else if (paginationValues.offset > 0) {
        this._startingIndex = tempOffset;
        this._endingIndex += tempOffset;
      }
    }

  }

  /***
   * Update the list of recommended tags based on the most recent applied filter. If there is no filter selected,
   * we set the recommended list to [].
   */
  getTagsRecommendation() {

    if (this._appliedFilters.length === 0) {
      this._suggestedTags = [];
    }
    else {
      this.tagsService.getSimilarTags(this._appliedFilters[this._appliedFilters.length - 1]._id).first().subscribe((response) => {
        this._suggestedTags = response;
      });
    }
  }



  get config(): { fields: string; limit: number; offset: number; search: { isPublic: number }; sort: { created: number } } {
    return this._config;
  }

  get totalInnovations(): Array<Innovation> {
    return this._totalInnovations;
  }

  get totalResults(): number {
    return this._totalResults;
  }

  get localResults(): number {
    return this._localResults;
  }

  get displaySpinner(): boolean {
    return this._displaySpinner;
  }

  get allTags(): Array<Tag> {
    return this._allTags;
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

  get paginationValue(): PaginationTemplate {
    return this._paginationValue;
  }

  get startingIndex(): number {
    return this._startingIndex;
  }

  get endingIndex(): number {
    return this._endingIndex;
  }

  get moreTagsIndex(): number {
    return this._moreTagsIndex;
  }

  get noResultFound(): boolean {
    return this._noResultFound;
  }

  get shareModal(): boolean {
    return this._shareModal;
  }

  get shareUrl(): string {
    return this._shareUrl;
  }

  get tagUrl(): string {
    return this._tagUrl;
  }

  get suggestedTags(): Array<Tag> {
    return this._suggestedTags
  }

}
