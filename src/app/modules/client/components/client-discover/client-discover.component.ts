import {Component, OnInit} from '@angular/core';

// Services
import { TranslateTitleService } from '../../../../services/title/title.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { LangChangeEvent, TranslateService} from '@ngx-translate/core';

// Models
import { Innovation } from '../../../../models/innovation';
import { InnovCard } from '../../../../models/innov-card';

@Component({
  selector: 'app-client-discover',
  templateUrl: './client-discover.component.html',
  styleUrls: ['./client-discover.component.scss']
})

export class ClientDiscoverComponent implements OnInit {

  private innovations: Array<Innovation>;
  private _innovationCards: InnovCard[];
  private totalInnovations: number;
  private innovationCardId: string;
  private userDefaultLang: string;
  private searchInput: string;
  private innovationDetails: Array<{text: string, id: string}>; // array to store the innovation title of all the innovations for search field
  private _suggestionInnov: Array<{text: string, id: string}>; // to show suggestions to user below the search field when he types

  private _config = {
    fields: '',
    limit: 0,
    offset: 0,
    search: {
      isPublic: 1,
      status: 'DONE' || 'EVALUATING',
    },
    sort: {
      created: -1
    }
  };

  constructor(private _titleService: TranslateTitleService,
              private _innovationService: InnovationService,
              private _translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.initialize();

    this._translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      if (this.userDefaultLang !== this._translateService.currentLang) {
        this.initialize();
      }
    });

  }

  initialize(): void {
    this._titleService.setTitle('DISCOVER.TITLE');

    this._innovationCards = [];

    this.innovationDetails = [];

    this.userDefaultLang = this._translateService.currentLang;

    this.searchInput = '';

    this.loadAllInnovations(this._config);
  }

  loadAllInnovations(config: any): void  {
    this._config = config;
    this._innovationService.getAll(this._config).subscribe(innovations => {
      this.innovations = innovations.result;
      this.totalInnovations = innovations._metadata.totalCount;

      this.innovations.forEach((items) => {
        let index = items.innovationCards.findIndex(card => card.lang === this.userDefaultLang);

        // we do not have the innovation in the default language
        if ( index === -1 ) {
          index = items.innovationCards.findIndex(card => card.lang === 'en'); // default language index
        }

        this.innovationCardId = items.innovationCards[index]._id;
        this.getInnovationCard(this.innovationCardId);

      })
    });
  }

  getInnovationCard(id: any) {
    this._innovationService.getInnovationCard(id).subscribe(result => {
      this.innovationDetails.push({text: result.title, id: result._id});
      this._innovationCards.push(result);
    });
  }

  get innovationCards(): InnovCard[] {
    return this._innovationCards;
  }

  set innovationCards(value: InnovCard[]) {
    this._innovationCards = value;
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
      this._innovationService.getInnovationCard(event.value.id).subscribe(result => {
        this._innovationCards.push(result);
      });
    }
  }

}



