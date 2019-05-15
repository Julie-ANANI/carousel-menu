import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-input-2',
  templateUrl: './search-input-2.component.html',
  styleUrls: ['./search-input-2.component.scss']
})

export class SearchInput2Component implements OnInit, OnDestroy {

  @Input() set searchPlaceholder(value: string) {
    this._placeholder = value;
  }

  @Output() searchFieldOutput = new EventEmitter<string>();

  private _placeholder = 'COMMON.SEARCH_INPUT_PLACEHOLDER';

  private _searchField: FormControl;

  private _searchActive: boolean = false;

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor() {
    this._searchField = new FormControl();
  }

  ngOnInit() {
    this._searchField.valueChanges.pipe(distinctUntilChanged(), debounceTime(200)).subscribe(input => {
      this._searchActive = input !== '';
      this._outputData();
    });
  }


  public onClickClose(event: Event) {
    event.preventDefault();
    this._searchField.setValue('');
  }


  private _outputData() {
    this.searchFieldOutput.emit(this._searchField.value);
  }


  get placeholder(): string {
    return this._placeholder;
  }

  get searchField(): FormControl {
    return this._searchField;
  }

  get searchActive(): boolean {
    return this._searchActive;
  }

  get ngUnsubscribe(): Subject<any> {
    return this._ngUnsubscribe;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
