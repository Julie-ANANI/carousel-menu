import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedTargetingWorldInterface } from './interfaces/shared-targeting-world-interface';
import { IndexService } from '../../../../services/index/index.service';
import { Country } from '../../../../models/country';
import { Response } from '../../../../models/response';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedWorldmapService } from '../shared-worldmap/services/shared-worldmap.service';

@Component({
  selector: 'app-shared-targeting-world',
  templateUrl: './shared-targeting-world.component.html',
  styleUrls: ['./shared-targeting-world.component.scss']
})

export class SharedTargetingWorldComponent implements OnInit {

  @Input() set excludeCountries(value: Array<Country>) {
    this._targetingWorldData.excludeCountries = value;
  }

  @Input() set includeCountries(value: Array<Country>) {
    this._targetingWorldData.includeCountries = value;
  }

  @Input() set continentsConfiguration(value: any) {
    this._continentsConfiguration = value;
  }

  @Input() isEditable: boolean = true;

  @Input() isAdmin: boolean = false;

  @Output() targetingDataChanged: EventEmitter<SharedTargetingWorldInterface> = new EventEmitter<SharedTargetingWorldInterface>();

  private _continentsConfiguration: any;

  private _continents: Array<string> = SharedWorldmapService.continentsList;

  private _allCountries: Array<Country> = [];

  private _continentCountries: {[continent: string]: Array<Country>} = {};

  private _showModal: boolean = false;

  private _targetingWorldData: SharedTargetingWorldInterface = {
    includeContinents: [],
    includeCountries: [],
    excludeCountries: []
  };

  constructor(private _indexService: IndexService,
              private _translateService: TranslateService,
              private _translateNotificationService: TranslateNotificationsService) { }

  ngOnInit(): void {
    this._initializeContinents();
    this._getAllCountries();
  }

  private _initializeContinents() {
    const value = this._continentsConfiguration;

    for (const prop in value) {
      if (value.hasOwnProperty(prop)) {
        if (value[prop] && !this._targetingWorldData.includeContinents.some((existCont) => existCont === prop)) {
          this._targetingWorldData.includeContinents.push(prop);
        }
      }
    }

  }

