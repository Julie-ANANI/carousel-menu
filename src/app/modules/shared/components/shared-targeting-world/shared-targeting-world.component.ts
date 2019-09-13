import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedWorldmapService } from '../shared-worldmap/services/shared-worldmap.service';
import { SharedTargetingWorldInterface } from './interfaces/shared-targeting-world-interface';
import { IndexService } from '../../../../services/index/index.service';
import { Country } from '../../../../models/country';
import { Response } from '../../../../models/response';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-shared-targeting-world',
  templateUrl: './shared-targeting-world.component.html',
  styleUrls: ['./shared-targeting-world.component.scss']
})

export class SharedTargetingWorldComponent {

  @Input() set continentsConfiguration(value: any) {
    this._initializeContinents(value);
  }

  @Input() isEditable: boolean = true;

  @Input() isAdmin: boolean = false;

  @Output() targetingDataChanged: EventEmitter<SharedTargetingWorldInterface> = new EventEmitter<SharedTargetingWorldInterface>();

  private _continents: Array<string> = SharedWorldmapService.continentsList;

  private _allCountries: Array<Country> = [];

  private _continentCountries: {[continent: string]: Array<Country>} = {};

  private _showModal: boolean = false;

  private _targetingWorldData: SharedTargetingWorldInterface = {
    includeContinents: [],
    includeCountries: []
  };

  constructor(private _indexService: IndexService,
              private _translateService: TranslateService,
              private _translateNotificationService: TranslateNotificationsService) {
    this._getAllCountries();
  }

  private _getAllCountries() {
    this._indexService.getWholeSet({ type: 'countries' }).subscribe((response: Response) => {
      this._allCountries = response.result;
      this._allContinentsCountries();
      this._countriesToInclude();
      this._emitChanges();
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

  private _initializeContinents(value: any) {
    for (const prop in value) {
      if (value.hasOwnProperty(prop)) {
        if (value[prop] && !this._targetingWorldData.includeContinents.some((existCont) => existCont === prop)) {
          this._targetingWorldData.includeContinents.push(prop);
        }
      }
    }
  }

  private _countriesToInclude() {
    this._targetingWorldData.includeCountries = [];
    this._targetingWorldData.includeContinents.forEach((continent) => {
      this._targetingWorldData.includeCountries.push(...this.getCountriesByContinent(continent));
    });
  }

  public getCountriesByContinent(continent_name: string): Array<Country> {
    return this._continentCountries[continent_name];
  }

  public autoCompleteConfig(type: string): any {
    switch (type) {

      case 'exclude':
        return {
          placeholder: 'SHARED_TARGETING_WORLD.PLACEHOLDER.TO_EXCLUDE_COUNTRY',
          type: 'countries'
        };

      case 'include':
        return {
          placeholder: 'SHARED_TARGETING_WORLD.PLACEHOLDER.TO_INCLUDE_COUNTRY',
          type: 'countries'
        };

    }
  }

  public onChangeSelectAll(event: Event) {
    if (this.isEditable) {
      if ((event.target as HTMLInputElement).checked) {

        const values = this._continents.reduce((acc, continent) => {
          acc[continent] = true;
          return acc;
        }, {} as any);

        this._initializeContinents(values);
        this._countriesToInclude();

      } else {
        this._targetingWorldData.includeCountries = [];
        this._targetingWorldData.includeContinents = [];
      }
      this._emitChanges();
    }
  }

  public checkSelectAll(): boolean {
    return this._targetingWorldData.includeContinents.length === this._continents.length;
  }

  public onChangeContinent(event: Event, continent: string) {
    if (this.isEditable) {
      if ((event.target as HTMLInputElement).checked) {
        this._targetingWorldData.includeContinents.push(continent);
        this._targetingWorldData.includeCountries.push(...this.getCountriesByContinent(continent));
      } else {
        this._targetingWorldData.includeContinents = this._targetingWorldData.includeContinents.filter((value) => value !== continent);
        this._countriesToInclude();
      }
      this._emitChanges();
    }
  }

  public checkContinent(continent: string): boolean {
    return this._targetingWorldData.includeContinents.some((value) => value === continent);
  }

  public openModal(event: Event) {
    event.preventDefault();
    this._showModal = true;
  }

  public addCountryToInclude(event: { value: Array<Country> }) {
    if (this.isEditable) {
      event.value.forEach((country: Country) => {
        if(!this._targetingWorldData.includeCountries.some((existedCountry) => existedCountry.name === country.name)) {
          this._targetingWorldData.includeCountries.push(this._getCountryByName(country.name));
          this._emitChanges();
        }
      });
    }
  }

  private _getCountryByName(searchName: string): Country {
    return this._allCountries.find((countries) => countries.name.toLowerCase() === searchName.toLowerCase());
  }

  public removeCountry(event: {value: Country}) {
    this._filterIncludedCountries(event.value);
  }

  public addCountryToExclude(event: { value: Array<Country> }) {
    event.value.forEach((country: Country) => {
      if(this._targetingWorldData.includeCountries.some((existedCountry) => existedCountry.name === country.name)) {
        this._filterIncludedCountries(country);
        this._emitChanges();
      } else {
        this._translateNotificationService.error('ERROR.ERROR', 'ERROR.COUNTRY.ALREADY_EXCLUDED');
      }
    });
  }

  private _emitChanges() {
    this.targetingDataChanged.emit(this._targetingWorldData);
  }

  public getFlagSrc(code: string): string {
    return `https://res.cloudinary.com/umi/image/upload/c_fill,h_60,w_60/app/flags/${code}.png`;
  }

  public onChangeCountry(event: Event, country: Country, continent: string) {
    if (this.isEditable) {
      if ((event.target as HTMLInputElement).checked) {
        this._targetingWorldData.includeCountries.push(country);
      } else {
        this._filterIncludedCountries(country);
      }
      this._emitChanges();
    }
  }

  private _filterIncludedCountries(country: Country) {
    this._targetingWorldData.includeCountries = this._targetingWorldData.includeCountries.filter((value) => value.name !== country.name);
  }

  public checkCountry(country: Country): boolean {
    return this._targetingWorldData.includeCountries.some((value) => value.name === country.name);
  }

  public getContinents(): Array<string> {
    return this._translateService.currentLang === 'en' ? ['africa', 'asia', 'europe', 'americaNord', 'oceania', 'americaSud'] : this._continents;
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
