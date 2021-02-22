import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

/**
 * GaugeChart Component based on https://github.com/recogizer/angular-gauge-chart
 * Demo to test different design : https://recogizer.github.io/gauge-chart/examples/samples/edit.html
 * Normal distribution based gauge chart
 */
@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss']
})
export class GaugeChartComponent implements OnChanges {

  @Input() title = '';
  @Input() inverted = false;

  /**
   * We can give whatever distribution parameters we want,
   * the chart will always be computed and adapted to display a standard distribution
   */
  @Input() average = 50;
  @Input() needleValue = 50;

  @Input() delimitersLabels = [
    'Very low',
    'Low',
    'Strong',
    'Moderate'
  ];

  // Style
  @Input() width = 200;
  @Input() height = 140;
  @Input() veryLow = '#EA5858';
  @Input() low = '#F89424';
  @Input() mean = '#99E04B';
  @Input() high = '#2ECC71';

  // Standard [5,33,50,66,100] gauge delimiters for unified displaying
  private _numberOfDelimiters = 3; // low, mean, high
  private _badDelimiter = 5;
  private _standardAverage = 50;
  private _standardMax = 100;
  private _standardLowerDelimiter = this._standardAverage - (this._standardMax / this._numberOfDelimiters) / 2;
  private _standardUpperDelimiter = this._standardAverage + (this._standardMax / this._numberOfDelimiters) / 2;

  private _needleColor = this.mean;

  get needleColor(): string {
    return this._needleColor;
  }

  private _options: any;

  get options(): any {
    return this._options;
  }

  ngOnChanges(changes: SimpleChanges) {
    // We change needle value to fit standard delimiters
    this.needleValue = this.needleValue * 50 / this.average;
    if (this.inverted) {
      this.needleValue = 100 - this.needleValue;
    }
    this._changeIndicatorColor();
    this._options = {
      hasNeedle: true,
      outerNeedle: false,
      needleColor: '#4F5D6B',
      needleStartValue: 0,
      arcColors: [this.veryLow, this.low, this.mean, this.high],
      arcDelimiters: [this._badDelimiter, this._standardLowerDelimiter, this._standardUpperDelimiter],
      rangeLabelFontSize: 15
    };
  }

  private _changeIndicatorColor() {
    if (this.needleValue <= this._badDelimiter) {
      this._needleColor = this.veryLow;
    } else if (this.needleValue <= this._standardLowerDelimiter) {
      this._needleColor = this.low;
    } else if (this.needleValue <= this._standardUpperDelimiter) {
      this._needleColor = this.mean;
    } else {
      this._needleColor = this.high;
    }
  }
}
