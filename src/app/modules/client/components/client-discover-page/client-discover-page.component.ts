import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService} from '@ngx-translate/core';
import { Innovation } from '../../../../models/innovation';
import { InnovCard } from '../../../../models/innov-card';
import { ConfigTemplate } from '../../../../models/config';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Tag } from '../../../../models/tag';

@Component({
  selector: 'app-client-discover-page',
  templateUrl: './client-discover-page.component.html',
  styleUrls: ['./client-discover-page.component.scss']
})

export class ClientDiscoverPageComponent implements OnInit {

  // private innovations: Array<Innovation>;

  private _innovationCards: InnovCard[]; // to hold the innovations based on the search.

  private totalInnovations: Array<Innovation> = []; // to hold the total project result we get from the server.

  selectedLang = '';

  displaySpinner = true; // to show the spinner when we are fetching the data from the server.

  showFilterContainer = false; // to show or hide the filter container.

  tags: Array<Tag>; // to store the project tags.

  filterApplied: Array<{id: string, value: string, type: string}> = []; // to show the client the filters he added.

  addingFilter = false; // showing spinner when adding the filters.

  totalResults = 0; // saving the result that we get from the server.

  showingResult = 0; // innovations we are showing to user from all the innovations.

  applyFilterClicked = false;

  private searchInput: string;

  private innovationDetails: Array<{text: string, id: string}>; // to store the innovation title of all the innovations for search field

  private _suggestionInnov: Array<{text: string, id: string}>; // to show suggestions to user below the search field when he types

  private _config = {
    fields: 'created innovationCards tags status',
    limit: 20,
    offset: 0,
    search: {
      isPublic: 1
    },
    sort: {
      created: -1
    }
  };

  paginationValue: ConfigTemplate = {}; // to pass the value in the pagination component.

  initialConfigLimit = 20;

  constructor(private translateTitleService: TranslateTitleService,
              private innovationService: InnovationService,
              private translateService: TranslateService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this.translateTitleService.setTitle('DISCOVER.TITLE');

    this._config.search['$or'] = [{'status': 'EVALUATING'}, {'status': 'DONE'}];

    this.paginationValue = {
      limit: this._config.limit,
      offset: this._config.offset
    };

    this.storedFilters();

    this.initialize();

  }


  /*
    checking do we have any filters and limit in the session storage,
    if yes then assign to the filterApplied attribute.
   */
  private storedFilters() {
    const sessionValues = JSON.parse(sessionStorage.getItem('discover-filters')) || 0;

    if (sessionValues.length > 0) {
      this.filterApplied = sessionValues;
      this._config.limit = 0;
    } else {
      this.filterApplied = [];
      this._config.limit = this.initialConfigLimit;
    }

    /*const sessionLimit = JSON.parse(sessionStorage.getItem('discover-limit'));
    this._config.limit = sessionLimit === null ? this.reLimitValue : sessionLimit;*/
  }


  /*
    checking the filterApplied contains the keys,
    if yes then we make the checkbox ticked.
   */
  filterChecked(id: string): boolean {
    const index = this.filterApplied.findIndex((item) => item.id === id);
    return index !== -1;
  }


  private initialize() {
    this.innovationDetails = [];
    this.searchInput = '';
    this.getAllInnovations();
  }


