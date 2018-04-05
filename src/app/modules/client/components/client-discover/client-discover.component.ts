import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { card, tag } from './data';
import { InnovationService } from '../../../../services/innovation/innovation.service';

@Component({
  selector: 'app-client-discover',
  templateUrl: './client-discover.component.html',
  styleUrls: ['./client-discover.component.scss']
})
export class ClientDiscoverComponent implements OnInit {

  /*private _innovationTag: String = '';*/
 // private _innovationSearchTag: String = 'null'; /* Search input box innovation tag */
  card: Array<any> = card;
  tag: Array<any> = tag;
  private _config: string;


  constructor(private _titleService: TranslateTitleService,
              private _innovationService: InnovationService) {}


  ngOnInit(): void {
    /*this._titleService.setTitle('Découvrez nos dernières innovations'); TODO translate*/
    this._titleService.setTitle('DISCOVER.TITLE');
    /*this._innovationTag = 'DISCOVER.' + tag.name;*/
    this._innovationService.getAll(this._config).subscribe(innovations => {
      console.log(innovations)
    });
  }



}
