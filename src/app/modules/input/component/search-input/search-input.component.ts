import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/Rx';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})

export class SearchInputComponent implements OnInit {

  @Output() searchInputEmit = new EventEmitter<any>(); // we are emitting only the text value as the user start typing.

  @Output() finalValueEmit = new EventEmitter<any>(); // this is the final value that we send to the parent.

  @Input() suggestions: any; // values that we get from the parent component.

  private _searchField: FormControl; // declare the FormControl as properties of our components.
  private _displaySuggestion = true;
  private _crossIcon = false;
  private _searchActive = false;
  currentFocus = -1;

  ngOnInit() {
    this._searchField = new FormControl(); // create the form control.

    this._searchField.valueChanges.distinctUntilChanged().subscribe(input => {
      this._crossIcon = input !== '';
      this._displaySuggestion = true;
      this.searchInputEmit.emit({value: input} );
      });
  }

  onValueSelect(value: any) {
    this._searchField.setValue(value.text);
    this.finalValueEmit.emit({value});
    this._displaySuggestion = false;
    this._crossIcon = true;
  }

  clearInput() {
    this._searchField.reset();
    this.searchInputEmit.emit({value: ''});
    this._crossIcon = false;
  }

  closeSearch() {
    this._searchField.reset();
    this._crossIcon = false;
    this.searchActive = !this.searchActive;
  }

  onKeyboardPress(event: Event) {
    this._displaySuggestion = true;

    if (event['key'] === 40 || event['code'] === 'ArrowDown') {
      this.currentFocus++;
      this.setFocus(this.currentFocus);
    } else if (event['key'] === 38 || event['code'] === 'ArrowUp') {
      this.currentFocus--;
      this.setFocus(this.currentFocus);
    } else if (event['key'] === 13 || event['code'] === 'Enter') {
      event.preventDefault();

      if (this.currentFocus > -1) {
        this._searchField.setValue(this.suggestions[this.currentFocus].text);
        this.currentFocus = -1;
      }

      this.finalValueEmit.emit(this._searchField.value);
      this._displaySuggestion = false;
    }

  }

  setFocus(value: number) {
    if (value >= this.suggestions.length) {
      this.currentFocus = 0;
    }

    if (value < 0) {
      this.currentFocus = this.suggestions.length - 1;
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

}
