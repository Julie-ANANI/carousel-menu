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

  filterInnovations: Array<Innovation> = [];

  displaySpinner = true; // to show the spinner when we are fetching the data from the server.

  showFilterContainer = false; // to show or hide the filter container.

  tags: Array<Tag>; // to store the project tags.

  filterApplied: Array<{id: string, value: string, type: string}> = []; // to show the client the filters he added.

  addingFilter = false; // showing spinner when adding the filters.

  totalResults = 0; // saving the result that we get from the server.

  applyFilterClicked = false;

  private searchInput: string;

  selectedLang = '';

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

  initialSearch = [{'status': 'EVALUATING'}, {'status': 'DONE'}];

  constructor(private translateTitleService: TranslateTitleService,
              private innovationService: InnovationService,
              private translateService: TranslateService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this.translateTitleService.setTitle('DISCOVER.TITLE');

    this._config.search['$or'] = this.initialSearch;

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
    this.innovationService.getAll(this._config).first().subscribe(innovations => {
      this.totalInnovations = innovations.result;
      // this.totalResults = innovations._metadata.totalCount;
      this.loadInnovations();
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
    this.addingFilter = true;
    this.selectedLang = '';

    if (event.target['checked']) {
      this.filterApplied.push({id: event.target['id'], value: event.target['defaultValue'], type: event.target['name']});
    } else {
      const index = this.filterApplied.findIndex(name => name.id === event.target['id']);
      this.filterApplied.splice(index, 1);
    }

    this._config.limit = this.filterApplied.length > 0 ? 0 : this.initialConfigLimit;

    if (this.filterApplied.length > 1) {
      this.loadInnovations();
    } else {
      this.getAllInnovations();
    }

  }


  /*
   we disable the type and the language that are not selected.
  */
  checkDisable(id: string, type: string): boolean {

    if (this.filterApplied.length > 0) {
      const typeIndex = this.filterApplied.findIndex((item) => item.type === type);

      if (typeIndex !== -1) {
        const index = this.filterApplied.findIndex((item) => item.id === id);
        if (index === -1) {
          return true;
        }
      }

    }

    return false;
  }


  /*
    after fetching all the innovations from the server first we check the length of
    filterApplied then according to that we call the functions.
   */
  private loadInnovations() {

    if (this.filterApplied.length > 0) {
      this.filterInnovations = [];

        for (let i = 0; i < this.filterApplied.length; i++) {

          if (i === 0) {

            if (this.filterApplied[i].type === 'type') {
              this.typeFilter(this.totalInnovations, this.filterApplied[i].value);
            }

            if (this.filterApplied[i].type === 'status') {
              this.statusFilter(this.totalInnovations, this.filterApplied[i].value);
            }

            if (this.filterApplied[i].type === 'language') {
              this.selectedLang = this.filterApplied[i].value;
              this.langFilter(this.totalInnovations, this.filterApplied[i].value);
            }

          } else {

            if (this.filterApplied[i].type === 'type') {
              this.typeFilter(this.filterInnovations, this.filterApplied[i].value);
            }

            if (this.filterApplied[i].type === 'status') {
              this.statusFilter(this.filterInnovations, this.filterApplied[i].value);
            }

            if (this.filterApplied[i].type === 'language') {
              this.selectedLang = this.filterApplied[i].value;
              this.langFilter(this.filterInnovations, this.filterApplied[i].value);
            }

          }

        }

      this.searchInInnovationCards(this.filterInnovations);
    } else {
      this.searchInInnovationCards(this.totalInnovations);
    }

    this.addingFilter = false;

  }


  private typeFilter(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((item) => {
      return item.tags.findIndex((tag) => tag.type === value) !== -1;
    });
  }


  private statusFilter(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((item) => {
      return item.status === value;
    });
  }


  private langFilter(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((item) => {
      return item.innovationCards.findIndex((inno) => inno.lang === value) !== -1;
    });
  }


  /*
    based on the innovations array we pass, we load the innovation
    card.
   */
  private searchInInnovationCards(innovations: Array<Innovation>) {
    this._innovationCards = [];

    innovations.forEach((item) => {

      if (this.selectedLang === '') {
        for (let i = 0; i < item.innovationCards.length; i++) {
          this._innovationCards.push(item.innovationCards[i]);
        }
      } else {
        const index = item.innovationCards.findIndex(innovationCard => innovationCard.lang === this.innovationsLang);
        if (index !== -1) {
          this._innovationCards.push(item.innovationCards[index]);
        }
      }

    });

    this.totalResults = this._innovationCards.length;

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
      const index = innovation.media.findIndex((item) => item.type === 'PHOTO');
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

  /*  private checkFilter() {
    const tempFilter: Array<{status: string}> = [];

    // first we always check do we have status filter or not.
    const tempStatusFilter = this.filterApplied.filter((item) => item.type === 'status');
    if (tempStatusFilter.length > 0) {
      for (let i = 0; i < tempStatusFilter.length; i++) {
        tempFilter.push({status: tempStatusFilter[i].value});
      }
      this._config.search['$or'] = tempFilter;
    } else {
      this._config.search['$or'] = this.initialSearch;
    }

  }*/

  /* this.totalInnovations.forEach((innovation) => {
      const tempTypeFilter = this.filterApplied.filter((item) => item.type === 'type');
        if (tempTypeFilter.length > 0) {
          for (let i = 0; i < tempTypeFilter.length; i++) {
            innovation.tags.forEach((tag) => {
              const find = tempTypeFilter.findIndex((item) => item.value === tag.type);
              if (find !== -1) {
                this.filterInnovations.push(innovation);
              }
            });
          }
        }
      });*/

  /*innovation.tags.forEach((tag) => {
      const index = findType.findIndex((item: any) => item.value === tag.type);
      if (index !== -1) {
        this.filterInnovations.push(innovation);
      }
    });*/

}
