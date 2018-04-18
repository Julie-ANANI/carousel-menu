import { Component, OnInit } from '@angular/core';

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

export class ClientDiscoverComponent implements OnInit{

  private innovations: Array<Innovation>;
  private innovationCards: InnovCard[];
  private totalInnovations: number;
  private innovationCardId: any;
  private defaultLang: string;

  private _config = {
    fields: '',
    limit: 0,
    offset: 0,
    search: {
      isPublic: 1,
      status: 'DONE',
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

    this._titleService.setTitle('DISCOVER.TITLE');

    this.innovationCards = [];

    this.defaultLang = this._translateService.currentLang;

    this.loadAllInnovations(this._config);

    this._translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      if (this.defaultLang !== this._translateService.currentLang) {
        this.ngOnInit();
      }
    });

  }

  loadAllInnovations(config: any): void  {
    this._config = config;
    this._innovationService.getAll(this._config).subscribe(innovations => {
      this.innovations = innovations.result;
      this.totalInnovations = innovations._metadata.totalCount;

      this.innovations.forEach((items) => {
        let index = items.innovationCards.findIndex(card => card.lang === this.defaultLang);

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
       this.innovationCards.push(result);
    });
  }

  set innovationCard(value: Array<any>) {
    this.innovationCards = value;
  }

  get innovationCard(): Array<any> {
    return this.innovationCards;
  }

}



