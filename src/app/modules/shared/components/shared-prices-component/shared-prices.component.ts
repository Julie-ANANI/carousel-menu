/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import * as _ from "lodash";

@Component({
  selector: 'infographics-prices',
  templateUrl: 'shared-prices.component.html',
  styleUrls: ['shared-prices.component.styl']
})

export class SharedPricesComponent implements OnInit {

  @Input() public data: any;


  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }

  public computePrices(){}

};
