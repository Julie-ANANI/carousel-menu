import { Component } from '@angular/core';
import { BarChartComponent as BaseComponent } from '../../../shared-market-report/components/bar-chart/bar-chart.component';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})

export class BarChartComponent extends BaseComponent {}
