import {Injectable} from '@angular/core';
import {FilterService} from './filters.service';
import {WorldmapService} from '../../../../../services/worldmap/worldmap.service';
import {UmiusCountryInterface} from '@umius/umi-common-component';

@Injectable({providedIn: 'root'})
export class WorldmapFiltersService {

  private _continentCountries: { [continent: string]: UmiusCountryInterface[]; };
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

  public selectCountry(country: string, value: boolean, answersCountries: string[]) {
    if (!this._selectedCountries) {
      this.initSelectedCountries(this._continentCountries);
    }

    this._selectedCountries[country] = value;
    const continentCountries = this.getOnlyCountriesInAnswers(answersCountries);
    const continent = Object.keys(this._continentCountries).find(c => continentCountries[c].some(p => p.code === country));
    this._selectedContinents[continent] = this.areAllCountriesOfContinentChecked(continentCountries, continent);
    const remove = this.areAllCountriesChecked(continentCountries);

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

  markCountriesOfContinent(countries: Array<UmiusCountryInterface>, continent: string, value: boolean) {
    countries.forEach((country: UmiusCountryInterface) => {
      this._selectedCountries[country.code] = value;
    });
  }

  markCountriesOfAllContinents(continentsCountries: { [p: string]: UmiusCountryInterface[] }, continentChecked: { [p: string]: boolean }) {
    WorldmapService.continentsList.forEach(continent =>
      this.markCountriesOfContinent(continentsCountries[continent], continent, continentChecked[continent]));
  }

  initSelectedCountries(continents: { [p: string]: UmiusCountryInterface[] }) {
    const countries = [].concat(...Object.values(continents));
    this._selectedCountries = countries.reduce((acc, country) => {
      acc[country.code] = true;
      return acc;
    }, {} as { [c: string]: boolean });
  }

  // Limit countries with only those in answers
  getOnlyCountriesInAnswers(answersCountries: string[]): { [p: string]: UmiusCountryInterface[] } {
    const continentCountries = {};
    Object.keys(this._continentCountries).forEach((key: string) => {
      continentCountries[key] = this._continentCountries[key].filter(c => answersCountries.includes(c.code));
    });
    return continentCountries;
  }

  areAllCountriesOfContinentChecked(continents: { [p: string]: UmiusCountryInterface[] }, continent: string): boolean {
    return continents[continent].every((c) => this._selectedCountries[c.code]);
  }

  areAllCountriesChecked(continents: { [p: string]: UmiusCountryInterface[] }): boolean {
    const countries = [].concat(...Object.values(continents));
    return countries.every((c) => this._selectedCountries[c.code]);
  }

}
