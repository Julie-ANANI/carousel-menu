import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AutocompleteService} from '../../../services/autocomplete/autocomplete.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Country} from '../../../models/country';

@Component({
  selector: 'app-auto-complete-country',
  templateUrl: './auto-complete-country.component.html',
})
export class AutoCompleteCountryComponent implements OnInit, OnDestroy {

  get subscribe(): Subject<any> {
    return this._subscribe;
  }

  get countriesSuggestion(): Array<Country> {
    return this._countriesSuggestion;
  }

  get displayCountrySuggestion(): boolean {
    return this._displayCountrySuggestion;
  }

  get country(): Country {
    return this._country;
  }

  @Input() set country(value: Country) {
    this._country = value || <Country>{};
  }

  /**
   * make the input field not editable
   */
  @Input() isDisabled = false;

  /**
   * to make the input field height small
   */
  @Input() isSmall = false;

  /**
   * input id
   */
  @Input() inputId = '';

  /**
   * to show or hide the shadowed effect of the input field
   */
  @Input() hasShadowed = false;

  @Input() placeholder = 'Enter the country';

  @Output() countryChange: EventEmitter<Country> = new EventEmitter<Country>();

  private _country: Country = <Country>{};

  private _displayCountrySuggestion = false;

  private _countriesSuggestion: Array<Country> = [];

  private _subscribe: Subject<any> = new Subject<any>();

  constructor(private _autoCompleteService: AutocompleteService) { }

  ngOnInit() {
  }

  public onSuggestCountries() {
    if (this._country.name && this._country.name.length > 2 && !this.isDisabled) {
      this._displayCountrySuggestion = true;
      this._countriesSuggestion = [];
      const _query = {query: this._country.name, type: 'countries'};

      this._autoCompleteService.get(_query).pipe(takeUntil(this._subscribe)).subscribe((res: Array<Country>) => {
        if (res.length === 0) {
          this._displayCountrySuggestion = false;
        } else {
          res.forEach((_item: Country) => {
            const index = this._countriesSuggestion.findIndex((_country) => {
              return _country.flag.toLowerCase() === _item.flag.toLowerCase();
            });
            if (index === -1) {
              this._countriesSuggestion.push(_item);
            }
          });
        }

        this._countriesSuggestion = this._countriesSuggestion.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });

      });
    }
  }

  public onCountrySelect(event: Country) {
    this._country = event;
    this._displayCountrySuggestion = false;
    this.countryChange.emit(this._country);
  }

  ngOnDestroy(): void {
    this._subscribe.next();
    this._subscribe.complete();
  }

}
