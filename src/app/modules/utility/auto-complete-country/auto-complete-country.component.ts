import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AutocompleteService} from '../../../services/autocomplete/autocomplete.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-auto-complete-country',
  templateUrl: './auto-complete-country.component.html',
  styleUrls: ['./auto-complete-country.component.scss']
})
export class AutoCompleteCountryComponent implements OnInit, OnDestroy {

  get subscribe(): Subject<any> {
    return this._subscribe;
  }

  get countriesSuggestion(): Array<string> {
    return this._countriesSuggestion;
  }

  get displayCountrySuggestion(): boolean {
    return this._displayCountrySuggestion;
  }

  get country(): string {
    return this._country;
  }

  @Input() set country(value: string) {
    this._country = value;
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

  @Output() countryChange: EventEmitter<string> = new EventEmitter<string>();

  private _country = '';

  private _displayCountrySuggestion = false;

  private _countriesSuggestion: Array<string> = [];

  private _subscribe: Subject<any> = new Subject<any>();

  constructor(private _autoCompleteService: AutocompleteService,) { }

  ngOnInit() {
  }

  public onSuggestCountries() {
    if (this._country && this._country.length > 2 && !this.isDisabled) {
      this._displayCountrySuggestion = true;
      this._countriesSuggestion = [];
      const _query = {query: this._country, type: 'countries'};
      this._autoCompleteService.get(_query).pipe(takeUntil(this._subscribe)).subscribe((res: any) => {
        console.log(res);
        if (res.length === 0) {
          this._displayCountrySuggestion = false;
        } else {
          res.forEach((items: any) => {
            const valueIndex = this._countriesSuggestion.indexOf(items.name);
            if (valueIndex === -1) {
              this._countriesSuggestion.push(items.name);
            }
          });
        }
      });
    }
  }

  public onCountrySelect(value: string) {
    this._country = value;
    this._displayCountrySuggestion = false;
    this.countryChange.emit(this._country);
  }

  ngOnDestroy(): void {
    this._subscribe.next();
    this._subscribe.complete();
  }

}