  /*
    based on the config we request to the server and get the results.
   */
  private getAllInnovations() {
    console.log(this._config);
    this.innovationService.getAll(this._config).first().subscribe(innovations => {
      this.totalInnovations = innovations.result;
      this.addingFilter = true;
      this.totalResults = innovations._metadata.totalCount;
      this.loadInnovationCards();
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'DISCOVER.ERROR');
    }, () => {
      this.displaySpinner = false;
      this.addingFilter = false;
    });
  }


  /*
    when there is change in the pagination we detect the change and
    call the service with the new limit and offset value.
   */
  changePagination(paginationValues: ConfigTemplate) {
    window.scroll(0, 0);
    this._config.offset = paginationValues.offset;
    this.initialConfigLimit = this._config.limit = paginationValues.limit;
    this.getAllInnovations();
  }


  /*
    showing the filter container.
   */
  addFilter(event: Event) {
    event.preventDefault();
    this.showFilterContainer = true;
    this.applyFilterClicked = false;
  }


  /*
    check the value of applyFilterClicked, if false then assign the
    filters that are stored in the sessionStorage.
   */
  cancelFilter(event: Event) {
    event.preventDefault();

    if (!this.applyFilterClicked) {
      this.storedFilters();
      this.getAllInnovations();
    }

    this.showFilterContainer = false;

  }


  /*
    save the applied filters to session storage and close the container.
   */
  applyFilter(event: Event) {
    event.preventDefault();
    sessionStorage.setItem('discover-filters', JSON.stringify(this.filterApplied));
    this.applyFilterClicked = true;
    this.showFilterContainer = false;
  }


  toggleFilter(event: Event) {

    if (event.target['checked']) {
      this.filterApplied.push({id: event.target['id'], value: event.target['defaultValue'], type: event.target['name']});
    } else {
      const index = this.filterApplied.findIndex(name => name.id === event.target['id']);
      this.filterApplied.splice(index, 1);
    }

    this._config.limit = this.filterApplied.length > 0 ? 0 : this.initialConfigLimit;
    this.getAllInnovations();

  }


  /*
    after fetching all the innovations from the server we are pushing them to the
    innovationCard attribute to show the user.
   */
  private loadInnovationCards() {
    this._innovationCards = [];

    this.totalInnovations.forEach((items) => {

      let index = items.innovationCards.findIndex(innovationCard => innovationCard.lang === this.innovationsLang);

      // if we do not have the innovation in the english language then we show the innovation i.e. on index [0].
      if (index === -1) {
        index = 0;
      }

      this._innovationCards.push(items.innovationCards[index]);

      this.showingResult = this._innovationCards.length;

    });

  }


  onSearchValue(event: any) {
    if (event.value !== '') {
      const searchInput = String(event.value).toLowerCase();
      this._suggestionInnov = this.innovationDetails.filter((innovTitle) => {
        return innovTitle.text.toLowerCase().includes(searchInput);
      });
    } else {
      this.initialize();
    }
  }


  get suggestionInnov(): Array<{ text: string; id: string }> {
    return this._suggestionInnov;
  }


  onValueSelected(event: any) {
    if (event.value.text !== '') {
      this._innovationCards = [];
      this.innovationService.getInnovationCard(event.value.id).subscribe(result => {
        this._innovationCards.push(result);
      });
    }
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
      const index = innovation.media.findIndex((media) => media.type === 'PHOTO');
      src = index === -1 ? defaultSrc : innovation.media[index].url;
    }

    if (src === '') {
      src = defaultSrc;
    }

    return src;
  }


  /*
    getting the current lang of the user.
   */
  get currentLang(): string {
    return this.translateService.currentLang;
  }


  /*
    getting the language of the innovations that we want to display.
   */
  get innovationsLang(): string {
    return this.selectedLang === '' ? 'en' : this.selectedLang;
  }


  get innovationCards(): InnovCard[] {
    return this._innovationCards;
  }

  set innovationCards(value: InnovCard[]) {
    this._innovationCards = value;
  }

  get config(): { fields: string; limit: number; offset: number; search: { isPublic: number }; sort: { created: number } } {
    return this._config;
  }

  set config(value: { fields: string; limit: number; offset: number; search: { isPublic: number }; sort: { created: number } }) {
    this._config = value;
  }

  /*sortInnovations(innovations: any) {
   this._innovationCards = innovations.sort((a: any, b: any) => {
     const a1: any = new Date(a.created);
     const b1: any = new Date(b.created);
     return b1 - a1;
   });
 }*/

}
