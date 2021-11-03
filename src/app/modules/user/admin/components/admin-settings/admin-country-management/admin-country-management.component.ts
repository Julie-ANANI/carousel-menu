import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {first} from 'rxjs/operators';
import {SidebarInterface} from '../../../../../sidebars/interfaces/sidebar-interface';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {EmailService} from '../../../../../../services/email/email.service';
import {isPlatformBrowser} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import { Table, Config } from '@umius/umi-common-component/models';

@Component({
  templateUrl: './admin-country-management.component.html',
  styleUrls: ['./admin-country-management.component.scss']
})

export class AdminCountryManagementComponent implements OnInit {

  private _countriesTable: Table = <Table>{};

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1}'
  };

  private _isLoading = true;

  private _fetchingError = false;

  private _countryList: {filteredCountries: Array<any>, _metadata: any} = {
    filteredCountries: [],
    _metadata: { totalCount: -1 }
  };

  private _currentCountry: any = null;

  private _countriesToRemove: any[] = null;

  private _showDeleteModal = false;

  private _sidebarValue: SidebarInterface = <SidebarInterface>{};

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _emailService: EmailService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._initTable();
      this._getCountries(this._config);
    }
  }

  private _getCountries(config: Config) {
    this._config = config || this._config;

    this._emailService.getCountries(this._config).pipe(first()).subscribe((result: any) => {
        if (result && result.message) {
          // The server may be busy...
          this._translateNotificationsService.error('Warning', 'The server is busy, try again in 1 minute.');
        } else {
          this._countryList._metadata = result._metadata;
          this._countryList.filteredCountries = result.countryfilters.map((entry: any) => {
            entry.expiration = new Date(entry.expiration).getTime() ? entry.expiration : '';
            return entry;
          });
          this._initTable();
        }
      }, (error: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(error.status));
      console.error(error);
      this._fetchingError = true;
    });
  }

  private _initTable() {
    this._countriesTable = {
      _selector: 'admin-country-management',
      _title: 'Blacklisted countries',
      _content: this._countryList.filteredCountries,
      _total: this._countryList._metadata.totalCount,
      _isTitle: true,
      _isPaginable: this._countryList._metadata.totalCount > 10,
      _isSearchable: !!this.canAccess(['searchBy']),
      _isDeletable: this.canAccess(['delete']),
      _isSelectable: this.canAccess(['delete']),
      _clickIndex: this.canAccess(['view']) || this.canAccess(['edit']) ? 1 : null,
      _columns: [
        {
          _attrs: ['name'],
          _name: 'Country',
          _type: 'TEXT',
          _isSearchable: this.canAccess(['searchBy', 'country']),
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'country'])
        },
        {
          _attrs: ['acceptation'],
          _name: 'Acceptance mails percentage',
          _type: 'PROGRESS',
          _isSearchable: this.canAccess(['searchBy', 'acceptation']),
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'acceptation'])
        },
        {
          _attrs: ['expiration'],
          _name: 'Expires on',
          _type: 'DATE',
          _isSortable: true,
          _isHidden: !this.canAccess(['tableColumns', 'expiration'])
        }]
    };
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'countries'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['settings', 'countries']);
    }
  }

  public excludeSidebar(event: Event) {
    event.preventDefault();
    this._sidebarValue = {
      animate_state: 'active',
      title: 'Exclude Country',
      type: 'EXCLUDE_COUNTRY'
    };
  }

  public addCountry(country: any) {
    this._emailService.addCountry(country).pipe(first()).subscribe(() => {
      this._getCountries(this._config);
      this._translateNotificationsService.success('Success', `The country ${country.name} has been filtered.`);
      }, (error: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(error.status));
      console.error(error);
    });
  }

  public editCountry(country: any) {
    this._currentCountry = country;
    this._sidebarValue = {
      animate_state: 'active',
      title: this.canAccess(['edit']) ? 'Edit Country' : 'Country',
      type: 'EDIT_COUNTRY'
    };
  }

  public countryEditionFinish(country: any) {
    this._emailService.updateCountry(country._id, country).pipe(first()).subscribe((data: any) => {
      this._getCountries(this._config);
      this._translateNotificationsService.success('Success', 'The country has been updated.');
      }, (error: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(error.status));
      console.error(error);
    });
  }

  public deleteCountriesModal(countries: any) {
    this._countriesToRemove = [];
    this._showDeleteModal = true;
    countries.forEach((value: any) => this._countriesToRemove.push(value));
  }

  public removeCountries() {
    for (const country of this._countriesToRemove) {
      this._removeCountry(country._id);
    }
    this._countriesToRemove = [];
    this._showDeleteModal = false;
  }

  private _removeCountry(countryId: string) {
    this._emailService.deleteCountry(countryId).pipe(first()).subscribe((foo: any) => {
      this._getCountries(this._config);
      this._translateNotificationsService.success('Success', 'The country has been deleted.')
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  get countriesTable(): Table {
    return this._countriesTable;
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    this._getCountries(this._config);
  }

  get data(): Array<any> {
    return this._countryList.filteredCountries;
  };

  get currentCountry(): any {
    return this._currentCountry;
  }

  get metadata(): any {
    return this._countryList._metadata;
  };

  get isLoading(): boolean {
    return this._isLoading;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get showDeleteModal(): boolean {
    return this._showDeleteModal;
  }

  set showDeleteModal(value: boolean) {
    this._showDeleteModal = value;
  }

  get countriesToRemove(): any[] {
    return this._countriesToRemove;
  }

}
