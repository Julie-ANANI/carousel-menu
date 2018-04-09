import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../models/innovation';

@Component({
  selector: 'app-client-discover',
  templateUrl: './client-discover.component.html',
  styleUrls: ['./client-discover.component.scss']
})
export class ClientDiscoverComponent implements OnInit {

  /*private _innovationTag: String = '';*/
 // private _innovationSearchTag: String = 'null'; /* Search input box innovation tag */
  private innovations: Array<Innovation>;
  private totalInnovations: number;
  private innovationCardId: object;
  // private innovationCards: any;
  private innovationCardTitle: any;
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

          this.innovationCardId = items.innovationCards[1];
          this.getInnovation(this.innovationCardId);
        } else {
          this.innovationCardId = items.innovationCards[0];
        }
      })
    });
  }

  getInnovation(id: any) {
    this._innovationService.getInnovationCard(id).subscribe(result => {
      this.innovationCardTitle = result.title;
      console.log(this.innovationCardTitle);
    });
  }

}
