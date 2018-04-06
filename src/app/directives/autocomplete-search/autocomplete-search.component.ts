import { Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/Rx';

@Component({
  selector: 'app-autocomplete-search',
  templateUrl: 'autocomplete-search.component.html',
  styleUrls: ['./autocomplete-search.scss']
})

export class AutocompleteSearchComponent implements OnInit {

  private _searchInputField: FormControl; /* declare the FormControl as properties of our component. */

  ngOnInit() {

    this._searchInputField = new FormControl(); // create the form control

    this._searchInputField.valueChanges
      .debounceTime(500) //
      .distinctUntilChanged()
      .subscribe(input => {
         // this.userInput = input;
        // pass this input to the service
      });
  }

  get searchInputField(): FormControl {
    return this._searchInputField;
  }

  set searchInputField(value: FormControl) {
    this._searchInputField = value;
  }

}
