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

  private _innovationCards: InnovCard[]; // to hold the innovations based on the search.

  totalInnovations: Array<Innovation> = []; // to hold the total project result we get from the server.

  filterInnovations: Array<Innovation> = []; // in this we store the innovation that are filtered.

  localInnovations: Array<Innovation> = []; // we store the result of the total innovation to do functions on it.

  displaySpinner = true; // to show the spinner when we are fetching the data from the server.

  showFilterContainer = false; // to show or hide the filter container.

  tags: Array<Tag> = []; // to store the project tags.

  filterApplied: Array<{id: string, value: string, type: string}> = []; // to show the client the filters he added.

  addingFilter = false; // showing spinner when adding the filters.

  totalResults = 0; // saving the result that we get from the server.

  tagLabel: Array<{'label': string, 'id': string}> = []; // to store the label.

  endLabelIndex = 4; // to display the number of label item.

  applyFilterClicked = false; // to display the spinner when the user is applying the filters.

  selectedLang = ''; // set the lang when user select the lang in the filter.

  innovationDetails: Array<{text: string}> = []; // to store the innovation detail to send the search field.

  config = {
    fields: 'created innovationCards tags status',
    limit: 0,
    offset: 0,
    search: {
      isPublic: 1
    },
    sort: {
      created: -1
    }
  };

  paginationValue: ConfigTemplate = {}; // to pass the value in the pagination component.

  constructor(private translateTitleService: TranslateTitleService,
              private innovationService: InnovationService,
              private translateService: TranslateService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this.translateTitleService.setTitle('DISCOVER.TITLE');

    this.config.search['$or'] = [{'status': 'EVALUATING'}, {'status': 'DONE'}];

    this.paginationValue = {
      limit: this.config.limit,
      offset: this.config.offset
    };

    this.getAllInnovations();

    this.storedFilters();

  }


  /*
    based on the config we request to the server and get the results.
   */
  private getAllInnovations() {
    this.innovationService.getAll(this.config).first().subscribe(innovations => {
      this.displaySpinner = true;
      this.totalInnovations = innovations.result;
      this.initialize();
      // this.loadInnovations();
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'DISCOVER.ERROR');
    });
  }


  /*
    checking do we have any filters and limit in the session storage,
    if yes then assign to the filterApplied attribute.
   */
  private storedFilters() {
    const sessionValues = JSON.parse(sessionStorage.getItem('discover-filters')) || 0;

    if (sessionValues.length > 0) {
      this.filterApplied = sessionValues;
    } else {
      this.filterApplied = [];
    }

  }


  /*
    here we are assigning the server results to the local attribute
    to perform the actions on it.
   */
  private initialize() {
    this.localInnovations = this.totalInnovations;
    this.loadInnovations();
  }


  /*
  after fetching all the innovations and assigning to local attribute
  first we check the length of filterApplied then according to that
  we call the respective functions.
 */
  private loadInnovations() {

    if (this.filterApplied.length > 0) {
      this.filterInnovations = [];

      for (let i = 0; i < this.filterApplied.length; i++) {

        if (i === 0) {

          if (this.filterApplied[i].type === 'type') {
             this.filterType(this.localInnovations, this.filterApplied[i].value);
          }

          if (this.filterApplied[i].type === 'status') {
            this.filterStatus(this.localInnovations, this.filterApplied[i].value);
          }

          if (this.filterApplied[i].type === 'language') {
            this.selectedLang = this.filterApplied[i].value;
            this.filterLang(this.localInnovations, this.filterApplied[i].value);
          }

          if (this.filterApplied[i].type === 'label') {
            this.filterLabel(this.localInnovations, this.filterApplied[i].id);
          }

        } else {

          if (this.filterApplied[i].type === 'type') {
             this.filterType(this.filterInnovations, this.filterApplied[i].value);
          }

          if (this.filterApplied[i].type === 'status') {
            this.filterStatus(this.filterInnovations, this.filterApplied[i].value);
          }

          if (this.filterApplied[i].type === 'language') {
            this.selectedLang = this.filterApplied[i].value;
            this.filterLang(this.filterInnovations, this.filterApplied[i].value);
          }

          if (this.filterApplied[i].type === 'label') {
            this.filterLabel(this.filterInnovations, this.filterApplied[i].id);
          }

        }

      }
      this.populateTags(this.filterInnovations);
      this.searchInInnovationCards(this.filterInnovations);
    } else {
      this.populateTags(this.localInnovations);
      this.searchInInnovationCards(this.localInnovations);
    }

    this.displaySpinner = false;
    this.addingFilter = false;

  }


  private filterType(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((items) => {
      return items.tags.findIndex((tag) => tag.type === value) !== -1;
    });
  }


  private filterStatus(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((items) => {
      return items.status === value;
    });
  }


  private filterLang(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((items) => {
      return items.innovationCards.findIndex((inno) => inno.lang === value) !== -1;
    });

  }


  private filterLabel(innovations: Array<Innovation>, value: string) {
    this.filterInnovations = innovations.filter((items) => {
      return items.tags.findIndex((tag) => tag._id === value) !== -1;
    });
  }


  /*
    according to the innovations we pass we search for the tags in it
    and assign them to tags attributes.
   */
  private populateTags(innovations: Array<Innovation>) {
    this.tags = [];

    innovations.forEach((innovations) => {
      const index = this.filterApplied.findIndex((item) => item.type === 'type' || item.type === 'label' );

      if (index !== -1) {
        innovations.tags.forEach((tag) => {
          const index = this.filterApplied.findIndex((item) => item.type === 'type' ? item.id === tag.type : item.id === tag._id);
          if (index !== -1) {
            this.tags.push(tag);
          }
        });
      } else {
        innovations.tags.forEach((tag) => {
          const index = this.tags.findIndex((item) => item._id === tag._id);
          if (index === -1) {
            this.tags.push(tag);
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
    this.tagLabel = [];

    this.tags.forEach((items) => {
      const index = this.tagLabel.findIndex((item) => item.id === items._id);
      if (index === -1) {
        if (this.currentLang === 'en') {
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

      return 0;

    });

  }


  /*
    based on the innovations array we pass, we load the innovation
    card.
   */
  private searchInInnovationCards(innovations: Array<Innovation>) {
    this._innovationCards = [];
    this.innovationDetails = [];

    innovations.forEach((item) => {

      if (this.selectedLang === '') {
        for (let i = 0; i < item.innovationCards.length; i++) {
          this._innovationCards.push(item.innovationCards[i]);
          this.innovationDetails.push({'text': item.innovationCards[i].title});
        }
      } else {
        const index = item.innovationCards.findIndex(innovationCard => innovationCard.lang === this.innovationsLang);
        if (index !== -1) {
          this._innovationCards.push(item.innovationCards[index]);
          this.innovationDetails.push({'text': item.innovationCards[index].title});
        }
      }

    });

    this.totalResults = this._innovationCards.length;

  }


  /*
  here when the user types in the search field according to that we search for the innovations
  from the total innovation attributes and display it.
   */
  onValueSelected(value: string) {
    if (value === '') {
      this.displaySpinner = true;
      this.initialize();
    } else {
      this.displaySpinner = true;
      this.localInnovations = [];
      this.totalInnovations.forEach((innovation) => {
        innovation.innovationCards.forEach((innoCard) => {
          const find = innoCard.title.toLowerCase().includes(value.toLowerCase());
          if (find) {
            const index = this.localInnovations.findIndex((item) => item._id === innovation._id);
            if (index === -1) {
              this.localInnovations.push(innovation);
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
    this.showFilterContainer = true;
    this.applyFilterClicked = false;
  }


  /*
 check the value of applyFilterClicked, if false then assign the
 filters that are stored in the sessionStorage.
*/
  cancelFilter(event: Event) {
    event.preventDefault();

    this.showFilterContainer = false;

    if (!this.applyFilterClicked) {
      this.storedFilters();
    }

    this.checkFilterLength();

  }


  /*
    check the filterApplied length and calls the respective
    function.
   */
  checkFilterLength() {
    if (this.filterApplied.length > 0) {
      this.loadInnovations();
    } else {
      this.selectedLang = '';
      this.initialize();
    }
  }


  /*
    save the applied filters to session storage and close the container.
   */
  applyFilter() {
    this.applyFilterClicked = true;
    this.storeFilters();
    this.showFilterContainer = false;
  }


  /*
    here we are storing the filter values in the session storage.
   */
  private storeFilters() {
    sessionStorage.setItem('discover-filters', JSON.stringify(this.filterApplied));
  }


  /*
    when the applied filter is clicked to remove it.
   */
  removeFilter(value: string) {
    this.addingFilter = true;

    this.filterRemove(value);

    if (!this.showFilterContainer) {
      this.storeFilters();
    }

    this.checkFilterLength();

  }


  /*
   remove the filter from the filterApplied attribute based on the
   value.
  */
  filterRemove(value: string) {
    const index = this.filterApplied.findIndex(name => name.id === value);
    this.filterApplied.splice(index, 1);
  }


  /*
  when click all link is clicked to remove all the filters.
 */
  removeAllFilter(event: Event) {
    event.preventDefault();

    this.addingFilter = true;

    this.filterApplied = [];

    if (!this.showFilterContainer) {
      this.storeFilters();
    }

    this.checkFilterLength();

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


  /*
    checking the filterApplied contains the keys, if yes then
    we make the checkbox ticked.
   */
  filterChecked(value: string, type: string): boolean {
    const index = this.filterApplied.findIndex((item) => item.id === value && item.type === type);
    return index !== -1;
  }


  /*
  we disable the type that are not selected.
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


  getStatusName(value: string): string {
    if (value === 'DONE') {
      if (this.currentLang === 'en') {
        return 'Completed'
      } else {
        return 'Terminé'
      }
    }

    if (value === 'EVALUATING') {
      if (this.currentLang === 'en') {
        return 'In progress'
      } else {
        return 'En cours'
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
      if (this.endLabelIndex < this.tagLabel.length) {
        const diff = this.tagLabel.length - this.endLabelIndex;
        if (diff >= 4) {
          this.endLabelIndex += 4;
        } else {
          this.endLabelIndex += diff;
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

    if (item['type'] === 'status' ) {
      return this.getStatusName(item['value']);
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
        return 'English'
      } else {
        return 'Anglais'
      }
    }

    if (value === 'fr') {
      if (this.currentLang === 'en') {
        return 'French'
      } else {
        return 'Français'
      }
    }

  }


  /*
    when there is change in the pagination we detect the change and
    call the service with the new limit and offset value.
   */
  changePagination(paginationValues: ConfigTemplate) {
    window.scroll(0, 0);
    /*this._config.offset = paginationValues.offset;
    this._config.limit = paginationValues.limit;*/
    console.log(paginationValues);
    this.config.limit = paginationValues.limit;
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

  /*  private populateLang(innovation: Array<Innovation>) {
    innovation.forEach((items) => {
      items.innovationCards.forEach((inno) => {
        const index = this.innoLang.findIndex((item) => item.lang === inno.lang);
        if (index === -1) {
          this.innoLang.push({'lang': inno.lang});
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

      return 0;

    });

    console.log(this.innoLang);

  }*/
  /* /!*
   when the user starts typing the results we are start
   filtering the innovation according to that.
  *!/
 onSearchValue(event: string) {
   console.log(event);


   /!*if (event.value !== '') {
     const searchInput = String(event.value).toLowerCase();
     this._suggestionInnov = this.innovationDetails.filter((innovTitle) => {
       return innovTitle.text.toLowerCase().includes(searchInput);
     });
   } else {
     this.initialize();
   }*!/
 }*/

}
