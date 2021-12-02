import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AutoSuggestionConfig} from './interface/auto-suggestion-config';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {AutocompleteService} from '../../../services/autocomplete/autocomplete.service';
import {HttpErrorResponse} from '@angular/common/http';

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
      this._default = config.default || '';
      this._suggestionDefaultList = config.suggestionList || [];
      this._requestType = config.requestType || 'remote';
      this._isShowAddButton = config.isShowAddButton || false;
      this._showSuggestionFirst = config.showSuggestionFirst || false;

      this.setDefaultValue();
    }
  }

  @Input() isSmallInput = false;

  @Input() isSmallerInput = false;

  @Output() valueSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output() valueAdded = new EventEmitter();

  private _suggestionDefaultList: Array<any> = [];
  private _requestType = 'remote';
  private _showSuggestionFirst = false;


  private _minChars = 3;

  private _inputNewValue = '';

  private _isShowAddButton = false;

  private _default = '';

  private _placeholder = 'COMMON.PLACEHOLDER.AUTO_SUGGESTION';

  private _identifier = 'name';

  private _type = 'users';

  private _searchKeyword: FormControl = new FormControl();

  private _dropdownVisible = false;

  private _loading = false;

  private _currentFocus = -1;

  private _suggestionsSource: Array<any> = [];

  private _itemSelected: any = '';

  private _isSearching = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();
  private _width = '100%';

  constructor(private _autoCompleteService: AutocompleteService) {
  }

  ngOnInit() {
    this._searchKeyword.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this._ngUnsubscribe))
      .subscribe((input: any) => {
        if (input) {
          this._inputNewValue = input;
          this._isSearching = true;
          if (this._requestType === 'remote') {
            this._loadResult(input);
          } else {
            this._loadListResults(input);
          }
        } else {
          this.hideAutoSuggestionDropdown();
        }
      });
  }

  setDefaultValue() {
    if (this._default !== '') {
      this._searchKeyword.setValue(this._default);
    } else {
      this._searchKeyword.setValue('');
    }
  }

  _loadListResults(value: string) {
    if (value) {
      this._suggestionsSource = [];
      this._dropdownVisible = true;
      this._loading = true;
      if (value.length >= this._minChars) {
        this._getSuggestionsList(value);
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

  private _getSuggestionsList(keyword: string) {
    if (this._isShowAddButton) {
      this._width = '80%';
    }
    this._suggestionsSource = this._suggestionDefaultList.filter(item => item.toString().toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(item.toString().toLowerCase()));
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
    if (this._requestType === 'remote') {
      this._loadResult(value);
    } else if (this._showSuggestionFirst) {
      this._dropdownVisible = true;
      this._isSearching = true;
      this._suggestionsSource = this._suggestionDefaultList;
    }
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
    if (this._requestType === 'remote') {
      this._emitValue(value);
      this._searchKeyword.reset();
    } else {
      this._emitValue({
        type: this._type,
        value: value
      });
      this._searchKeyword.setValue('');
      if (!this.isShowAddButton) {
        this._searchKeyword.setValue(value);
      }
      this._inputNewValue = '';
      this._width = '100%';
      this._itemSelected = value;
    }
    this.hideAutoSuggestionDropdown();
  }

  /**
   * add new value => reset state
   */
  addNewValue() {
    if (this.inputNewValue) {
      this._itemSelected = this.inputNewValue;
      this.valueAdded.emit({
        type: this.type,
        value: this.searchKeyword.value
      });
      this._searchKeyword.setValue('');
      this._inputNewValue = '';
      this._width = '100%';
      this.hideAutoSuggestionDropdown();
    }
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

  get default(): string {
    return this._default;
  }

  get width(): any {
    return this._width;
  }

  get inputNewValue(): string {
    return this._inputNewValue;
  }

  get requestType(): string {
    return this._requestType;
  }

  get isShowAddButton(): boolean {
    return this._isShowAddButton;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
