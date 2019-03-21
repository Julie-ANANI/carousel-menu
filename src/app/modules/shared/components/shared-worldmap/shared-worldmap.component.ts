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
    this._worldmap.continentsList.forEach((continent) => {
      this._worldmap.selectContinent(continent, initialConfiguration[continent]);
    });
  }

  @Output() updateContinent = new EventEmitter<any>();
  @Output() hoveredContinent = new EventEmitter<string>();

  constructor(private _elem: ElementRef,
              private _worldmap: SharedWorldmapService,
              private _viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this._worldmap.loadCountriesFromViewContainerRef(this._viewContainerRef);
    this._worldmap.newContinentSelected.subscribe((_continent) => {
      this.updateContinent.emit({
        continents: this._worldmap.selectedContinents,
        allChecked: this._worldmap.areAllContinentChecked()
      });
    });
  }

  /**
   * Selects/Unselects all the countries
   * @param $event the value of the checkbox
   */
  public switchWorldCheckbox($event: any): void {
    const worldCheckboxValue = $event.target.checked;
    this._worldmap.continentsList.forEach((continent) => {
      this._worldmap.selectedContinents[continent] = worldCheckboxValue;
    });
  }

  /**
   * Processes the click over one continent
   * @param continent
   */
  public clickOnContinent(event: Event, continent: string): void {
    event.preventDefault();
    if (this.isEditable) {
      this._worldmap.selectContinent(continent, !this._worldmap.selectedContinents[continent]);
    }
  }

  /**
   * Indicates selection status of a continent
   * @param continent the continent to test
   * @returns {boolean}
   */
  public getContinentSelectionStatus(continent: string): boolean {
    return !!this._worldmap.selectedContinents[continent];
  }

  public onHoverChange(continent: string): void {
    this.hoveredContinent.emit(continent);
  }

  public continentSelection(): {[c: string]: boolean} {
    return this._worldmap.selectedContinents;
  }
}
