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

  @Input() set initialConfiguration(initialConfiguration: {[c: string]: boolean}) {
    if (initialConfiguration) {
      this._continents = initialConfiguration;
    }
  }

  /* Initialise continents selections with everything to false */
  private _continents = SharedWorldmapService.continentsList.reduce((acc, cont) => {
    acc[cont] = false;
    return acc;
  }, {});

  @Output() updateContinent = new EventEmitter<any>();
  @Output() hoveredContinent = new EventEmitter<string>();

  constructor(private _elem: ElementRef,
              private _worldmap: SharedWorldmapService,
              private _viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this._worldmap.loadCountriesFromViewContainerRef(this._viewContainerRef);
  }

  /**
   * Selects/Unselects all the countries
   * @param $event the value of the checkbox
   */
  public switchWorldCheckbox($event: any): void {
    const worldCheckboxValue = $event.target.checked;
    SharedWorldmapService.continentsList.forEach((continent) => {
      this._continents[continent] = worldCheckboxValue;
    });
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
        allChecked: SharedWorldmapService.areAllContinentChecked(this._continents)
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

  public onHoverChange(continent: string): void {
    this.hoveredContinent.emit(continent);
  }

}
