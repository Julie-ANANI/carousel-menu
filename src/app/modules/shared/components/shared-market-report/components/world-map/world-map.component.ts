/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-world-map',
  templateUrl: 'world-map.component.html',
  styleUrls: ['world-map.component.scss']
})

export class WorldMapComponent {

  @Input() public color: string;
  @Input() set countries(value: Array<string>) {
    if (Array.isArray(value) && value.length > 0) {
      value.forEach((country) => {
        const country_elems = this._elem.nativeElement.getElementsByClassName(country);
        if (country_elems && country_elems.length) {
          Array.prototype.forEach.call(country_elems, (country_el: HTMLElement) => {
            country_el.style.fill = this.color || 'orange';
          });
        } else {
          console.log(`This country is nowhere to be found in the svg map ${country}`);
        }
      });
    }
  }

  constructor(private _elem: ElementRef) { }

}
