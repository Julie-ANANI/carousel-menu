import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AutoSuggestionConfig} from './interface/auto-suggestion-config';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {AutocompleteService} from '../../../services/autocomplete/autocomplete.service';
import {HttpErrorResponse} from '@angular/common/http';
import {EnterpriseSizeList, EnterpriseTypes, EnterpriseValueChains, IndustriesList} from '../../../models/static-data/enterprise';

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
      console.log(this._default);
      this.setDefaultValue();
    }
  }

  @Input() isSmallInput = false;

  @Output() valueSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output() valueAdded = new EventEmitter();

  private _minChars = 3;

  private _inputNewValue = '';

  private _default = '';

  private _placeholder = 'COMMON.PLACEHOLDER.AUTO_SUGGESTION';

  private _identifier = 'name';

  private _type = 'users';

  private _searchKeyword: FormControl = new FormControl();

  private _dropdownVisible = false;

  private _loading = false;

  private _currentFocus = -1;

  private _suggestionsSource: Array<any> = [];

  private _industriesList: Array<any> = IndustriesList;

  private _valueChainList: Array<any> = EnterpriseValueChains;

  private _enterpriseSizeList: Array<any> = EnterpriseSizeList;

  private _enterpriseTypeList: Array<any> = EnterpriseTypes;

  private _itemSelected: any = '';

  private _isSearching = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();
  private _width = '100%';

  constructor(private _autoCompleteService: AutocompleteService) {
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


  get enterpriseTypeList(): Array<any> {
    return this._enterpriseSizeList;
  }

  set inputNewValue(value: string) {
    this._inputNewValue = value;
  }

  ngOnInit() {
    this._searchKeyword.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this._ngUnsubscribe))
      .subscribe((input: any) => {
        if (input) {
          this._inputNewValue = input;
          this._isSearching = true;
          if (this.type === 'industry' || this._type === 'valueChain'
            || this._type === 'enterpriseSize' || this._type === 'enterpriseType') {
            this._loadListResults(input);
          } else {
            this._loadResult(input);
          }
        } else {
          this.hideAutoSuggestionDropdown();
        }
      });
  }

  setDefaultValue() {
    if (this._default !== '') {
      switch (this._type) {
        case 'enterpriseSize':
          console.log(this._default,
            this._enterpriseSizeList,
            this._enterpriseSizeList.find(item => item.value === this._default)[0]);
          this._searchKeyword.setValue(this._enterpriseSizeList.find(item => item.value === this._default)[0].label);
          break;
        case 'enterpriseType':
          this._searchKeyword.setValue(this._default);
          break;
        default:
          break;
      }

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
    switch (this.type) {
      case 'industry':
        this._width = '80%';
        this._getIndustries(keyword);
        break;
      case 'valueChain':
        this._width = '80%';
        this._getValueChains(keyword);
        break;
      case 'enterpriseSize':
        this._getEnterpriseSize();
        break;
      case 'enterpriseType':
        this._width = '80%';
        this._getEnterpriseType(keyword);
        break;
    }
    this._loading = false;
    this._isSearching = this._suggestionsSource.length !== 0;
  }

  private _getIndustries(industryKeyword: any) {
    this._suggestionsSource =
      this._industriesList.filter(item => item.toLowerCase().includes(industryKeyword.toLowerCase()) ||
        industryKeyword.toLowerCase().includes(item.toLowerCase()));
  }

  private _getValueChains(keyword: any) {
    this._suggestionsSource =
      this._valueChainList.filter(item => item.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(item.toLowerCase()));
  }

  private _getEnterpriseSize() {
    const valueFound = this._enterpriseSizeList.find(item => item.label === this._searchKeyword.value);
    if (valueFound === undefined) {
      this._suggestionsSource = this._enterpriseSizeList;
    } else {
      this._suggestionsSource = [];
    }
  }

  private _getEnterpriseType(keyword: string) {
    this._suggestionsSource =
      this._enterpriseTypeList.filter(item => item.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(item.toLowerCase()));
    if (this._suggestionsSource.length === 0) {
      this._loading = false;
      this._isSearching = false;
    }
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
    switch (this._type) {
      case 'enterpriseSize':
        this._dropdownVisible = true;
        this._isSearching = true;
        this._getEnterpriseSize();
        break;
      case 'enterpriseType':
        if (this._itemSelected === '') {
          this._dropdownVisible = true;
          this._isSearching = true;
          this._suggestionsSource = this._enterpriseTypeList;
        }
        break;
      default:
        this._loadResult(value);
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
    switch (this._type) {
      case 'valueChain':
      case 'industry':
        const valueToSend = {
          type: this._type,
          value: value
        };
        this._emitValue(valueToSend);
        this._searchKeyword.setValue('');
        this._inputNewValue = '';
        this._width = '100%';
        break;
      case 'enterpriseSize':
        const valueSize = {
          type: this._type,
          value: value.value
        };
        this._emitValue(valueSize);
        this._searchKeyword.setValue(value.label);
        break;
      case 'enterpriseType':
        const valueType = {
          type: this._type,
          value: value
        };
        this._itemSelected = value;
        this._emitValue(valueType);
        this._searchKeyword.setValue('');
        this._inputNewValue = '';
        this._width = '100%';
        break;
      default:
        this._itemSelected = value;
        this._searchKeyword.setValue(value[this._identifier]);
        this._emitValue(value);
    }
    this.hideAutoSuggestionDropdown();
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

  addNewValue() {
    if (this.inputNewValue) {
      const valueToSend = {
        type: this.type,
        value: this.searchKeyword.value
      };
      this._itemSelected = this.inputNewValue;
      this._searchKeyword.setValue('');
      this.valueAdded.emit(valueToSend);
      this._inputNewValue = '';
      this._width = '100%';
      this.hideAutoSuggestionDropdown();
    }
  }
}
