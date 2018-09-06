import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/Rx';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})

export class SearchInputComponent implements OnInit {

  @Output() finalValueEmit = new EventEmitter<any>(); // this is the final value that we send to the parent.

  @Input() suggestions: any; // values that we get from the parent component.

  private _searchField: FormControl; // declare the FormControl as properties of our components.

  private _displaySuggestion = true;

  private _crossIcon = false;

  private _searchActive = false;

  private _currentFocus = -1;

  private _localSuggestions: any = [];

  ngOnInit() {
    this._searchField = new FormControl(); // create the form control.

    this._searchField.valueChanges.subscribe(input => {
      this._crossIcon = input !== '';
      this._displaySuggestion = true;
      this.searchLocally(input);
      });
  }


  private searchLocally(value: string) {
    this._localSuggestions = [];

    if (value !== '') {
      this._localSuggestions = this.suggestions.filter((item: any) => {
        return item.text.match(value);
      });
    }

  }

  onValueSelect(value: any) {
    this._searchField.setValue(value.text);
    this.finalValueEmit.emit(value);
    this._displaySuggestion = false;
    this._crossIcon = true;
  }

  clearInput() {
    this._searchField.reset();
    this._crossIcon = false;
    this.finalValueEmit.emit('');
  }

  closeSearch() {
    this._searchField.reset();
    this._crossIcon = false;
    this.finalValueEmit.emit('');
    this.searchActive = !this.searchActive;
  }

  onKeyboardPress(event: Event) {
    this._displaySuggestion = true;

    if (event['key'] === 40 || event['code'] === 'ArrowDown') {
      this._currentFocus++;
      this.setFocus(this._currentFocus);
    } else if (event['key'] === 38 || event['code'] === 'ArrowUp') {
      this._currentFocus--;
      this.setFocus(this._currentFocus);
    } else if (event['key'] === 13 || event['code'] === 'Enter') {
      event.preventDefault();

      if (this._currentFocus > -1) {
        this._searchField.setValue(this._localSuggestions[this._currentFocus].text);
        this._currentFocus = -1;
      }

      this.finalValueEmit.emit(this._searchField.value);
      this._displaySuggestion = false;
    }

  }

  private setFocus(value: number) {
    if (value >= this._localSuggestions.length) {
      this._currentFocus = 0;
    }

    if (value < 0) {
      this._currentFocus = this._localSuggestions.length - 1;
    }

  }

  get searchField(): FormControl {
    return this._searchField;
  }

  get displaySuggestion(): boolean {
    return this._displaySuggestion;
  }

  get crossIcon(): boolean {
    return this._crossIcon;
  }

  get searchActive(): boolean {
    return this._searchActive;
  }

  set searchActive(value: boolean) {
    this._searchActive = value;
  }

  get currentFocus(): number {
    return this._currentFocus;
  }

  get localSuggestions(): any {
    return this._localSuggestions;
  }

}
