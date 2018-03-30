import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';

@Component({
  selector: 'app-client-discover',
  templateUrl: './client-discover.component.html',
  styleUrls: ['./client-discover.component.scss']
})
export class ClientDiscoverComponent implements OnInit {

  constructor(private _titleService: TranslateTitleService) {}

  ngOnInit(): void {
    /*this._titleService.setTitle('Découvrez nos dernières innovations'); TODO translate*/
    this._titleService.setTitle('DISCOVER.TITLE');
  }

}
