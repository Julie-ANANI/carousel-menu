/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'market-report-popover',
  templateUrl: 'shared-market-report-popover.component.html',
  styleUrls: ['shared-market-report-popover.component.scss']
})

export class SharedMarketReportPopoverComponent implements OnInit {

  @Input() public professionals: any;


  constructor() { }

  ngOnInit() {
    console.log(this.professionals);
  }

  public buildImageUrl(country: string): string {
    return `/assets/flags/${country}.png`;
  }

  public seeAnswer(professional: any) {
    console.log("Answer?");
  }

};
