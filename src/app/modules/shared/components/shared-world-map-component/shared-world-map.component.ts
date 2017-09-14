/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'world-map',
  templateUrl: 'shared-world-map.component.html',
  styleUrls: ['shared-world-map.component.styl']
})

export class SharedWorldMapComponent implements OnInit {

  @Input() public countries: any;
  @Input() public color: any;


  constructor(private _elem: ElementRef) { }

  ngOnInit() {
      if (this.countries && this.countries.length > 0) {
        for (let i = 0; i < this.countries.length; i++) {
          if(this._elem.nativeElement.getElementsByClassName(this.countries[i].notation).length) {
            this._elem.nativeElement.getElementsByClassName(this.countries[i].notation)[0].style.fill = this.color || 'orange';
          } else {
            console.log(`This country is nowhere to be found in the svg map ${this.countries[i].notation}`);
          }
        }
      }
  }

};
