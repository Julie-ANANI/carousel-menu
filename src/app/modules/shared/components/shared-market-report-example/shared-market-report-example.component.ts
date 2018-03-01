/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit } from '@angular/core';

import { MediaService } from '../../../../services/media/media.service';

@Component({
  selector: 'mr-example',
  templateUrl: 'shared-market-report-example.component.html',
  styleUrls: ['shared-market-report-example.component.scss']
})

export class SharedMarketReportExampleComponent implements OnInit {

  private _myTemplate: any = "";

  constructor(private _mediaService: MediaService) {  }

  ngOnInit() {
    this._mediaService.sample().subscribe(page=>{
      this._myTemplate = page.text();
    });
  }

  get myTemplate(): string {
    return this._myTemplate;
  }

};
