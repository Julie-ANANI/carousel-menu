import { Component, OnInit } from '@angular/core';

import { Http } from '../../../../services/http';

@Component({
  templateUrl: 'shared-market-report-example.component.html',
  styleUrls: ['shared-market-report-example.component.scss']
})

export class SharedMarketReportExampleComponent implements OnInit {

  private _myTemplate = '';

  constructor(private _http: Http) {  }

  ngOnInit() {
    this._http.get('/sample' ).subscribe(page => {
      this._myTemplate = page.text();
    });
  }

  get myTemplate(): string {
    return this._myTemplate;
  }

}
