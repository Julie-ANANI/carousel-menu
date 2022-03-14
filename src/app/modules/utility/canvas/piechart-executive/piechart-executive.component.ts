import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import { ExecutivePieChart } from '../../../../models/chart/pie-chart';
import { isPlatformBrowser } from '@angular/common';
import {oldColorsToNewMapping} from "../../../../utils/chartColors";

/***
 * ex: Admin storyboard page
 * package site: https://valor-software.com/ng2-charts/#/PieChart
 */

@Component({
  selector: 'app-utility-piechart-executive',
  templateUrl: 'piechart-executive.component.html',
  styleUrls: ['piechart-executive.component.scss']
})

export class PiechartExecutiveComponent implements OnInit {

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

  private _options: any = {
    responsive: true,
    legend: {
      position: 'right',
    },
    animation: {
      duration: 0
    },
  };

  private _labels: Array<string> = [];

  private _data: Array<number>  = [];

  private _colors: Array<{backgroundColor: Array<string>}> = [];

  private _isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {
  }

  ngOnInit(): void {
    this._isBrowser = isPlatformBrowser(this.platformId);
  }

  private _setData() {
    if (this._pieChart) {
      this._labels = this._pieChart.labels || [];
      this._colors = [{backgroundColor: this._pieChart.colors.map(c => oldColorsToNewMapping[c || ''] || c) || []}];

      // for the executive report we are using the percentage values not the answers values
      this._data = this._pieChart.labelPercentage || [];
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

  get options(): any {
    return this._options;
  }

  get labels(): Array<string> {
    return this._labels;
  }

  get isBrowser(): boolean {
    return this._isBrowser;
  }

}
