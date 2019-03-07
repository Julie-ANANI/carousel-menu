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
    console.log(country);
  }

  public leaveHover(event: Event) {
    event.preventDefault();
    const country = event.srcElement.className.baseVal.slice(-2);
    console.log(country);
  }
}
