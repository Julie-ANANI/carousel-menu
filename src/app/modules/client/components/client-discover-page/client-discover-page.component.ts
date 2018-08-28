import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService} from '@ngx-translate/core';
import { Innovation } from '../../../../models/innovation';
import { InnovCard } from '../../../../models/innov-card';
import {ConfigTemplate} from '../../../../models/config';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-client-discover-page',
  templateUrl: './client-discover-page.component.html',
  styleUrls: ['./client-discover-page.component.scss']
})

export class ClientDiscoverPageComponent implements OnInit {

  // private innovations: Array<Innovation>;
  private _innovationCards: InnovCard[]; // to hold the innovations based on the search.
  private totalInnovations: Array<Innovation>;

  selectedLang = '';
  totalValue = 0;
  displaySpinner = true;
  showFilterContainer = false;

  private searchInput: string;
  private innovationDetails: Array<{text: string, id: string}>; // array to store the innovation title of all the innovations for search field
  private _suggestionInnov: Array<{text: string, id: string}>; // to show suggestions to user below the search field when he types

  private _config = {
    fields: 'created innovationCards',
    limit: 20,
    offset: 0,
    search: {
      isPublic: 1
    },
    sort: {
      created: -1
    }
  };

  configValue: ConfigTemplate = {};

  constructor(private translateTitleService: TranslateTitleService,
              private innovationService: InnovationService,
              private translateService: TranslateService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this.translateTitleService.setTitle('DISCOVER.TITLE');
    this._config.search['$or'] = [{'status': 'EVALUATING'}, {'status': 'DONE'}];
    this.configValue = {
      limit: this._config.limit,
      offset: this._config.offset
    };
    this.initialize();
  }

  initialize() {
    this.innovationDetails = [];
    this.totalInnovations = [];
    this.searchInput = '';
    this.getAllInnovations();
  }


  getAllInnovations() {
    this.innovationService.getAll(this._config).first().subscribe(innovations => {
      this.totalInnovations = innovations.result;
      this.totalValue = innovations._metadata.totalCount;
      this.loadInnovationCards();
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'DISCOVER.ERROR');
    }, () => {
      this.displaySpinner = false;
    });
  }

  configChange(configValues: ConfigTemplate) {
    window.scroll(0, 0);
    this._config.offset = configValues.offset;
    this._config.limit = configValues.limit;
    this.getAllInnovations();
  }

/*  loadAllInnovations(config: any): void  {
    // this._config = config;

    this.innovationService.getAll(config).subscribe(innovations => {
      // this.innovations = innovations.result;
      // this.totalInnovations = innovations._metadata.totalCount;

      innovations.result.forEach((items) => {
        this.totalInnovations.push(items);
      });

      this.loadInnovationCards(this.totalInnovations);

      // this.loadInnovationCards(innovations.result);

      /!*this.innovations.forEach((items) => {
        // let index = items.innovationCards.findIndex(card => card.lang === this.userDefaultLang);
        let index = items.innovationCards.findIndex(card => card.lang === 'en');
        console.log(index);

        // if we do not have the innovation in the english language then we show the innovation i.e. on index [0].

        // we do not have the innovation in the default language
        /!*if ( index === -1 ) {
          index = items.innovationCards.findIndex(card => card.lang === 'en'); // default language index
        }*!/

        this.innovationCardId = items.innovationCards[index]._id;
        this.getInnovationCard(this.innovationCardId);

      })*!/
    });

  }*/

  loadInnovationCards() {
    this._innovationCards = [];

    this.totalInnovations.forEach((items) => {
      let index = items.innovationCards.findIndex(innovationCard => innovationCard.lang === this.innovationsLang);

      // if we do not have the innovation in the english language then we show the innovation i.e. on index [0].
      if (index === -1) {
        index = 0;
      }

      this._innovationCards.push(items.innovationCards[index]);

    });

  }

  /*sortInnovations(innovations: any) {
    this._innovationCards = innovations.sort((a: any, b: any) => {
      const a1: any = new Date(a.created);
      const b1: any = new Date(b.created);
      return b1 - a1;
    });
  }*/

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

  get currentLang(): string {
    return this.translateService.currentLang;
  }

  // we are getting the language of the innovations that we want to display.
  get innovationsLang(): string {
    return this.selectedLang === '' ? 'en' : this.selectedLang;
  }

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

}
