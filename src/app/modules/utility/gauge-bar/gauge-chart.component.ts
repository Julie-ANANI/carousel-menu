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

  @Input() isPopover = false;

  // A negative chart will go from good values (green) to bad values (red)
  // A positive chart will go from bad values (red) to good values (green)
  @Input() negative = false;

  /**
   * We can give whatever distribution parameters we want,
   * the chart will always be computed and adapted to display a standard distribution
   */
  @Input() average = 50;
  @Input() needleValue = 50;
  @Input() needleValueText: string = '';
  @Input() showValue = false;
  @Input() showLegend = true;

  @Input() delimitersLabels = [
    'Very low',
    'Low',
    'Strong',
    'Moderate'
  ];

  // Style
  @Input() width = 200; @Input() height = 140;
  @Input() colors = ['#EA5858', '#F89424', '#99E04B', '#2ECC71'];
  @Input() needleColor: string;

  // Standard [5,33,50,66,100] gauge delimiters for unified displaying
  private _standardAverage = 50;
  private _indicatorColor = '';

  @Input() nbArcs = 3;
  @Input() delimiters = [
    5,
    this._standardAverage - (100 / this.nbArcs) / 2,
    this._standardAverage + (100 / this.nbArcs) / 2
  ];

  private _options: any;

  ngOnChanges(changes: SimpleChanges) {
    // We force display of needle when value is 0
    if (!this.needleValue) {
      this.needleValue = 0.0001;
    }

    // We change needle value to fit standard delimiters
    this.needleValue = this.needleValue * 50 / this.average;
    if(!this.needleColor) {
      this._changeIndicatorColor();
    }

    if(this.nbArcs !== 3) this.delimiters = this.delimiters.map(d => d * (100 / this.nbArcs))
    if (this.negative) { this.needleValue = 100 - this.needleValue; }

    this._options = {
      hasNeedle: true,
      outerNeedle: false,
      needleColor: this.needleColor || '#4F5D6B',
      needleStartValue: 0,
      arcColors: this.colors,
      arcDelimiters: this.delimiters,
      rangeLabelFontSize: 16
    };
  }

  private _changeIndicatorColor() {
    if (this.needleValue <= this.delimiters[0]) {
      this._indicatorColor = this.colors[0];
    } else if (this.needleValue <= this.delimiters[1]) {
      this._indicatorColor = this.colors[1]
    } else if (this.needleValue <= this.delimiters[2]) {
      this._indicatorColor = this.colors[2];
    } else {
      this._indicatorColor = this.colors[3];
    }
  }

  get options(): any {
    return this._options;
  }

  get indicatorColor(): string {
    return this._indicatorColor;
  }
}
