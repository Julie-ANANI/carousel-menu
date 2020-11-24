import {Injectable} from '@angular/core';
import {FilterService} from './filters.service';
import {WorldmapService} from '../../../../../services/worldmap/worldmap.service';
import {Country} from '../../../../../models/country';

@Injectable({providedIn: 'root'})
export class WorldmapFiltersService {

  private _continentCountries: { [continent: string]: Country[]; };
  private _selectedContinents: { [c: string]: boolean };
  private _selectedCountries: { [code: string]: boolean };

  constructor(private filterService: FilterService,
              private worldmapService: WorldmapService) {
    this.reset();
  }

  public reset() {
    this._selectedContinents = WorldmapService.continentsList.reduce((acc, cont) => {
      acc[cont] = true;
      return acc;
    }, {} as { [c: string]: boolean });

    this.resetFilter();
  }

  public selectContinent(continent: string, value: boolean) {
    this._selectedContinents[continent] = value;
    const remove = WorldmapService.areAllContinentChecked(this._selectedContinents);
    if (!remove) {
      this.markCountriesOfContinent(this._continentCountries[continent], continent, value);
      this.addFilter();
    } else {
      this.resetFilter();
    }
  }

  public selectCountry(country: string, value: boolean) {
    if (!this._selectedCountries) {
      this.initSelectedCountries(this._continentCountries);
    }

    this._selectedCountries[country] = value;
    const continent = Object.keys(this._continentCountries).find(c => this._continentCountries[c].some(p => p.code === country));
    this._selectedContinents[continent] = this.areAllCountriesOfContinentChecked(this._continentCountries, continent);
    const remove = this.areAllCountriesChecked(this._continentCountries);

    if (!remove) {
      this.addFilter();
    } else {
      this.resetFilter();
    }
  }

  public selectContinents(event: { continents: { [continent: string]: boolean }, allChecked: boolean }): void {
    this._selectedContinents = event.continents;
    if (!event.allChecked) {
      this.markCountriesOfAllContinents(this._continentCountries, event.continents);
      this.addFilter();
    } else {
      this.resetFilter();
    }
  }

  addFilter() {
    this.filterService.addFilter(
      {
        status: 'COUNTRIES',
        value: {continents: this._selectedContinents, countries: this._selectedCountries},
        questionId: 'worldmap'
      }
    );
  }

  resetFilter() {
    this.worldmapService.getCountriesByContinent().then((continents) => {
      this._continentCountries = continents;
      this.initSelectedCountries(continents);
      this.filterService.deleteFilter('worldmap');
    });
  }

  markCountriesOfContinent(countries: Array<Country>, continent: string, value: boolean) {
    countries.forEach((country: Country) => {
      this._selectedCountries[country.code] = value;
    });
  }

  markCountriesOfAllContinents(continentsCountries: { [p: string]: Country[] }, continentChecked: { [p: string]: boolean }) {
    WorldmapService.continentsList.forEach(continent =>
      this.markCountriesOfContinent(continentsCountries[continent], continent, continentChecked[continent]));
  }

  initSelectedCountries(continents: { [p: string]: Country[] }) {
    const countries = [].concat(...Object.values(continents));
    this._selectedCountries = countries.reduce((acc, country) => {
      acc[country.code] = true;
      return acc;
    }, {} as { [c: string]: boolean });
  }

  areAllCountriesOfContinentChecked(continents: { [p: string]: Country[] }, continent: string): boolean {
    return continents[continent].every((c) => this._selectedCountries[c.code]);
  }

  areAllCountriesChecked(continents: { [p: string]: Country[] }): boolean {
    const countries = [].concat(...Object.values(continents));
    return countries.every((c) => this._selectedCountries[c.code]);
  }

}
