import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AutoSuggestionConfig} from './interface/auto-suggestion-config';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {AutocompleteService} from '../../../services/autocomplete/autocomplete.service';
import {HttpErrorResponse} from '@angular/common/http';
import {IndustriesList} from '../../../models/static-data/industries';

/***
 * this component is to show the suggestion based on the autocompleteService. You can select
 * the suggested value by pressing Enter.
 *
 * Input:
 * 1. Config: type of AutoSuggestionConfig. It has different properties that will be assign by the value
 * that you pass or by default values.
 *   a. minChars: minimum char needed to call the service. Default: 2
 *   b. placeholder: any specific placeholder you want to show. Default: COMMON.PLACEHOLDER.AUTO_SUGGESTION
 *   c. type: the value we are looking from in the database. Different types are: 'users'. Default: users
 *   d. identifier: when we get the suggestion form the back in that source which value should be displayed in the
 *   search field. Default: name
 * 2. isSmallInput: ture will make the input filed small in height.
 *
 * Output:
 * 1. valueSelected: output the value selected from the suggestions.
 *
 * Implementation:
 * 1. Not providing config
 *  <auto-suggestion (valueSelected)="anyFunctionName($event)"></auto-suggestion>
 * 2. providing config
 *  <auto-suggestion [config]="autoSuggestionConfig" (valueSelected)="anyFunctionName($event)"></auto-suggestion>
 *
 * Example:
 * client project settings page, while changing the owner.
 */

@Component({
  selector: 'app-utility-auto-suggestion',
  templateUrl: './auto-suggestion.component.html',
  styleUrls: ['./auto-suggestion.component.scss']
})

export class AutoSuggestionComponent implements OnInit, OnDestroy {

  @Input() set config(config: AutoSuggestionConfig) {
    if (config) {
      this._minChars = config.minChars || 3;
      this._placeholder = config.placeholder || 'COMMON.PLACEHOLDER.AUTO_SUGGESTION';
      this._type = config.type || 'users';
      this._identifier = config.identifier || 'name';
    }
  }

  @Input() isSmallInput = false;

  @Output() valueSelected: EventEmitter<any> = new EventEmitter<any>();

  private _minChars = 3;

  private _placeholder = 'COMMON.PLACEHOLDER.AUTO_SUGGESTION';

  private _identifier = 'name';

  private _type = 'users';

  private _searchKeyword: FormControl = new FormControl();

  private _dropdownVisible = false;

  private _loading = false;

  private _currentFocus = -1;

  private _suggestionsSource: Array<any> = [];

  private _industriesList: Array<any> = IndustriesList;

  private _itemSelected: any;

  private _isSearching = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private _autoCompleteService: AutocompleteService) {
  }

  ngOnInit() {
    this._searchKeyword.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this._ngUnsubscribe))
      .subscribe((input: any) => {
        if (input) {
          console.log(input);
          this._isSearching = true;
          if (this.type === 'industry') {
            this._loadIndustries(input);
          } else {
            this._loadResult(input);
          }
        } else {
          this.hideAutoSuggestionDropdown();
        }
      });
  }

  private _loadIndustries(value: string) {
    if (value) {
      this._suggestionsSource = [];
      this._dropdownVisible = true;
      this._loading = true;
      if (value.length >= this._minChars) {
        this._getIndustriesSuggestions(value);
      }
    }
  }

  private _loadResult(value: any) {
    if (value && value.length && (!this._itemSelected || this._itemSelected
      && this._itemSelected[this._identifier] && this._itemSelected[this._identifier].length !== value.length)) {
      this._suggestionsSource = [];
      this._dropdownVisible = true;
      this._loading = true;

      if (value.length >= this._minChars) {
        this._getSuggestions(value);
      }

    }
  }

  private _getIndustriesSuggestions(industryKeyword: string) {
    this._suggestionsSource =
      this._industriesList.filter(item => item.toLowerCase().includes(industryKeyword.toLowerCase()) ||
        industryKeyword.toLowerCase().includes(item.toLowerCase()));
    this._loading = false;
    this._isSearching = this._suggestionsSource.length !== 0;
  }

  private _getSuggestions(searchKey: string) {
    this._autoCompleteService.get({query: searchKey, type: this._type})
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((data) => {
        this._suggestionsSource = data;
        this._loading = false;
        this._isSearching = data.length !== 0;
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
  }

  public showAutoSuggestionDropdown(event: Event) {
    event.preventDefault();
    const value = ((event.target) as HTMLInputElement).value;
    this._loadResult(value);
  }

  public hideAutoSuggestionDropdown() {
    this._dropdownVisible = false;
    this._loading = false;
    this._isSearching = false;
  }

  public onKeyboardPress(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.code === 'ArrowDown') {
      this._currentFocus++;
      this._setFocus(this._currentFocus);
    } else if (event.key === 'ArrowUp' || event.code === 'ArrowUp') {
      this._currentFocus--;
      this._setFocus(this._currentFocus);
    } else if (event.key === 'Enter' || event.code === 'Enter') {
      if (this._currentFocus > -1 && this._suggestionsSource[this._currentFocus]
        && this._suggestionsSource[this._currentFocus][this._identifier]) {
        this.onValueSelect(this._suggestionsSource[this._currentFocus]);
        this._currentFocus = -1;
      }
    }
  }

  private _setFocus(value: number) {
    if (value >= this._suggestionsSource.length) {
      this._currentFocus = 0;
    } else if (value < 0) {
      this._currentFocus = this._suggestionsSource.length - 1;
    }
  }

  private _emitValue(value: any) {
    this.valueSelected.emit(value);
  }

  public onValueSelect(value: any) {
    this._itemSelected = value;
    this._searchKeyword.setValue(value[this._identifier]);
    this._emitValue(value);
    this.hideAutoSuggestionDropdown();
    this._industriesList = IndustriesList;
  }


  get placeholder(): string {
    return this._placeholder;
  }

  get loading(): boolean {
    return this._loading;
  }

  get currentFocus(): number {
    return this._currentFocus;
  }

  get identifier(): string {
    return this._identifier;
  }

  get searchKeyword(): FormControl {
    return this._searchKeyword;
  }

  get dropdownVisible(): boolean {
    return this._dropdownVisible;
  }

  get suggestionsSource(): Array<any> {
    return this._suggestionsSource;
  }

  get isSearching(): boolean {
    return this._isSearching;
  }

  get type(): string {
    return this._type;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
