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

  filterInnovations: Array<Innovation> = []; // in this we store the innovation that are filtered.

  displaySpinner = true; // to show the spinner when we are fetching the data from the server.

  showFilterContainer = false; // to show or hide the filter container.

  tags: Array<Tag> = []; // to store the project tags.

  filterApplied: Array<{id: string, value: string, type: string}> = []; // to show the client the filters he added.

  addingFilter = false; // showing spinner when adding the filters.

  totalResults = 0; // saving the result that we get from the server.

  tagLabel: Array<{'label': string, 'id': string}> = [];

  tagType: Array<{'type': string, 'id': string}> = [];

  innoStatus: Array<{'status': string}> = [];

  innoLang: Array<{'lang': string, 'id': string}> = [];

  endLabelIndex = 4;

  endTypeIndex = 4;

  applyFilterClicked = false;

  private searchInput: string;

  selectedLang = ''; // set the lang when user select the lang in the filter.

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
      this.loadInnovations();
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'DISCOVER.ERROR');
    }, () => {
      this.displaySpinner = false;
      this.addingFilter = false;
    });
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
             this.typeFilter(this.totalInnovations, this.filterApplied[i].id);
          }

          if (this.filterApplied[i].type === 'status') {
            this.statusFilter(this.totalInnovations, this.filterApplied[i].value);
          }

          if (this.filterApplied[i].type === 'language') {
            this.selectedLang = this.filterApplied[i].value;
            this.langFilter(this.totalInnovations, this.filterApplied[i].id);
          }

          if (this.filterApplied[i].type === 'label') {
            this.labelFilter(this.totalInnovations, this.filterApplied[i].id);
          }

        } else {

          if (this.filterApplied[i].type === 'type') {
             this.typeFilter(this.filterInnovations, this.filterApplied[i].id);
          }

          if (this.filterApplied[i].type === 'status') {
            this.statusFilter(this.filterInnovations, this.filterApplied[i].value);
          }

          if (this.filterApplied[i].type === 'language') {
            this.selectedLang = this.filterApplied[i].value;
            this.langFilter(this.filterInnovations, this.filterApplied[i].id);
          }

          if (this.filterApplied[i].type === 'label') {
            this.labelFilter(this.filterInnovations, this.filterApplied[i].id);
          }

        }

      }
      this.innovationLang(this.filterInnovations);
      this.innovationStatus(this.filterInnovations);
      this.tagFilter(this.filterInnovations);
      this.searchInInnovationCards(this.filterInnovations);
      console.log(this.filterInnovations);
    } else {
      this.innovationLang(this.totalInnovations);
      this.innovationStatus(this.totalInnovations);
      this.tagFilter(this.totalInnovations);
      this.searchInInnovationCards(this.totalInnovations);
    }

    this.addingFilter = false;

  }


  private typeFilter(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((items) => {
      return items.tags.findIndex((tag) => tag._id === value) !== -1;
    });
  }


  private statusFilter(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((items) => {
      return items.status === value;
    });
  }


  private langFilter(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((items) => {
      return items.innovationCards.findIndex((inno) => inno.lang === value) !== -1;
    });
  }


  private labelFilter(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((items) => {
      return items.tags.findIndex((tag) => tag._id === value) !== -1;
    });
  }


  private innovationStatus(innovation: Array<Innovation>) {
    this.innoStatus = [];

    innovation.forEach((items) => {
      const index = this.innoStatus.findIndex((item) => item.status === items.status);
      if (index === -1) {
        this.innoStatus.push({'status': items.status});
      }
    });

    this.innoStatus.sort((a: any, b: any) => {
      if (a.status < b.status) {
        return -1;
      }

      if (a.status > b.status) {
        return 1;
      }

      return 0

    });

  }


  private innovationLang(innovation: Array<Innovation>) {
    this.innoLang = [];

    innovation.forEach((items) => {
      items.innovationCards.forEach((inno) => {
        const index = this.innoLang.findIndex((item) => item.lang === inno.lang);
        if (index === -1) {
          this.innoLang.push({'lang': inno.lang, 'id': items._id});
        }
      });
    });

    this.innoLang.sort((a: any, b: any) => {
      if (a.lang < b.lang) {
        return -1;
      }

      if (a.lang > b.lang) {
        return 1;
      }

      return 0

    });

  }


  private tagFilter(innovations: Array<Innovation>) {
    this.tags = [];

    innovations.forEach((items) => {
      items.tags.forEach((tag) => {
        this.tags.push(tag);
      });
    });

    this.displayLabelFilter();

    this.displayTypeFilter();

  }


  private displayLabelFilter() {
    this.tagLabel = [];

    this.tags.forEach((items) => {
      const index = this.tagLabel.findIndex((item) => item.id === items._id);
      if (index === -1) {
        this.tagLabel.push({'label': items.label.en, 'id': items._id});
      }
    });

    this.tagLabel.sort((a: any, b: any) => {
      if (a.label < b.label) {
        return -1;
      }

      if (a.label > b.label) {
        return 1;
      }

      return 0

    });

  }


  private displayTypeFilter() {
    this.tagType = [];

    this.tags.forEach((items) => {
      const index = this.tagType.findIndex((item) => item.type === items.type);
      if (index === -1) {
        this.tagType.push({'type': items.type, 'id': items._id});
      }
    });

    this.tagType.sort((a: any, b: any) => {
      if (a.type < b.type) {
        return -1;
      }

      if (a.type > b.type) {
        return 1;
      }

      return 0

    });

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


   getLabelName(value: string): string {
    if (value) {
      return `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`;
    }

    return 'Unknown';

   }

  getLangName(value: string): string {
    if (value === 'en') {
      return 'English';
    }

    if (value === 'fr') {
      return 'French';
    }

  }


  getStatusName(value: string): string {
    if (value === 'DONE') {
      return 'Completed';
    }

    if (value === 'EVALUATING') {
      return 'In progress';
    }

  }


  changeIndex(event: Event, value: string) {
    event.preventDefault();

    if (value === 'label') {
      if (this.endLabelIndex < this.tagLabel.length) {
        const diff = this.tagLabel.length - this.endLabelIndex;
        if (diff >= 4) {
          this.endLabelIndex += 4;
        } else {
          this.endLabelIndex += diff;
        }
      }
    }

    if (value === 'type') {
      if (this.endTypeIndex < this.tagLabel.length) {
        const diff = this.tagLabel.length - this.endTypeIndex;
        if (diff >= 4) {
          this.endTypeIndex += 4;
        } else {
          this.endTypeIndex += diff;
        }
      }
    }

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


  /*
    checking the filterApplied contains the keys,
    if yes then we make the checkbox ticked.
   */
  filterChecked(value: string, type: string): boolean {
    const index = this.filterApplied.findIndex((item) => item.id === value && item.type === type);
    return index !== -1;
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
  applyFilter() {
    sessionStorage.setItem('discover-filters', JSON.stringify(this.filterApplied));
    this.applyFilterClicked = true;
    this.showFilterContainer = false;
  }


  /*
    based on the checkbox checked or unchecked we effect the filterApplied attribute,
    and call the related functions.
   */
  toggleFilter(event: Event) {
    this.addingFilter = true;
    this.selectedLang = '';

    if (event.target['checked']) {
      this.filterApplied.push({id: event.target['id'], value: event.target['defaultValue'], type: event.target['name']});
    } else {
      this.filterRemove(event.target['id']);
    }

    this.checkFilterLength();

  }


  filterRemove(id: string) {
    const index = this.filterApplied.findIndex(name => name.id === id);
    this.filterApplied.splice(index, 1);
  }


  checkFilterLength() {
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
  checkDisable(value: string, type: string): boolean {

    if (this.filterApplied.length > 0) {
      const typeIndex = this.filterApplied.findIndex((item) => item.type === type);

      if (typeIndex !== -1) {
        const index = this.filterApplied.findIndex((item) => item.id === value);
        if (index === -1) {
          return true;
        }
      }

    }

    return false;
  }


  removeFilter(id: string) {
    this.addingFilter = true;
    this.filterRemove(id);
    this.applyFilter();
    this.checkFilterLength();
  }


  removeAllFilter(event: Event) {
    this.addingFilter = true;
    event.preventDefault();
    this.filterApplied = [];
    this.applyFilter();
    this.checkFilterLength();
  }


  getFilterName(item: Array<{id: string, value: string, type: string}>): string {
    if (item['type'] === 'language' ) {
      return this.getLangName(item['value']);
    }

    if (item['type'] === 'type' ) {
      return this.getTypeName(item['value']);
    }

    if (item['type'] === 'status' ) {
      return this.getStatusName(item['value']);
    }

    if (item['type'] === 'label' ) {
      return this.getLabelName(item['value']);
    }

    return '';

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
    the current lang of the user.
   */
  get currentLang(): string {
    return this.translateService.currentLang;
  }

  /*
    the language in which we want to display the innovation card..
   */
  get innovationsLang(): string {
    return this.selectedLang === '' ? 'en' : this.selectedLang;
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

  /* private typeFilter(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((item) => {
      return item.tags.findIndex((tag) => tag.type === value) !== -1;
    });
  }*/

  /*
    private displayLabelFilter() {
    this.tagLabel = [];

    this.tags.forEach((items) => {
      const index = this.tagLabel.findIndex((item) => item.id === items._id);
      if (index === -1) {
        if (this.innovationsLang === 'en') {
          this.tagLabel.push({'label': items.label.en, 'id': items._id});
        } else {
          this.tagLabel.push({'label': items.label.fr, 'id': items._id});
        }
      }
    });

    this.tagLabel.sort((a: any, b: any) => {
      if (a.label < b.label) {
        return -1;
      }

      if (a.label > b.label) {
        return 1;
      }

      return 0

    });

  }
   */

}
