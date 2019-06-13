import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable()
export class SharedWorldmapService {

  private static _continentsList = [  'africa', 'americaNord', 'americaSud', 'asia', 'europe', 'oceania', 'russia'];

  private _countries: {[country: string]: string} = {}; // a mapping of countries -> continent

  public static areAllContinentChecked(selectedContinents: {[c: string]: boolean}): boolean {
    return SharedWorldmapService._continentsList.every((c) => selectedContinents[c] === true);
  }

  public loadCountriesFromViewContainerRef (viewContainerRef: ViewContainerRef) {
    if (Object.keys(this._countries).length === 0) {
      SharedWorldmapService._continentsList.forEach((continent) => {
        const continent_elem = viewContainerRef.element.nativeElement.getElementsByClassName(continent);
        Array.prototype.forEach.call(continent_elem, (continent_el: HTMLElement) => {
          const countries_elems = continent_el.getElementsByTagName('path');
          Array.prototype.forEach.call(countries_elems, (country_el: HTMLElement) => {
            this._countries[country_el.getAttribute('class')] = continent;
          });
        });
      });
    }
  }

  /*
   * Return a filtered list of all the countries inside the selected continents.
   */
  public isCountryInSelectedContinents (country: string, continentsToExplore: {[continent: string]: boolean}): boolean {
    return continentsToExplore[this._countries[country]];
  }

  /*
   * Return the counter of the countries by continents.
   */
  public getCountriesRepartition(countries: Array<string>): {[continent: string]: number} {
    return countries.reduce((acc, country) => {
      const continent = this._countries[country];
      if (continent) {
        acc[continent] = (acc[continent] || 0) + 1;
      }
      return acc;
    }, {} as {[continent: string]: number});
  }

  static get continentsList(): Array<string> {
    return SharedWorldmapService._continentsList;
  }

}
