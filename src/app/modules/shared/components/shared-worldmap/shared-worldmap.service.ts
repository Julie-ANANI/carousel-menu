import { Injectable, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SharedWorldmapService {

  private _continentsList = [  'africa', 'americaNord', 'americaSud', 'asia', 'europe', 'oceania', 'russia'];

  private _countries: {[country: string]: string} = {}; // a mapping of countries -> continent

  private _selectedContinents:  {[c: string]: boolean} = {
    africa: false,
    americaNord: false,
    americaSud: false,
    asia: false,
    europe: false,
    oceania: false,
    russia: false
  };

  private _newContinentSelected = new Subject<string>();

  public loadCountriesFromViewContainerRef (viewContainerRef: ViewContainerRef) {
    if (Object.keys(this._countries).length === 0) {
      this._continentsList.forEach((continent) => {
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
    }, {});
  }

  public selectContinent(continent: string, value: boolean) {
    this._selectedContinents[continent] = value;
    this._newContinentSelected.next(continent);
  }

  /**
   * Checks whether all the continents have been selected
   */
  public areAllContinentChecked(): boolean {
    return this._continentsList.every((c) => this._selectedContinents[c] === true);
  }

  get continentsList(): Array<string> {
    return this._continentsList;
  }

  get selectedContinents(): {[c: string]: boolean} {
    return this._selectedContinents;
  }

  get newContinentSelected(): Observable<string> {
    return this._newContinentSelected.asObservable();
  }

}
