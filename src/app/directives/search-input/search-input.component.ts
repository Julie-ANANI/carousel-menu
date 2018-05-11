import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/Rx';

@Component({
  selector: 'app-search-input',
  templateUrl: 'search-input.component.html',
  styleUrls: ['./search-input.scss']
})

export class SearchInputComponent implements OnInit {

  searchField: FormControl; /* declare the FormControl as properties of our components. */
  @Output() searchInputEmit = new EventEmitter<any>(); // general output event emitter
  @Input() suggestions: any; // general suggestion
  displaySuggestion = true;
  searchIcon = true;
  crossIcon = false;

  @Output() discoverValueEmit = new EventEmitter<any>(); // output event emitter of discover page


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
