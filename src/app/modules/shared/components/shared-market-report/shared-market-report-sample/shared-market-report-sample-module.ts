/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit} from '@angular/core';
import { PageScrollConfig } from 'ng2-page-scroll';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: 'shared-market-report-sample.component.html',
  styleUrls: ['shared-market-report-sample.component.scss']
})

export class SharedMarketReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    PageScrollConfig.defaultDuration = 800;
  }
}
