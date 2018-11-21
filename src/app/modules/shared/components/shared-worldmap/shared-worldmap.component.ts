import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { SharedWorldmapService } from './shared-worldmap.service';

@Component({
  selector: 'app-worldmap',
  templateUrl: 'shared-worldmap.component.html',
  styleUrls: ['shared-worldmap.component.scss']
})

export class SharedWorldmapComponent implements OnInit{

  @Input() width = '800px';
  @Input() countriesColor: string;
  @Input() isEditable = true;
  @Input() synthesis = false;

  @Input() set countries(value: Array<string>) {
    if (Array.isArray(value) && value.length > 0) {
      value.forEach((country) => {
        const country_elems = this._elem.nativeElement.getElementsByClassName(country);
        if (country_elems && country_elems.length) {
          Array.prototype.forEach.call(country_elems, (country_el: HTMLElement) => {
            country_el.style.fill = this.countriesColor;
          });
        } else {
          console.log(`This country is nowhere to be found in the svg map ${country}`);
        }
      });
    }
  }

  @Input() set initialConfiguration(initialConfiguration: any) {
    this._continents = initialConfiguration || {
          africa: false,
          americaNord: false,
          americaSud: false,
          asia: false,
          europe: false,
          oceania: false,
          russia: false
        };
  }

  @Output() updateContinent = new EventEmitter<any>();

  private _continents = {
    africa: false,
    americaNord: false,
    americaSud: false,
    asia: false,
    europe: false,
    oceania: false,
    russia: false
  };

  constructor(private _elem: ElementRef,
              private _worldmap: SharedWorldmapService,
              private _viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this._worldmap.loadCountriesFromViewContainerRef(this._viewContainerRef);
  }

  /**
   * Checks whether all the continents have been selected
   * @returns {boolean}
   */
  public areAllContinentChecked(): boolean {
    const keys = Object.keys(this._continents);
    let i = 0;
    while (i < keys.length && this._continents[keys[i]]) {
      i++;
    }
    return i === keys.length;
  }

  /**
   * Selects/Unselects all the countries
   * @param $event the value of the checkbox
   */
  public switchWorldCheckbox($event: any): void {
    const worldCheckboxValue = $event.target.checked;
    const keys = Object.keys(this._continents);
    keys.forEach((continent) => {
      this._continents[continent] = worldCheckboxValue;
    });
    this.updateContinent.emit({continents: this._continents});
  }

  /**
   * Processes the click over one continent
   * @param continent
   */
  public clickOnContinent(event: Event, continent: string): void {
    event.preventDefault();

    if (this.isEditable) {
      this._continents[continent] = !this._continents[continent];
      this.updateContinent.emit({
        continents: this._continents,
        allChecked: this.areAllContinentChecked()
      });
    }

  }

  /**
   * Indicates selection status of a continent
   * @param continent the continent to test
   * @returns {boolean}
   */
  public getContinentSelectionStatus(continent: string): boolean {
    return !!this._continents[continent];
  }


}
