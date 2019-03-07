import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'admin-search-map',
  templateUrl: 'admin-search-map.component.html',
  styleUrls: ['admin-search-map.component.scss']
})

export class AdminSearchMapComponent implements OnInit{

  @Input() width = '800px';
  @Input() countriesData: Array<any> = [];
  @Output() onCountryClick = new EventEmitter<any>();

  private _hoveredCountry: string = null;
  private _boxStyle: any = {
    opacity: 0
  };

  constructor() {}

  ngOnInit() {}

  public clickOnCountry(event: Event) {
    event.preventDefault();
    const country = event.srcElement.className.baseVal.slice(-2);
    console.log(country);
  }

  public hoverCountry(event: Event) {
    event.preventDefault();
    const country = event.srcElement.className.baseVal.slice(-2);
    this._hoveredCountry = country;
    this._boxStyle = {
      top: `${event.pageY - 220}px`,
      left: `${event.pageX - 200}px`
    };
  }

  public leaveHover(event: Event) {
    event.preventDefault();
    this._hoveredCountry = null;
    this._boxStyle = {
      opacity: 0
    };
  }

  get hoveredCountry(): string {
    return this._hoveredCountry;
  }

  get boxStyle(): any {
    return this._boxStyle;
  }
}
