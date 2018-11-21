import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'shared-market-report-example.component.html',
  styleUrls: ['shared-market-report-example.component.scss']
})

export class SharedMarketReportExampleComponent implements OnInit {

  private _sample: Observable<any>;

  constructor(private _http: HttpClient) {  }

  ngOnInit() {
    this._sample = this._http.get('/sample',{responseType: 'text'});
  }

  get sample(): Observable<any> {
      return this._sample;
  }

}
