import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedWorldmapService } from '../shared-worldmap/services/shared-worldmap.service';
import { SharedTargetingWorldInterface } from './interfaces/shared-targeting-world-interface';
import { IndexService } from '../../../../services/index/index.service';
import { Country } from '../../../../models/country';
import { Response } from '../../../../models/response';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-shared-targeting-world',
  templateUrl: './shared-targeting-world.component.html',
  styleUrls: ['./shared-targeting-world.component.scss']
})

export class SharedTargetingWorldComponent implements OnInit {

  @Input() set continentsConfiguration(value: any) {
    console.log(value);
    this._initializeContinents(value);
  }

  @Input() isEditable: boolean = true;

  @Input() isAdmin: boolean = false;

  @Output() targetingDataChanged: EventEmitter<SharedTargetingWorldInterface> = new EventEmitter<SharedTargetingWorldInterface>();

  continents: Array<string> = SharedWorldmapService.continentsList;

  showModal: boolean = false;

  targetingWorldData: SharedTargetingWorldInterface = {
    includeContinents: [],
    includeCountries: [],
    excludeCountries: []
  };

  allCountries: Array<Country> = [];

  africaCountries: Array<Country> = [];

  asiaCountries: Array<Country> = [];

  russiaCountries: Array<Country> = [];

  europeCountries: Array<Country> = [];

  oceaniaCountries: Array<Country> = [];

  northAmericaCountries: Array<Country> = [];

  southAmericaCountries: Array<Country> = [];

  constructor(private _indexService: IndexService,
              private _translateNotificationService: TranslateNotificationsService) {
    this._getAllCountries();
  }

  ngOnInit() {
  }

  private _getAllCountries() {
    this._indexService.getWholeSet({ type: 'countries' }).subscribe((response: Response) => {
      this.allCountries = response.result;
      this._allContinentsCountries();
      this._countriesToInclude();
      this._emitChanges();
    }, () => {
      this._translateNotificationService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }

  private _allContinentsCountries() {
    if (this.allCountries.length > 0 && this.continents.length > 0 ) {
      this.allCountries.forEach((country) => {
        if (country.continent.toLowerCase() === 'asia') {
          this.asiaCountries.push(country)
        } else if (country.continent.toLowerCase() === 'africa') {
          this.africaCountries.push(country)
        } else if (country.continent.toLowerCase() === 'europe') {
          this.europeCountries.push(country)
        } else if (country.continent.toLowerCase() === 'oceania') {
          this.oceaniaCountries.push(country)
        } else if (country.continent.toLowerCase() === 'americas' && country.subcontinent.toLowerCase() === 'northern america') {
          this.northAmericaCountries.push(country)
        } else if (country.continent.toLowerCase() === 'americas' && country.subcontinent.toLowerCase() === 'south america' || 'caribbean') {
          this.southAmericaCountries.push(country)
        } else if (country.continent.toLowerCase() === 'russia') {
          this.russiaCountries.push(country)
        }
      });
    }
  }

  private _initializeContinents(value: any) {
    for (const prop in value) {
      if (value.hasOwnProperty(prop)) {
        if (value[prop] && !this.targetingWorldData.includeContinents.some((existCont) => existCont === prop)) {
          this.targetingWorldData.includeContinents.push(prop);
        }
      }
    }
  }

  private _countriesToInclude() {
    this.targetingWorldData.includeCountries = [];

    if (this.targetingWorldData.includeContinents.length > 0) {
      this.targetingWorldData.includeContinents.forEach((continent) => {
        this.targetingWorldData.includeCountries.push(...this._getCountriesByContinent(continent));
      });
    }

  }

  private _getCountriesByContinent(continent: string): Array<Country> {
    if (continent === 'americaNord') {
      return this.northAmericaCountries;
    } else if (continent === 'americaSud') {
      return this.southAmericaCountries
    } else {
      return this.allCountries.filter((country) => country.continent.toLowerCase() === continent.toLowerCase());
    }
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

  public onChangeContinent(event: Event, continent: string) {
    if (this.isEditable) {
      if ((event.target as HTMLInputElement).checked) {
        this.targetingWorldData.includeContinents.push(continent);
        this.targetingWorldData.includeCountries.push(...this._getCountriesByContinent(continent));
      } else {
        this.targetingWorldData.includeContinents = this.targetingWorldData.includeContinents.filter((value) => value !== continent);
        this._countriesToInclude();
      }
      this._emitChanges();
    }
  }

  public checkContinent(continent: string): boolean {
    return this.targetingWorldData.includeContinents.some((value) => value === continent);
  }

  public addCountryToInclude(event: { value: Array<Country> }) {
    event.value.forEach((country: Country) => {
      if(!this.targetingWorldData.includeCountries.some((existedCountry) => existedCountry.name === country.name)) {
        this.targetingWorldData.includeCountries.push(this._getCountryByName(country.name));
        this._emitChanges();
      } else {
        this._translateNotificationService.error('ERROR.ERROR', 'ERROR.COUNTRY.ALREADY_ADDED');
      }
    });
  }

  public addCountryToExclude(event: { value: Array<Country> }) {
    event.value.forEach((country: Country) => {
      if(!this.targetingWorldData.excludeCountries.some((existedCountry) => existedCountry.name === country.name)) {
        this.targetingWorldData.excludeCountries.push(this._getCountryByName(country.name));
        this._emitChanges();
      } else {
        this._translateNotificationService.error('ERROR.ERROR', 'ERROR.COUNTRY.ALREADY_EXCLUDED');
      }
    });
  }

  public openModal(event: Event) {
    event.preventDefault();
    this.showModal = true;
  }

  private _emitChanges() {
    console.log(this.targetingWorldData);
    this.targetingDataChanged.emit(this.targetingWorldData);
  }

  private _getCountryByName(searchName: string): Country {
    return this.allCountries.find((countries) => countries.name.toLowerCase() === searchName.toLowerCase());
  }

}

/*  public onChangeContinentExclude(event: Event, continent: string) {
    if (this.isEditable) {

      if ((event.target as HTMLInputElement).checked) {
        this.targetingWorldData.excludeContinents.push(continent)
      } else {
        this.targetingWorldData.excludeContinents = this.targetingWorldData.excludeContinents.filter((value) => value !== continent);
      }

      this._emitChanges();
    }
    console.log(this.targetingWorldData);
  }*/
