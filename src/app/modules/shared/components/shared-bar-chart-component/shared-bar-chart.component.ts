/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bar-chart',
  templateUrl: 'shared-bar-chart.component.html',
  styleUrls: ['shared-bar-chart.component.styl']
})

export class SharedBarChartComponent implements OnInit {

  @Input() public levels: any;
  @Input() public stats: any;
  @Input() public number: any;

  public index = 0;

  constructor() { }

  ngOnInit() {
    console.log(this.levels);
  }

  public barFill(percentage: number): string {
    return `${percentage}%`;
  }


};
