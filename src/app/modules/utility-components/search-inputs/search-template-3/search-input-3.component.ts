import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-input-3',
  templateUrl: './search-input-3.component.html',
  styleUrls: ['./search-input-3.component.scss']
})

export class SearchInput3Component implements OnInit, OnDestroy {

  @Input() set placeholder(value: string) {
    this._placeholder = value;
  }

  @Input() set searchFieldValue(value: string) {
    this._searchFieldValue = value;
    this._setFieldValue();
  }

  @Output() searchFieldOutput = new EventEmitter<string>();

  private _placeholder = 'COMMON.SEARCH_INPUT_PLACEHOLDER';

  private _searchField: FormControl;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _searchFieldValue: string;

  constructor() {
    this._searchField = new FormControl();
  }

  ngOnInit() {
    this._searchField.valueChanges.pipe(distinctUntilChanged(), debounceTime(200)).subscribe(() => {
      this.outputData();
    });
  }


  public outputData() {
    this.searchFieldOutput.emit(this._searchField.value);
  }


  private _setFieldValue() {
    this._searchField.setValue(this._searchFieldValue);
  }


  get placeholder(): string {
    return this._placeholder;
  }

  get searchField(): FormControl {
    return this._searchField;
  }

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  get searchFieldValue(): string {
    return this._searchFieldValue;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
