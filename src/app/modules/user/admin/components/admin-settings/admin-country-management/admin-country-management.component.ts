import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import { first } from 'rxjs/operators';
import {SidebarInterface} from '../../../../../sidebar/interfaces/sidebar-interface';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {EmailService} from '../../../../../../services/email/email.service';
import {Table} from '../../../../../table/models/table';
import {Config} from '../../../../../../models/config';


@Component({
  selector: 'app-admin-country-management',
  templateUrl: './admin-country-management.component.html',
  styleUrls: ['./admin-country-management.component.scss']
})
export class AdminCountryManagementComponent implements OnInit {
  get showDeleteModal(): boolean {
    return this._showDeleteModal;
  }

  set showDeleteModal(value: boolean) {
    this._showDeleteModal = value;
  }

  private _more: SidebarInterface = {};
  sidebarState = new Subject<string>();
  private _countriesTable: Table = null;

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1}'
  };

  private _countryList: {filteredCountries: Array<any>, _metadata: any};
  private _currentCountry: any = null;
  public countriesToRemove: any[] = null;
  private _showDeleteModal = false;

  constructor(private _emailService: EmailService,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit(): void {

    this._countryList = {
      filteredCountries: [],
      _metadata: {
        totalCount: 0
      }
    };

    this._showDeleteModal = false;

    this.loadCountries(null);
  }

  filterCountry() {
    this._more = {
      animate_state: 'active',
      title: 'COMMON.EXCLUDE-COUNTRIES',
      type: 'excludeCountry'
    };
  }

  public loadCountries(config: Config) {
    this._config = config || this._config;
    this._emailService.getCountries(this._config)
      .subscribe((result: any) => {
        if (result && result.message) {
          // The server may be busy...
          this._notificationsService.error('Warning', 'The server is busy, try again in 1 minute.');
        } else {
          this._countryList._metadata = result._metadata;
          this._countryList.filteredCountries = result.countryfilters.map((entry: any) => {
            entry.expiration = new Date(entry.expiration).getTime() ? entry.expiration : '';
            return entry;
          });

          this._countriesTable = {
            _selector: 'admin-country-management',
            _title: 'COMMON.BLACKLIST.COUNTRIES',
            _content: this._countryList.filteredCountries,
            _total: this._countryList._metadata.totalCount,
            _isTitle: true,
            _isPaginable: true,
            _isSearchable: true,
            _isDeletable: true,
            _isSelectable: true,
            _isEditable: true,
            _editIndex: 1,
            _columns: [
              {_attrs: ['name'], _name: 'COMMON.COUNTRY', _type: 'TEXT', _isSearchable: true, _isSortable: true},
              {_attrs: ['acceptation'], _name: 'COMMON.BLACKLIST.ACCEPTATION', _type: 'PROGRESS', _isSearchable: true, _isSortable: true},
              {_attrs: ['expiration'], _name: 'COMMON.EXPIRATION', _type: 'DATE', _isSortable: true
              }]
          };
        }
      }, (error: any) => {
        this._notificationsService.error('Error', error);
      });
  }

  addCountry(country: any) {
    this._emailService.addCountry(country)
      .subscribe((result: any) => {
        this._notificationsService.success('Country Management', `The country ${country.name} has been filtered successfully`);
        this._more = {animate_state: 'inactive', title: this._more.title};
        this.loadCountries(this._config);
      }, (error: any) => {
        this._notificationsService.error('Error', error);
      });
  }

  editCountry(country: any) {
    this._more = {
      animate_state: 'active',
      title: 'COMMON.EDIT-COUNTRY',
      type: 'editCountry'
    };
    this._currentCountry = country;
  }

  countryEditionFinish(country: any) {
    this._emailService.updateCountry(country._id, country)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this._notificationsService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.UPDATE');
          this._more = {animate_state: 'inactive', title: this._more.title};
          this.loadCountries(this._config);
        },
        (error: any) => {
          this._notificationsService.error('ERROR.ERROR', error.message);
        });
  }

  closeSidebar(value: SidebarInterface) {
    this.more.animate_state = value.animate_state;
    this.sidebarState.next(this.more.animate_state);
  }

  deleteCountriesModal(countries: any) {
    this.countriesToRemove = [];
    this._showDeleteModal = true;
    countries.forEach((value: any) => this.countriesToRemove.push(value));
  }

  closeModal(event: Event) {
    event.preventDefault();
    this._showDeleteModal = false;
  }

  removeCountries() {
    for (const country of this.countriesToRemove) {
      this.removeCountry(country._id);
    }
    this.countriesToRemove = [];
    this._showDeleteModal = false;
  }

  removeCountry(countryId: string) {
    this._emailService.deleteCountry(countryId)
      .pipe(first())
      .subscribe((foo: any) => {
        this.loadCountries(this._config);
      });
  }

  get more(): SidebarInterface { return this._more; }
  get countriesTable(): Table { return this._countriesTable; }

  get config(): Config { return this._config; }

  set config(value: Config) {
    this._config = value;
    this.loadCountries(this._config);
  }

  get data(): Array<any> { return this._countryList.filteredCountries; };
  get currentCountry(): any { return this._currentCountry; }
  get metadata(): any { return this._countryList._metadata; };
}
