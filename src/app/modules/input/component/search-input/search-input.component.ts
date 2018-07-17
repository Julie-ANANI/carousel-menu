import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  searchField: FormControl; /* declare the FormControl as properties of our components. */
  displaySuggestion = true;
  searchIcon = true;
  crossIcon = false;

  ngOnInit() {

    this.searchField = new FormControl(); // create the form control

    this.searchField.valueChanges.distinctUntilChanged()
      .subscribe(input => {
        this.crossIcon = false;
        this.searchIcon = true;
        this.displaySuggestion = true;
        this.searchInputEmit.emit({value: input} );
      });

  }

  onValueSelect(value: any) {
    this.searchField.setValue(value.text);
    this.discoverValueEmit.emit({value});
    this.displaySuggestion = false;
    this.searchIcon = false;
    this.crossIcon = true;
  }

  clearInput() {
    this.searchField.reset();
    this.searchInputEmit.emit({value: ''});
  }

}