  private _getAllCountries() {
    this._indexService.getWholeSet({ type: 'countries' }).subscribe((response: Response) => {
      this._allCountries = response.result;
      this._allContinentsCountries();

      if (this._targetingWorldData.includeCountries.length === 0 && this._targetingWorldData.includeContinents.length > 0) {
        this._includeCountries();
      }

      if (this._targetingWorldData.excludeCountries.length > 0) {
        this._filterExCountriesFromIncluded();
      }

    }, () => {
      this._translateNotificationService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }

  private _allContinentsCountries() {
    this._continentCountries = this._allCountries.reduce((acc, country) => {
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

      }, { 'africa': [], 'americaNord': [], 'americaSud': [], 'antarctic': [], 'asia': [], 'europe': [], 'oceania': [] } );

  }

  private _includeCountries() {
    this._targetingWorldData.includeContinents.forEach((continent) => {
      this._targetingWorldData.includeCountries.push(...this.getCountriesByContinent(continent));
    });
  }

  public getCountriesByContinent(continent_name: string): Array<Country> {
    return this._continentCountries[continent_name];
  }

  private _filterExCountriesFromIncluded() {
    this._targetingWorldData.includeCountries = this._targetingWorldData.includeCountries.filter((value) => {
      return this._targetingWorldData.excludeCountries.some((value2) => value2.name !== value.name);
    });
  }

  public checkSelectAll(): boolean {
    return this._targetingWorldData.includeContinents.length === this._continents.length || this._targetingWorldData.includeContinents.length === 7;
  }

  public onChangeSelectAll(event: Event) {
    if (this.isEditable || this.isAdmin) {

      this._targetingWorldData.includeCountries = [];
      this._targetingWorldData.includeContinents = [];
      this._targetingWorldData.excludeCountries = [];

      if ((event.target as HTMLInputElement).checked) {
        this._continentsConfiguration = SharedWorldmapService.reinitializeContinentsToTrue();
        this._initializeContinents();
        this._includeCountries();
      }

      this._emitChanges();
    }
  }

  public checkContinent(continent: string): boolean {
    return this._targetingWorldData.includeContinents.some((value) => value === continent);
  }

  public onChangeContinent(event: Event, continent: string) {
    if (this.isEditable || this.isAdmin) {

      if ((event.target as HTMLInputElement).checked) {
        this._targetingWorldData.includeContinents.push(continent);
      } else {
        this._targetingWorldData.includeContinents = this._targetingWorldData.includeContinents.filter((value) => value !== continent);
      }

      this._targetingWorldData.includeCountries = [];
      this._includeCountries();
      this._filterExCountriesOfContinent(continent);
      this._emitChanges();

    }
  }

  private _filterExCountriesOfContinent(continent: string) {
    this._targetingWorldData.excludeCountries = this._targetingWorldData.excludeCountries.filter((value) => {
      return this.getCountriesByContinent(continent).indexOf(value) < 0;
    });
  }

  public autoCompleteConfig(type: string): any {
    switch (type) {

      case 'exclude':
        return {
          placeholder: 'SHARED_TARGETING_WORLD.PLACEHOLDER.TO_EXCLUDE_COUNTRY',
          initialData: this._targetingWorldData.excludeCountries,
          type: 'countries'
        };

      case 'include':
        return {
          placeholder: 'SHARED_TARGETING_WORLD.PLACEHOLDER.TO_INCLUDE_COUNTRY',
          initialData: this._targetingWorldData.includeCountries,
          type: 'countries'
        };

    }
  }

  public addCountryToInclude(event: { value: Array<Country> }) {
    if (this.isEditable || this.isAdmin) {
      event.value.forEach((country: Country) => {
        if(!this._targetingWorldData.includeCountries.some((existedCountry) => existedCountry.name === country.name)) {
          this._translateNotificationService.success('ERROR.SUCCESS', 'ERROR.COUNTRY.INCLUDED');
          this._targetingWorldData.includeCountries = [...this._targetingWorldData.includeCountries, this._getCountryByName(country.name)];
          this._filterExcludedCountries(country);
          this._emitChanges();
        }
      });
    }
  }

  private _getCountryByName(searchName: string): Country {
    return this._allCountries.find((countries) => countries.name.toLowerCase() === searchName.toLowerCase());
  }

  private _filterExcludedCountries(country: Country) {
    this._targetingWorldData.excludeCountries = this._targetingWorldData.excludeCountries.filter((value) => value.name !== country.name);
  }

  public removeIncludedCountry(event: { value: Country }) {
    this._countryToExclude(event.value, true);
    this._emitChanges();
  }

  private _countryToExclude(value: Country, notify: boolean = false) {
    const index = this._allCountries.findIndex((existCountry) => existCountry.name === value.name);

    if (index !== -1) {
      const findCountry = this._allCountries[index];

      if (this._targetingWorldData.includeCountries.some((existCountry) => existCountry.name === value.name)) {
        this._filterIncludedCountries(findCountry);

        if (!this._targetingWorldData.excludeCountries.some((existCountry) => existCountry.name === findCountry.name)) {
          this._targetingWorldData.excludeCountries.push(findCountry);
        }

        if (notify) {
          this._translateNotificationService.success('ERROR.SUCCESS', 'ERROR.COUNTRY.EXCLUDED');
        }

      } else if (notify) {
        this._translateNotificationService.success('ERROR.SUCCESS', 'ERROR.COUNTRY.ALREADY_EXCLUDED');
      }

    }

  }

  private _filterIncludedCountries(country: Country) {
    this._targetingWorldData.includeCountries = this._targetingWorldData.includeCountries.filter((value) => value.name !== country.name);
  }

  public addCountryToExclude(event: { value: Array<Country> }) {
    event.value.forEach((country: Country) => {
      if (!this._targetingWorldData.excludeCountries.some((value) => value.name === country.name)) {
        this._countryToExclude(country, true);
      }
    });
    this._emitChanges();
  }

  public removeExcludedCountry(event: { value: Country }) {
    if (this._targetingWorldData.includeCountries.some((existCountry) => existCountry.continent === event.value.continent
      && existCountry.subcontinent === event.value.subcontinent)) {
      this._targetingWorldData.includeCountries = [...this._targetingWorldData.includeCountries, event.value];
      this._translateNotificationService.success('ERROR.SUCCESS', 'ERROR.COUNTRY.INCLUDED');
    }
    this._filterExcludedCountries(event.value);
    this._emitChanges();
  }

  public openModal(event: Event) {
    event.preventDefault();
    this._showModal = true;
  }

  public checkCountry(country: Country): boolean {
    return this._targetingWorldData.includeCountries.some((value) => value.name === country.name);
  }

  public onChangeCountry(event: Event, country: Country) {
    if (this.isEditable || this.isAdmin) {

      if ((event.target as HTMLInputElement).checked) {
        this._targetingWorldData.includeCountries = [...this._targetingWorldData.includeCountries, country];
        this._filterExcludedCountries(country);
      } else {
        const event = { value: country };
        this.removeIncludedCountry(event);
      }

      this._emitChanges();
    }
  }

  private _emitChanges() {
    this.targetingDataChanged.emit(this._targetingWorldData);
  }

  public getFlagSrc(code: string): string {
    return `https://res.cloudinary.com/umi/image/upload/c_scale,h_30,r_50,w_30/app/flags/${code}.png`;
  }

  public getContinents(): Array<string> {
    return this._translateService.currentLang === 'en' ? ['africa', 'asia', 'europe', 'americaNord', 'oceania', 'americaSud'] : this._continents;
  }

  get continentsConfiguration(): any {
    return this._continentsConfiguration;
  }

  get continents(): Array<string> {
    return this._continents;
  }

  get allCountries(): Array<Country> {
    return this._allCountries;
  }

  get continentCountries(): { [p: string]: Array<Country> } {
    return this._continentCountries;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get targetingWorldData(): SharedTargetingWorldInterface {
    return this._targetingWorldData;
  }

}
