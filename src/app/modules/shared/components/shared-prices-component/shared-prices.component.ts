/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, ElementRef } from '@angular/core';

import * as D3 from 'd3/index';
import * as _ from "lodash";

@Component({
  selector: 'infographics-prices',
  templateUrl: 'shared-prices.component.html',
  styleUrls: ['shared-prices.component.styl']
})

export class SharedPricesComponent implements OnInit {

  @Input() public rawData: any;


  private host; // D3 object referebcing host dom object
  private svg; // SVG in which we will print our chart
  private margin; // Space between the svg borders and the actual chart graphic
  private width; // Component width
  private height; // Component height
  private xScale; // D3 scale in X
  private yScale; // D3 scale in Y
  private xAxis; // D3 X Axis
  private htmlElement; // Host HTMLElement
  private ymax; //Max drawing height

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
    let infographicsWidth = this.element.nativeElement.parentNode.offsetWidth;
    this.margin = 40;
    this.width = infographicsWidth;
    this.ymax = this.data.length === 0 ? 0 : D3.max(this.data, function (d) {return d['count'];});
    this.height = this.margin + (6 * this.ymax);
    // Trouve les valeurs minimums et maximums et les fait correspondre à la hauteur du graphique
    this.xScale = D3.scaleLinear().range([0, this.width - this.margin]); //Avant (v3) c'était d3.scale.linear()
    this.yScale = D3.scaleLinear().range([this.height - this.margin, 0]);
    this.xScale.domain(D3.extent(this.data, function (d) {return d.value;})).nice();
    this.yScale.domain(D3.extent(this.data, function (d) {return d.count;}));
    this.xAxis = D3.axisBottom(this.xScale) //Avant (v3), c'étatit d3.svg.axis()
      .tickFormat(function (d) {
        return d + "€";
      });
  }
  private transformData() {
    // Init data
    this.data = [];
    let data = this.data;
    _.map(this.rawData, function (n) {
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
      .attr("viewBox", "0 0 " + this.width + " " + this.height)
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", "translate(" + (this.margin / 2) + "," + (this.margin / 2) + ")");

    // Ajout de l'axe X au SVG
    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (this.height - this.margin) + ")")
      .call(this.xAxis);
  }

  private drawCoins(): void {
    // Ajout des pièces
    let that = this;
    this.svg.selectAll("coin")
      .data(this.data)
      .enter()
      .append("image")
      .attr("xlink:href", "/assets/common/coin.svg")
      .attr("x", function (d) {
        return that.xScale(d.value) - 11 + "px";
      })
      .attr("y", function (d) {
        return that.yScale(d.count) - 6 + "px";
      })
      .attr("width", 22)
      .attr("height", 13);
  }
};
