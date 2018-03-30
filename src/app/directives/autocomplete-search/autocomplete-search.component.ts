import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-autocomplete-search',
  templateUrl: 'autocomplete-search.component.html',
  styleUrls: ['./autocomplete-search.scss']
})

export class AutocompleteSearchComponent implements OnInit {
  /*
   * Component configuration
  */
  private _placeholder = '';

  ngOnInit() {
    this._placeholder = 'hello';
  }

}
