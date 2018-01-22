/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bar-chart',
  templateUrl: 'shared-bar-chart.component.html',
  styleUrls: ['shared-bar-chart.component.scss']
})

export class SharedBarChartComponent implements OnInit {

  @Input() public labels: any;
  @Input() public stats: any;
  @Input() public number: any;
  @Input() public displayCount: boolean;

  public index = 0;

  constructor() { }

  ngOnInit() {
    if(!this.stats) {
      this.stats = {};
      this.labels.forEach((val, index)=>{
        this.stats[index+1] = {
          percentage: 0,
          count: 0
        }
      })
    }
  }

  public barFill(percentage: number): string {
    return `${percentage}%`;
  }


};
