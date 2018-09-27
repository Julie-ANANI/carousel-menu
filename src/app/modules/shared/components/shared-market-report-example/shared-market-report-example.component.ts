import { Component, OnInit } from '@angular/core';

import { Http } from '../../../../services/http.service';

@Component({
  templateUrl: 'shared-market-report-example.component.html',
  styleUrls: ['shared-market-report-example.component.scss']
})

export class SharedMarketReportExampleComponent implements OnInit {

  private _myTemplate = '';

  constructor(private _http: Http) {  }

  ngOnInit() {
    this._http.get('/sample' ).subscribe((page: any) => {
      this._myTemplate = page.text();
    });
  }

  get myTemplate(): string {
    return this._myTemplate;
  }

}
