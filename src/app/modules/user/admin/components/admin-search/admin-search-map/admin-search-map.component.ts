import { Component, EventEmitter, Input, Output } from '@angular/core';
import { countries } from "../../../../../../models/static-data/country";

@Component({
  selector: 'admin-search-map',
  templateUrl: 'admin-search-map.component.html',
  styleUrls: ['admin-search-map.component.scss']
})

export class AdminSearchMapComponent {

  @Input() width = '800px';

  @Input() set countriesData (value: any) {
    this._countriesData = value;
  }

  @Input() set quartiles (value: any) {
    this._quartiles = value;
  }

  @Output() onCountryClick = new EventEmitter<any>();

  private _hoverInfo: any = null;

  private _countriesData: any = {};

  private _quartiles: [number, number, number];

  private _boxStyle: any = {
    opacity: 0
  };

  public names = countries;

  constructor() {}

  public getClass (country: string) {
    let intensity = 0;
    if (this.countriesData[country]) {
      if (this.countriesData[country] >= this._quartiles[2]) {
        intensity = 3;
      } else if (this.countriesData[country] >= this._quartiles[1]) {
        intensity = 2;
      } else if (this.countriesData[country] >= this._quartiles[0]) {
        intensity = 1;
      }
    }
    return `country intensity${intensity} ${country}`;
  }

  public clickOnCountry(event: Event) {
    event.preventDefault();
    const foo: any = event.srcElement.className;
    const country = foo.baseVal.slice(-2);
    this.onCountryClick.emit(country);
  }

  public hoverCountry(event: any) {
    event.preventDefault();
    const foo: any = event.srcElement.className;
    const country = foo.baseVal.slice(-2);
    const countryName = this.names[country];
    this._hoverInfo = {
      country: countryName,
      number: this._countriesData[country] || 'NA'
    };
    this._boxStyle = {
      top: `${event.pageY - 40}px`,
      left: `${event.pageX - countryName.length * 2.6}px`
    };
  }

  public leaveHover(event: Event) {
    event.preventDefault();
    this._hoverInfo = null;
    this._boxStyle = {
      opacity: 0
    };
  }

  get hoverInfo(): any {
    return this._hoverInfo;
  }

  get boxStyle(): any {
    return this._boxStyle;
  }

  get countriesData(): any {
    return this._countriesData;
  }
}
