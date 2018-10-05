import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService} from '@ngx-translate/core';
import { Innovation } from '../../../../models/innovation';
import { InnovCard } from '../../../../models/innov-card';
import { PaginationTemplate } from '../../../../models/pagination';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Tag } from '../../../../models/tag';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-client-discover-page',
  templateUrl: './client-discover-page.component.html',
  styleUrls: ['./client-discover-page.component.scss']
})

export class ClientDiscoverPageComponent implements OnInit {

  private _innovationCards: InnovCard[]; // to hold the innovations based on the search.

  private _totalInnovations: Array<Innovation> = []; // to hold the total project result we get from the server.

  private _filterInnovations: Array<Innovation> = []; // in this we store the innovation that are filtered.

  private _localInnovations: Array<Innovation> = []; // we store the result of the total innovation to do functions on it.

  private _displaySpinner = true; // to show the spinner when we are fetching the data from the server.

  private _showFilterContainer = false; // to show or hide the filter container.

  private _tags: Array<Tag> = []; // to store the project tags.

  private _filterApplied: Array<{id: string, value: string, type: string}> = []; // to show the client the filters he added.

  private _addingFilter = false; // showing spinner when adding the filters.

  private _totalResults = 0; // saving the result that we get from the server.

  private _tagLabel: Array<{'label': string, 'id': string}> = []; // to store the label.

  private _endLabelIndex = 8; // to display the number of label item.

  private _applyFilterClicked = false; // to display the spinner when the user is applying the filters.

  private _selectedLang = ''; // set the lang when user select the lang in the filter.

  private _innovationDetails: Array<{text: string}> = []; // to store the innovation detail to send the search field.

  private _startInnoIndex: number; // starting index of the innovation.

  private _endInnoIndex = 20; // upto which index we have to show the innovation.

  config = {
    fields: 'created innovationCards tags status projectStatus',
    limit: 0,
    offset: 0,
    search: {
      isPublic: 1,
      '$or': [
        {'status': 'EVALUATING'},
        {'status': 'DONE'}
      ]
    },
    sort: {
      created: -1
    }
  };

