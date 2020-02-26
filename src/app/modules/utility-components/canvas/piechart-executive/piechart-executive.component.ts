import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { ExecutivePieChart } from '../../../../models/pie-chart';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { isPlatformBrowser } from '@angular/common';

/***
 * ex: Admin storyboard page
 * package site: https://valor-software.com/ng2-charts/#/PieChart
 */

@Component({
  selector: 'piechart-executive',
  templateUrl: 'piechart-executive.component.html',
  styleUrls: ['piechart-executive.component.scss']
})

export class PiechartExecutiveComponent {

  @Input() set pieChart(value: ExecutivePieChart) {
    this._pieChart = value;
    this._setData();
  }

  private _pieChart: ExecutivePieChart = {
    data: [],
    labelPercentage: [],
    labels: [],
    colors: []
  };

  private _type: ChartType = 'pie';

  private _options: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
    },
    animation: {
      duration: 0
    },
  };

  private _labels: Array<Label> = [];

  private _data: Array<number>  = [];

  private _colors: Array<{backgroundColor: Array<string>}> = [];

  private readonly _isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {

    this._isBrowser = isPlatformBrowser(this.platformId);

  }

  private _setData() {
    if (this._pieChart) {
      this._labels = this._pieChart.labels || [];
      this._colors = [{backgroundColor: this._pieChart.colors || []}];
      this._data = this._pieChart.data || [];
    }
  }

  get pieChart(): ExecutivePieChart {
    return this._pieChart;
  }

  get data(): Array<number> {
    return this._data;
  }

  get colors(): Array<{backgroundColor: Array<string>}> {
    return this._colors;
  }

  get type(): "line" | "bar" | "horizontalBar" | "radar" | "doughnut" | "polarArea" | "bubble" | "pie" | "scatter" {
    return this._type;
  }

  get options(): ChartOptions {
    return this._options;
  }

  get labels(): Label[] {
    return this._labels;
  }

  get isBrowser(): boolean {
    return this._isBrowser;
  }

}
