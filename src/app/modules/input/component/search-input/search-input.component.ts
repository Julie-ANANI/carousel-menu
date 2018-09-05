import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/Rx';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})

export class SearchInputComponent implements OnInit {

  @Output() searchInputEmit = new EventEmitter<any>(); // general output event emitter

  @Output() discoverValueEmit = new EventEmitter<any>(); // output event emitter of discover page

  @Input() suggestions: any; // general suggestion

  private _searchField: FormControl; /* declare the FormControl as properties of our components. */

  displaySuggestion = true;

  private _crossIcon = false;

  private _searchActive = false;

  ngOnInit() {
    this._searchField = new FormControl(); // create the form control

    this._searchField.valueChanges.distinctUntilChanged().subscribe(input => {
      this._crossIcon = input !== '';
      this.displaySuggestion = true;
      this.searchInputEmit.emit({value: input} );
      });

  }

  onValueSelect(value: any) {
    this._searchField.setValue(value.text);
    this.discoverValueEmit.emit({value});
    this.displaySuggestion = false;
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

  get searchField(): FormControl {
    return this._searchField;
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