  paginationValue: PaginationTemplate = {
    limit: this.config.limit,
    offset: this.config.offset
  }; // to pass the value in the pagination component.

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private translateTitleService: TranslateTitleService,
              private innovationService: InnovationService,
              private translateService: TranslateService,
              private translateNotificationsService: TranslateNotificationsService
              ) {}

  ngOnInit() {
    this.translateTitleService.setTitle('DISCOVER.TITLE');

    this.getAllInnovations();

    this.storedFilters();

  }


  /*
    based on the config we request to the server and get the results.
   */
  private getAllInnovations() {
    this.innovationService.getAll(this.config)
      .pipe(first())
      .subscribe((innovations: any) => {
        this._displaySpinner = true;
        this._totalInnovations = innovations.result;
        this.initialize();
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
        this._displaySpinner = false;
      });
  }


  /*
    checking do we have any filters and limit in the session storage,
    if yes then assign to the filterApplied attribute.
   */
  private storedFilters() {
    if (isPlatformBrowser(this.platformId)) {
      const sessionValues = JSON.parse(sessionStorage.getItem('discover-filters')) || 0;
      if (sessionValues.length > 0) {
        this._filterApplied = sessionValues;
      } else {
        this._filterApplied = [];
      }
    }
}


  /*
    here we are assigning the server results to the local attribute
    to perform the actions on it.
   */
  private initialize() {
    this._localInnovations = this._totalInnovations;
    this.loadInnovations();
  }


  /*
  after fetching all the innovations and assigning to local attribute
  first we check the length of filterApplied then according to that
  we call the respective functions.
 */
  private loadInnovations() {
    this._startInnoIndex = 0;
    if (isPlatformBrowser(this.platformId)) {
      // set in pagination.component.ts
      this._endInnoIndex = parseInt(localStorage.getItem('app-discover-limit'), 10) || 20;
    }

    if (this._filterApplied.length > 0) {
      this._filterInnovations = [];

      for (let i = 0; i < this._filterApplied.length; i++) {

        if (i === 0) {

          if (this._filterApplied[i].type === 'type') {
            this.filterType(this._localInnovations, this._filterApplied[i].value);
          }

          /*if (this.filterApplied[i].type === 'status') {
            this.filterStatus(this.localInnovations, this.filterApplied[i].value);
          }*/

          if (this._filterApplied[i].type === 'stage') {
            this.filterStage(this._localInnovations, this._filterApplied[i].value);
          }

          if (this._filterApplied[i].type === 'language') {
            this._selectedLang = this._filterApplied[i].value;
            this.filterLang(this._localInnovations, this._filterApplied[i].value);
          }

          if (this._filterApplied[i].type === 'label') {
            this.filterLabel(this._localInnovations, this._filterApplied[i].id);
          }

        } else {

          if (this._filterApplied[i].type === 'type') {
            this.filterType(this._filterInnovations, this._filterApplied[i].value);
          }

          /*if (this.filterApplied[i].type === 'status') {
            this.filterStatus(this.filterInnovations, this.filterApplied[i].value);
          }*/

          if (this._filterApplied[i].type === 'stage') {
            this.filterStage(this._filterInnovations, this._filterApplied[i].value);
          }

          if (this._filterApplied[i].type === 'language') {
            this._selectedLang = this._filterApplied[i].value;
            this.filterLang(this._filterInnovations, this._filterApplied[i].value);
          }

          if (this._filterApplied[i].type === 'label') {
            this.filterLabel(this._filterInnovations, this._filterApplied[i].id);
          }

        }

      }
      this.populateTags(this._filterInnovations);
      this.searchInInnovationCards(this._filterInnovations);
    } else {
      this.populateTags(this._localInnovations);
      this.searchInInnovationCards(this._localInnovations);
    }

    this._displaySpinner = false;
    this._addingFilter = false;

  }


  private filterType(innovations: Array<Innovation>, value: string) {
    this._filterInnovations = innovations.filter((items) => {
      return items.tags.findIndex((tag) => tag.type === value) !== -1;
    });
  }


  private filterStage(innovations: Array<Innovation>, value: string) {
    this._filterInnovations = innovations.filter((items) => {
      return items.projectStatus === Number(value);
    });
  }


  private filterLang(innovations: Array<Innovation>, value: string) {
    this._filterInnovations = innovations.filter((items) => {
      return items.innovationCards.findIndex((inno) => inno.lang === value) !== -1;
    });

  }


  private filterLabel(innovations: Array<Innovation>, value: string) {
    this._filterInnovations = innovations.filter((items) => {
      return items.tags && items.tags.findIndex((tag) => tag._id === value) !== -1;
    });
  }


  /*
    according to the innovations we pass we search for the tags in it
    and assign them to tags attributes. Write now we are showing label
    fo the type SECTOR.
   */
  private populateTags(innovations: Array<Innovation>) {
    this._tags = [];

    innovations.forEach((innovations) => {
      const index = this._filterApplied.findIndex((item) => item.type === 'type' || item.type === 'label' );
      const rawTags = innovations.tags || [];
      if (index !== -1) {
        rawTags.forEach((tag) => {
          const index = this._filterApplied.findIndex((item) => item.type === 'type' ? item.id === tag.type : item.id === tag._id);
          if (index !== -1) {
            this._tags.push(tag);
          }
        });
      } else {
        rawTags.forEach((tag) => {
          if (tag.type === 'SECTOR') {
            if (this._tags.findIndex((item) => item._id === tag._id) === -1) {
              this._tags.push(tag);
            }
          }
        });
      }

    });

    this.populateLabels();

  }


  /*
    after getting the value in the tags attributes we search for the labels in it and assign
    it to the tagLabel attribute and we also sort the array alphabetically.
   */
  private populateLabels() {
    this._tagLabel = [];

    this._tags.forEach((items) => {
      const index = this._tagLabel.findIndex((item) => item.id === items._id);
      if (index === -1) {
        if (this.currentLang === 'en') {
          this._tagLabel.push({'label': items.label.en, 'id': items._id});
        } else {
          this._tagLabel.push({'label': items.label.fr, 'id': items._id});
        }
      }
    });

    this._tagLabel.sort((a: any, b: any) => {
      if (a.label < b.label) {
        return -1;
      }

      if (a.label > b.label) {
        return 1;
      }

      return 0;

    });

  }


  /*
    based on the innovations array we pass, we load the innovation
    card.
   */
  private searchInInnovationCards(innovations: Array<Innovation>) {
    this._innovationCards = [];
    this._innovationDetails = [];

    innovations.forEach((item) => {

      if (this._selectedLang === '') {
        for (let i = 0; i < item.innovationCards.length; i++) {
          if (item.innovationCards[i].lang === this.currentLang) {
            this._innovationCards.push(item.innovationCards[i]);
          }
          this._innovationDetails.push({'text': item.innovationCards[i].title});
        }
      } else {
        const index = item.innovationCards.findIndex(innovationCard => innovationCard.lang === this.innovationsLang);
        if (index !== -1) {
          this._innovationCards.push(item.innovationCards[index]);
          this._innovationDetails.push({'text': item.innovationCards[index].title});
        }
      }

    });

    this._totalResults = this._innovationCards.length;

  }


  /*
  here when the user types in the search field according to that we search for the innovations
  from the total innovation attributes and display it.
   */
  onValueSelected(value: string) {
    if (value === '') {
      this._displaySpinner = true;
      this.initialize();
    } else {
      this._displaySpinner = true;
      this._localInnovations = [];
      this._totalInnovations.forEach((innovation) => {
        innovation.innovationCards.forEach((innoCard) => {
          const find = innoCard.title.toLowerCase().includes(value.toLowerCase());
          if (find) {
            const index = this._localInnovations.findIndex((item) => item._id === innovation._id);
            if (index === -1) {
              this._localInnovations.push(innovation);
            }
          }
        })
      });
      this.loadInnovations();
    }

  }


  /*
    showing the filter container.
   */
  addFilter(event: Event) {
    event.preventDefault();
    this._showFilterContainer = true;
    this._applyFilterClicked = false;
  }


  /*
 check the value of applyFilterClicked, if false then assign the
 filters that are stored in the sessionStorage.
*/
  cancelFilter(event: Event) {
    event.preventDefault();

    this._showFilterContainer = false;

    if (!this._applyFilterClicked) {
      this.storedFilters();
    }

    this.checkFilterLength();

  }


  /*
    check the filterApplied length and calls the respective
    function.
   */
  checkFilterLength() {
    if (this._filterApplied.length > 0) {
      this.loadInnovations();
    } else {
      this._selectedLang = '';
      this.initialize();
    }
  }


  /*
    save the applied filters to session storage and close the container.
   */
  applyFilter() {
    this._applyFilterClicked = true;
    this.storeFilters();
    this._showFilterContainer = false;
  }


  /*
    here we are storing the filter values in the session storage.
   */
  private storeFilters() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('discover-filters', JSON.stringify(this._filterApplied));
    }
  }


  /*
    when the applied filter is clicked to remove it.
   */
  removeFilter(value: string) {
    this._addingFilter = true;

    this.filterRemove(value);

    if (!this._showFilterContainer) {
      this.storeFilters();
    }

    this.checkFilterLength();

  }


  /*
   remove the filter from the filterApplied attribute based on the
   value.
  */
  filterRemove(value: string) {
    const index = this._filterApplied.findIndex(name => name.id === value);
    this._filterApplied.splice(index, 1);
  }


  /*
  when click all link is clicked to remove all the filters.
 */
  removeAllFilter(event: Event) {
    event.preventDefault();

    this._addingFilter = true;

    this._filterApplied = [];

    if (!this._showFilterContainer) {
      this.storeFilters();
    }

    this.checkFilterLength();

  }


  /*
  based on the checkbox checked or unchecked we effect the filterApplied attribute,
  and call the related functions.
 */
  toggleFilter(event: Event) {
    this._addingFilter = true;
    this._selectedLang = '';

    if (event.target['checked']) {
      this._filterApplied.push({id: event.target['id'], value: event.target['defaultValue'], type: event.target['name']});
    } else {
      this.filterRemove(event.target['id']);
    }

    this.checkFilterLength();

  }


  /*
    checking the filterApplied contains the keys, if yes then
    we make the checkbox ticked.
   */
  filterChecked(value: string, type: string): boolean {
    const index = this._filterApplied.findIndex((item) => item.id === value && item.type === type);
    return index !== -1;
  }


  /*
  we disable the type that are not selected.
*/
  checkDisable(value: string, type: string): boolean {

    if (this._filterApplied.length > 0) {
      const typeIndex = this._filterApplied.findIndex((item) => item.type === type);

      if (typeIndex !== -1) {
        const index = this._filterApplied.findIndex((item) => item.id === value);
        if (index === -1) {
          return true;
        }
      }

    }

    return false;
  }


  getStageName(value: string): string {
    if (value === '0') {
      if (this.currentLang === 'en') {
        return 'Idea'
      } else {
        return 'Idée'
      }
    }

    if (value === '1') {
      if (this.currentLang === 'en') {
        return 'Development in progress'
      } else {
        return 'Développement en cours'
      }
    }

    if (value === '2') {
      if (this.currentLang === 'en') {
        return 'Already available'
      } else {
        return 'Déjà disponible'
      }
    }

  }


  getLabelName(value: string): string {
    if (value) {
      return `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`;
    }

    return 'Unknown'

  }


  changeIndex(event: Event, value: string) {
    event.preventDefault();

    if (value === 'label') {
      if (this._endLabelIndex < this._tagLabel.length) {
        const diff = this._tagLabel.length - this._endLabelIndex;
        if (diff >= 8) {
          this._endLabelIndex += 8;
        } else {
          this._endLabelIndex += diff;
        }
      }
    }

  }


  getFilterName(item: Array<{id: string, value: any, type: string}>): string {
    if (item['type'] === 'language' ) {
      return this.getLangName(item['value']);
    }

    if (item['type'] === 'type' ) {
      return this.getTypeName(item['value']);
    }

    if (item['type'] === 'stage' ) {
      return this.getStageName(item['value']);
    }

    if (item['type'] === 'label' ) {
      return this.getLabelName(item['value']);
    }

    return '';

  }


  getTypeName(value: string): string {
    if (value === 'SECTOR') {
      return 'Sector';
    }

    if (value === 'VALUE_CHAIN') {
      return 'Value chain';
    }

    if (value === 'SOLUTION_TYPE') {
      return 'Solution';
    }

    if (value === 'QUALIFICATION') {
      return 'Qualification';
    }

    return 'Unknown';

  }


  getLangName(value: string): string {
    if (value === 'en') {
      if (this.currentLang === 'en') {
        return 'English';
      } else {
        return 'Anglais';
      }
    }

    if (value === 'fr') {
      if (this.currentLang === 'en') {
        return 'French';
      } else {
        return 'Français';
      }
    }

  }


  /*
    when there is change in the pagination we detect the change and
    call the service with the new limit and offset value.
   */
  changePagination(paginationValues: PaginationTemplate) {
    window.scroll(0, 0);

    const tempOffset = parseInt(paginationValues.offset, 10);
    const tempLimit = parseInt(paginationValues.limit, 10);

    this._startInnoIndex = tempOffset;
    this._endInnoIndex = tempLimit;

    if (paginationValues.limit >= this._totalResults) {
      this._startInnoIndex = 0;
      this._endInnoIndex = this._totalResults;
    } else {
      if (paginationValues.offset === 0) {
        this._startInnoIndex = 0;
        this._endInnoIndex = tempLimit;
      } else if (paginationValues.offset > 0) {
        this._startInnoIndex = tempOffset;
        this._endInnoIndex += tempOffset;
      }
    }

  }


  /*
    the current lang of the user.
   */
  get currentLang(): string {
    return this.translateService.currentLang;
  }

  /*
    the language in which we want to display the innovation card..
   */
  get innovationsLang(): string {
    return this._selectedLang === '' ? 'en' : this._selectedLang;
  }

  /*
  getting the image src of the innovation.
 */
  getSrc(innovation: InnovCard): string {
    let src = '';
    const defaultSrc = 'https://res.cloudinary.com/umi/image/upload/v1535383716/app/default-images/image-not-available.png';

    if (innovation.principalMedia && innovation.principalMedia.type === 'PHOTO') {
      src = innovation.principalMedia.url;
    } else {
      const index = innovation.media.findIndex((item) => item.type === 'PHOTO');
      src = index === -1 ? defaultSrc : innovation.media[index].url;
    }

    if (src === '') {
      src = defaultSrc;
    }

    return src;
  }

  get innovationCards(): InnovCard[] {
    return this._innovationCards;
  }

  set innovationCards(value: InnovCard[]) {
    this._innovationCards = value;
  }

  get displaySpinner(): boolean {
    return this._displaySpinner;
  }

  get showFilterContainer(): boolean {
    return this._showFilterContainer;
  }

  get tags(): Array<Tag> {
    return this._tags;
  }

  get filterApplied(): Array<{ id: string; value: string; type: string }> {
    return this._filterApplied;
  }

  get addingFilter(): boolean {
    return this._addingFilter;
  }

  get totalResults(): number {
    return this._totalResults;
  }

  get tagLabel(): Array<{ label: string; id: string }> {
    return this._tagLabel;
  }

  get endLabelIndex(): number {
    return this._endLabelIndex;
  }

  get innovationDetails(): Array<{ text: string }> {
    return this._innovationDetails;
  }

  get startInnoIndex(): number {
    return this._startInnoIndex;
  }

  get endInnoIndex(): number {
    return this._endInnoIndex;
  }

}
