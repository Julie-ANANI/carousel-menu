import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IndexService } from '../../../../services/index/index.service';
import { Country } from '../../../../models/country';
import { Response } from '../../../../models/response';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { WorldmapService } from '../../../../services/worldmap/worldmap.service';
import { GeographySettings } from '../../../../models/innov-settings';

@Component({
  selector: 'app-shared-targeting-world',
  templateUrl: './shared-targeting-world.component.html',
  styleUrls: ['./shared-targeting-world.component.scss'],
})
export class SharedTargetingWorldComponent implements OnInit {
  @Input() isShowSearch = false;

  @Input() set geography(value: GeographySettings) {
    this._geography = value;
  }

  @Output()
  geographyChange: EventEmitter<GeographySettings> = new EventEmitter<GeographySettings>();

  @Input() isEditable = true;

  @Input() isAdmin = false;

  private _geography: GeographySettings;

  private _allCountries: Array<Country> = [];

  private _continentCountries: { [continent: string]: Array<Country> } = {};

  private _showToggleList = false;

  private _searchCountryString = '';

  private _searchCountries: Array<Country> = [];

  constructor(
    private _indexService: IndexService,
    private _translateService: TranslateService,
    private _translateNotificationService: TranslateNotificationsService
  ) {
  }

  ngOnInit(): void {
    this._getAllCountries();
  }

  /***
   * here we are calling the api to get the all countries into this._allCountries and
   * then we check the this.__geography.includeCountries and
   * this.__geography.excludeCountries values
   * and based on that perform the respective function.
   * @private
   */
  private _getAllCountries() {
    this._indexService.getWholeSet({type: 'countries'}).subscribe(
      (response: Response) => {
        this._allCountries = response.result;
        this._allContinentsCountries();

        if (this._geography.include.length === 0) {
          this._includeCountries();
        }

        if (this._geography.exclude.length > 0) {
          this._filterExCountriesFromIncluded();
        }

        /***
         * we are emitting here because of the old innovations.
         * so that we can have the calculated values for them.
         */
        if (!this.isEditable || this.isAdmin) {
          this._emitChanges();
        }
      },
      () => {
        this._translateNotificationService.error(
          'ERROR.ERROR',
          'ERROR.FETCHING_ERROR'
        );
      }
    );
  }

  /***
   * we get the list of the continent countries and store them in the
   * this._continentCountries array.
   * @private
   */
  private _allContinentsCountries() {
    this._continentCountries = this._allCountries.reduce(
      (acc, country) => {
        const continent_name = country.continent.toLowerCase();

        if (continent_name === 'americas') {
          const subcontinent_name = country.subcontinent.toLowerCase();

          if (subcontinent_name === 'northern america') {
            acc['americaNord'].push(country);
          } else {
            acc['americaSud'].push(country);
          }
        } else {
          acc[continent_name].push(country);
        }

        return acc;
      },
      {
        africa: [],
        americaNord: [],
        americaSud: [],
        antarctic: [],
        asia: [],
        europe: [],
        oceania: [],
      }
    );
  }

  private getIncludedContinents(): Array<string> {
    return Object.keys(this._geography.continentTarget).reduce(
      (acc, continent) => {
        if (this._geography.continentTarget[continent]) {
          acc.push(continent);
        }
        return acc;
      },
      [] as Array<string>
    );
  }

  private _includeCountries() {
    const continentsIncluded = this.getIncludedContinents();
    continentsIncluded.forEach((continent) => {
      const countries = this.getCountriesByContinent(continent);
      if (Array.isArray(countries)) {
        countries.forEach((country: Country) => {
          const index = this._geography.include.findIndex(
            (value) => value.code === country.code
          );
          if (index === -1) {
            this._geography.include.push(country);
          }
        });
      }
    });
  }

  public getCountriesByContinent(continent_name: string): Array<Country> {
    return this._continentCountries[continent_name];
  }

  private _filterExCountriesFromIncluded() {
    this._geography.include = this._geography.include.filter((value) => {
      return this._geography.exclude.some(
        (value2) => value2.code !== value.code
      );
    });
  }

  public checkSelectAll(): boolean {
    const selectedContinents = this.getIncludedContinents();
    return (
      selectedContinents.length === 7 ||
      selectedContinents.length === WorldmapService.continentsList.length
    );
  }

  public onChangeSelectAll(event: Event) {
    if (this.isEditable || this.isAdmin) {
      this._geography.include = [];
      this._geography.exclude = [];

      if ((event.target as HTMLInputElement).checked) {
        this._geography.continentTarget = WorldmapService.setContinents(true);
        this._includeCountries();
      } else {
        this._geography.continentTarget = WorldmapService.setContinents(false);
      }

      this._emitChanges();
    }
  }

