import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-search-input-2',
  templateUrl: './search-input-2.component.html',
  styleUrls: ['./search-input-2.component.scss']
})

export class SearchInput2Component implements OnInit {

  @Input() set searchPlaceholder(value: string) {
    this._placeholder = value;
  }

  @Output() searchFieldOutput = new EventEmitter<string>();

  private _placeholder = 'COMMON.SEARCH_INPUT_2_PLACEHOLDER';

  searchField: FormControl;

  searchActive: boolean = false;


  constructor() {

    this.searchField = new FormControl();

  }

  ngOnInit() {
  }

  get placeholder(): string {
    return this._placeholder;
  }

}
