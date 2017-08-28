import { Component, Input, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-shared-infographic-worldmap',
  templateUrl: './shared-infographic-worldmap.component.html',
  styleUrls: ['./shared-infographic-worldmap.component.styl']
})
export class SharedInfographicWorldmapComponent implements OnInit {

  @Input() public countries: any;
  @Input() public color: any;

  constructor(private _el: ElementRef) { }

  ngOnInit() {
    if (this.countries && this.countries.length > 0) {
      for (const country of this.countries) {
        this._el.nativeElement.getElementsByClassName(country.notation)[0].style.fill = this.color || 'orange';
      }
    }
  }

}
