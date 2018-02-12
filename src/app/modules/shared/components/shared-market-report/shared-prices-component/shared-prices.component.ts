/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, ElementRef } from '@angular/core';

import * as D3 from 'd3/index';
import * as _ from 'lodash';

@Component({
  selector: 'app-shared-infographics-prices',
  templateUrl: 'shared-prices.component.html',
  styleUrls: ['shared-prices.component.scss']
})

export class SharedPricesComponent implements OnInit {

  @Input() public rawData: any;

  private host: any; // D3 object referencing host dom object
  private svg: any; // SVG in which we will print our chart
  private margin: number; // Space between the svg borders and the actual chart graphic
  private width: number; // Component width
  private height: number; // Component height
  private xScale: any; // D3 scale in X
  private yScale: any; // D3 scale in Y
  private xAxis: any; // D3 X Axis
  private htmlElement: HTMLElement; // Host HTMLElement
  private ymax: number; // Max drawing height

  private data: Array<{count: number, value: number}>;


  constructor(private element: ElementRef)  {
  }

  ngOnInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.element.nativeElement);
    this.transformData();
    this.setup();
    this.buildSVG();
    this.drawCoins();
  }

  private setup(): void {
    // Calcul la largeur du graphique
    const infographicsWidth = this.element.nativeElement.parentNode.offsetWidth;
    this.margin = 40;
    this.width = infographicsWidth;
    this.ymax = this.data.length === 0 ? 0 : D3.max(this.data, function (d:any) { return d['count']; });
    this.height = this.margin + (6 * this.ymax);
    // Trouve les valeurs minimums et maximums et les fait correspondre à la hauteur du graphique
    this.xScale = D3.scaleLinear().range([0, this.width - this.margin]); // Avant (v3) c'était d3.scale.linear()
    this.yScale = D3.scaleLinear().range([this.height - this.margin, 0]);
    this.xScale.domain(D3.extent(this.data, function (d: any) { return d.value; })).nice();
    this.yScale.domain(D3.extent(this.data, function (d: any) { return d.count; }));
    this.xAxis = D3.axisBottom(this.xScale) // Avant (v3), c'étatit d3.svg.axis()
      .tickFormat(function (d: string) {
        return d + '€';
      });
  }
  private transformData() {
    // Init data
    this.data = [];
    const data = this.data;
    _.map(this.rawData, function (n: any) {
      for (let i = 1; i <= n['count']; i++) {
        if (i < 50) {
          data.push({value: n['value'], count: i})
        }
      }
    });
  }

  /* Will setup the chart container */

  /* Will build the SVG Element */
  private buildSVG(): void {
    this.host.html('');
    this.svg = this.host.append('svg')
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + (this.margin / 2) + ',' + (this.margin / 2) + ')');

    // Ajout de l'axe X au SVG
    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (this.height - this.margin) + ')')
      .call(this.xAxis);
  }

  private drawCoins(): void {
    // Ajout des pièces
    const that = this;
    this.svg.selectAll('coin')
      .data(this.data)
      .enter()
      .append('image')
      .attr('xlink:href', 'https://res.cloudinary.com/umi/image/upload/app/coin.svg')
      .attr('x', function (d: {count: number, value: number}) {
        return that.xScale(d.value) - 11 + 'px';
      })
      .attr('y', function (d: {count: number, value: number}) {
        return that.yScale(d.count) - 6 + 'px';
      })
      .attr('width', 22)
      .attr('height', 13);
  }
}
