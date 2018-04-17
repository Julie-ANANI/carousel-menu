import { Component, OnInit } from '@angular/core';

// Services
import { TranslateTitleService } from '../../../../services/title/title.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';


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
  private innovationCards: InnovCard[] = [];
  private innovationLang: string;
  private totalInnovations: number;
  private innovationCardId: object;

  private _config = {
    fields: '',
    limit: 0,
    offset: 0,
    search: {
      isPublic: 1,
      status: 'DONE'
    },
    sort: {
      created: -1
    }
  };

  constructor(private _titleService: TranslateTitleService,
              private _innovationService: InnovationService) {
  }

  ngOnInit(): void {
    /*this._titleService.setTitle('Découvrez nos dernières innovations'); TODO translate*/
    this._titleService.setTitle('DISCOVER.TITLE');
    /*this._innovationTag = 'DISCOVER.' + tag.name;*/
    this.loadAllInnovations(this._config);
  }

  loadAllInnovations(config: any): void  {
    this._config = config;
    this._innovationService.getAll(this._config).subscribe(innovations => {

      this.innovations = innovations.result;
      this.totalInnovations = innovations._metadata.totalCount;

      this.innovations.forEach((items) => {
        if (items.innovationCards.length === 2) {
          // english innovation
          this.innovationCardId = items.innovationCards[1];
          this.innovationLang = 'fr';
          this.getInnovationCard(this.innovationCardId);
        } else {
          // only innovation present
          this.innovationCardId = items.innovationCards[0];
          this.innovationLang = items.innovationCards[0].lang;
          this.getInnovationCard(this.innovationCardId);
        }
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