  public checkContinent(continent: string): boolean {
    return this._geography.continentTarget[continent];
  }

  public onChangeContinent(event: Event, continent: string) {
    if (this.isEditable || this.isAdmin) {
      if ((event.target as HTMLInputElement).checked) {
        this._geography.continentTarget[continent] = true;
        this._includeCountries();
      } else {
        this._geography.continentTarget[continent] = false;
        this._filterInCountriesOfContinent(continent);
      }

      this._filterExCountriesOfContinent(continent);
      this._emitChanges();
    }
  }

  private _filterInCountriesOfContinent(continent: string) {
    this._geography.include = this._geography.include.filter((value) => {
      return (
        this.getCountriesByContinent(continent).findIndex(
          (value2) => value2.code === value.code
        ) === -1
      );
    });
  }

  private _filterExCountriesOfContinent(continent: string) {
    this._geography.exclude = this._geography.exclude.filter((value) => {
      return (
        this.getCountriesByContinent(continent).findIndex(
          (value2) => value2.code === value.code
        ) === -1
      );
    });
  }

  private _filterExcludedCountries(country: Country) {
    this._geography.exclude = this._geography.exclude.filter(
      (value) => value.code !== country.code
    );
  }

  /***
   * this function is called when we delete the include country form the
   * list.
   * @param event
   */
  public removeIncludedCountry(event: { value: Country }) {
    this._countryToExclude(event.value);
    this._emitChanges();
  }

  /***
   * based on the value receive to this function we
   * find the country from this._allCountries and then we
   * check if that country is in this._geography.includeCountries
   * if yes then we filter that country from the same list and add it in
   * this._geography.excludeCountries.
   * @param value
   * @private
   */
  private _countryToExclude(value: Country) {
    const index = this._allCountries.findIndex(
      (existCountry) => existCountry.code === value.code
    );

    if (index !== -1) {
      const findCountry = this._allCountries[index];

      if (
        this._geography.include.some(
          (existCountry) => existCountry.code === value.code
        )
      ) {
        this._filterIncludedCountries(findCountry);

        if (
          !this._geography.exclude.some(
            (existCountry) => existCountry.code === findCountry.code
          )
        ) {
          this._geography.exclude.push(findCountry);
        }

        this._translateNotificationService.success(
          'ERROR.SUCCESS',
          'ERROR.COUNTRY.EXCLUDED'
        );
      } else {
        this._translateNotificationService.success(
          'ERROR.SUCCESS',
          'ERROR.COUNTRY.ALREADY_EXCLUDED'
        );
      }
    }
  }

  private _filterIncludedCountries(country: Country) {
    this._geography.include = this._geography.include.filter(
      (value) => value.code !== country.code
    );
  }

  public checkCountry(country: Country): boolean {
    return this._geography.include.some((value) => value.code === country.code);
  }

  public onChangeCountry(event: Event, country: Country) {
    if (this.isEditable || this.isAdmin) {
      if ((event.target as HTMLInputElement).checked) {
        this._geography.include = [...this._geography.include, country];
        this._filterExcludedCountries(country);
      } else {
        this.removeIncludedCountry({value: country});
      }

      this._emitChanges();
    }
  }

  public onClickToggle(event: Event) {
    event.preventDefault();
    this._showToggleList = !this._showToggleList;
  }

  private _emitChanges() {
    this.geographyChange.emit(this._geography);
  }

  public getFlagSrc(code: string): string {
    return `https://res.cloudinary.com/umi/image/upload/c_scale,h_30,r_50,w_30/app/flags/${code}.png`;
  }

  public getContinents(): Array<string> {
    return this._translateService.currentLang === 'en'
      ? ['africa', 'asia', 'europe', 'americaNord', 'oceania', 'americaSud']
      : this.continents;
  }

  onChangeCountrySearch(value: string) {
    this._searchCountryString = value;
    this._searchCountries = [];
    if (this._searchCountryString === '') {
      this._searchCountries = [];
    } else if (this._searchCountryString.length > 2) {
      this._allCountries.map(
        (item) => {
          if (item.names) {
            if (Object.values(item.names).some(v => v.toLowerCase().indexOf(value.toLowerCase()) !== -1
              || value.toLowerCase().indexOf(v.toLowerCase()) !== -1)) {
              this._searchCountries.push(item);
            }
          }
        }
      );
    }
  }

  get continents(): Array<string> {
    return WorldmapService.continentsList;
  }

  get geography(): GeographySettings {
    return this._geography;
  }

  get searchCountryString(): string {
    return this._searchCountryString;
  }

  get showToggleList(): boolean {
    return this._showToggleList;
  }

  get searchCountries(): Array<Country> {
    return this._searchCountries;
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }
}
