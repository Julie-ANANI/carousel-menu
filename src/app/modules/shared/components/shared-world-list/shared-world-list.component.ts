import {Component, EventEmitter, Input, Output} from '@angular/core';
import {WorldmapService} from '../../../../services/worldmap/worldmap.service';
import {Filter} from '../shared-market-report/models/filter';
import {TranslateService} from '@ngx-translate/core';
import {UmiusCountryInterface} from '@umius/umi-common-component';

@Component({
  selector: 'app-shared-world-list',
  templateUrl: './shared-world-list.component.html',
  styleUrls: ['./shared-world-list.component.scss']
})
export class SharedWorldListComponent {

  @Input() filters: { [questionId: string]: Filter } = {};
  @Input() filteredContinents: any;
  @Input() filteredCountries: any;
  @Input() reportingLang = this._translateService.currentLang;

  @Input() set answersCountries(value: string[]) {
    if (!!value) {
      this._answersCountries = value;
      this._fetchAllCountries();
    }
  }

  @Output() filterAllContinents = new EventEmitter<{ isChecked: boolean, filterArray: Array<any> }>();
  @Output() checkContinent: EventEmitter<Event> = new EventEmitter();
  @Output() checkCountry: EventEmitter<Event> = new EventEmitter();
  private _answersCountries: string[] = [];

  private _continentCountries: { [continent: string]: Array<UmiusCountryInterface> } = {};

  constructor(private _worldmapService: WorldmapService,
              private _translateService: TranslateService) {
  }

  selectAllContinents(isChecked: boolean, filterArray: Array<any>) {
    this.filterAllContinents.emit({
      isChecked: isChecked,
      filterArray: filterArray
    });
  }

  /**
   * Check if countries of a continent are partially selected
   * For indeterminate checkbox
   * @param continent
   */
  partiallySelectedCountries(continent: string): boolean {
    if (this.filteredCountries) {
      const continentCountriesCodes = this.continentCountries[continent].map(c => c.code);
      const selectedCountries = Object.keys(this.filteredCountries)
        .filter((country: string) => continentCountriesCodes.includes(country) && this.filteredCountries[country]).length;
      return selectedCountries > 0 && selectedCountries < this.continentCountries[continent].length;
    }
    return false;
  }

  /**
   * Check if only some continents are selected
   * For indeterminate checkbox
   */
  partiallySelectedContinents(): boolean {
    if (this.filteredContinents) {
      const selectedContinents = Object.keys(this.filteredContinents)
        .filter((c: string) => this.filteredContinents[c]).length;
      return selectedContinents > 0 && selectedContinents < this.continents.length;
    }
    return false;
  }

  private _fetchAllCountries() {
    this._worldmapService.getCountriesByContinent(this._answersCountries).then((countries: { [continent: string]: Array<UmiusCountryInterface> }) => {
      this._continentCountries = countries;
    });
  }

  get continentCountries(): { [continent: string]: Array<UmiusCountryInterface> } {
    return this._continentCountries;
  }

  get continents(): Array<string> {
    return WorldmapService.continentsList;
  }
}
