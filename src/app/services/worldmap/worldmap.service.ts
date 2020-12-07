import {Injectable, ViewContainerRef} from '@angular/core';
import {Country} from '../../models/country';
import {IndexService} from '../index/index.service';

@Injectable({providedIn: 'root'})
export class WorldmapService {

  constructor(private _indexService: IndexService) {}

  private static _continentsList = ['africa', 'americaNord', 'americaSud', 'asia', 'europe', 'oceania'];

  private _countries: {[country: string]: string} = {}; // a mapping of countries -> continent
  private _countriesList: Array<Country> = [];

  public static areAllContinentChecked(selectedContinents: {[c: string]: boolean}): boolean {
    return WorldmapService._continentsList.every((c) => selectedContinents[c] === true);
  }

  public static setContinents(value: boolean): any {
    return WorldmapService._continentsList.reduce((acc, cont) => {
      acc[cont] = value;
      return acc;
    }, {} as any);
  }

  public loadCountriesFromViewContainerRef (viewContainerRef: ViewContainerRef) {
    if (Object.keys(this._countries).length === 0) {
      WorldmapService._continentsList.forEach((continent) => {
        const continent_elem = viewContainerRef.element.nativeElement.getElementsByClassName(continent);
        Array.prototype.forEach.call(continent_elem, (continent_el: HTMLElement) => {
          const countries_elems = continent_el.getElementsByTagName('path');
          Array.prototype.forEach.call(countries_elems, (country_el: HTMLElement) => {
            this._countries[country_el.getAttribute('id')] = continent;
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
  public async getCountriesRepartitionByContinent(countries: Array<string>): Promise<{ [continent: string]: { count: number, countries: { [country: string]: number } } }> {
    const countriesList = await this.getCountriesList();
    return countries.reduce((acc, countryCode) => {
      const continent = this._countries[countryCode];
      const country = countriesList.find(c => c.code === countryCode);
      if (continent) {
        acc[continent] = acc[continent] || {count: 0, countries: {}};
        acc[continent].count = acc[continent].count + 1;
        acc[continent].countries[country.name] = (acc[continent].countries[country.name] || 0) + 1;
      }
      return acc;
    }, {} as { [continent: string]: { count: number, countries: { [country: string]: number } } });
  }

  public async getCountriesByContinent(countryCodesToInclude: string[]= []): Promise<{ [continent: string]: Array<Country> }> {
    const countriesList = await this.getCountriesList();
    return countriesList.reduce((acc, country) => {
      const continent = this._countries[country.code];
      if (continent) {
        acc[continent] = acc[continent] || [];

        if (countryCodesToInclude.length === 0 || countryCodesToInclude.includes(country.code)) {
          acc[continent].push(country);
        }
      }
      return acc;
    }, {} as { [continent: string]: Array<Country> });
  }

  public async getCountriesList(): Promise<Array<Country>> {
    return new Promise(resolve => {
      if (this._countriesList.length === 0) {
        this._indexService.getWholeSet({type: 'countries'})
          .subscribe(
            (response) => {
              this._countriesList = response.result;
              resolve(this._countriesList);
            });
      } else {
        resolve(this._countriesList);
      }
    });
  }

  static get continentsList(): Array<string> {
    return WorldmapService._continentsList;
  }

}
