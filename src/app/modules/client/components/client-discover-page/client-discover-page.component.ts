import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateService} from '@ngx-translate/core';
import { Innovation } from '../../../../models/innovation';
import { InnovCard } from '../../../../models/innov-card';

@Component({
  selector: 'app-client-discover-page',
  templateUrl: './client-discover-page.component.html',
  styleUrls: ['./client-discover-page.component.scss']
})

export class ClientDiscoverPageComponent implements OnInit {

  // private innovations: Array<Innovation>;
  private _innovationCards: InnovCard[]; // to hold the innovations based on the search.
  private totalInnovations: Array<Innovation> = [];
  // private innovationCardId: string;

  selectedLang = '';

  private searchInput: string;
  private innovationDetails: Array<{text: string, id: string}>; // array to store the innovation title of all the innovations for search field
  private _suggestionInnov: Array<{text: string, id: string}>; // to show suggestions to user below the search field when he types

  private _config = {
    fields: '',
    limit: 0,
    offset: 0,
    search: {
      isPublic: 1
    },
    sort: {
      created: -1
    }
  };

  constructor(private translateTitleService: TranslateTitleService,
              private innovationService: InnovationService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.translateTitleService.setTitle('DISCOVER.TITLE');

    for (let i = 0; i < 2; i++) {
      i === 0 ? this._config.search['status'] = 'EVALUATING' : this._config.search['status'] = 'DONE';
      this.initialize();
    }

   /* this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log(this.currentLang);
      if (this.userDefaultLang !== this.translateService.currentLang) {
        this.initialize();
      }
    });*/

  }

  initialize(): void {
    this._innovationCards = [];
    this.innovationDetails = [];
    this.searchInput = '';
    // this.userDefaultLang = this.translateService.currentLang;
    this.getAllInnovations(this._config);
  }


  getAllInnovations(config: any) {
    this._config = config;
    this.innovationService.getAll(this._config).subscribe(innovations => {
      innovations.result.forEach((items) => {
        this.totalInnovations.push(items);
      });
      this.loadInnovationCards(this.totalInnovations);
    });
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

  loadInnovationCards(innovations: Array<Innovation>) {
    innovations.forEach((items) => {
      let index = items.innovationCards.findIndex(innovationCard => innovationCard.lang === this.innovationsLang);

      // if we do not have the innovation in the english language then we show the innovation i.e. on index [0].
      if (index === -1) {
        index = 0;
      }

      this.getInnovationCard(items.innovationCards[index]._id);
    });
  }

  getInnovationCard(id: any) {
    this.innovationService.getInnovationCard(id).subscribe(result => {
      this.innovationDetails.push({text: result.title, id: result._id});
      const index = this._innovationCards.findIndex((item) => item._id === result._id);
      if (index === -1) {
        this._innovationCards.push(result);
      }
      this.sortInnovations(this._innovationCards);
    });
  }

  sortInnovations(innovations: any) {
    this._innovationCards = innovations.sort((a: any, b: any) => {
      const a1: any = new Date(a.created);
      const b1: any = new Date(b.created);
      return b1 - a1;
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

  get currentLang(): string {
    return this.translateService.currentLang;
  }

  // we are getting the language of the innovations that we want to display.
  get innovationsLang(): string {
    return this.selectedLang === '' ? 'en' : this.selectedLang;
  }

  getSrc(innovation: InnovCard): string {
    let src = '';

    if (innovation.principalMedia && innovation.principalMedia.type === 'PHOTO') {
      src = innovation.principalMedia.url;
    } else {
      const index = innovation.media.findIndex((media) => media.type === 'PHOTO');
      src = index === -1 ? '' : innovation.media[index].url;
    }

    return src;
  }

  get innovationCards(): InnovCard[] {
    return this._innovationCards;
  }

  set innovationCards(value: InnovCard[]) {
    this._innovationCards = value;
  }

}
