import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Config} from '../../../../models/config';
import {Column, types} from '../../models/column';
import {picto} from '../../../../models/static-data/picto';

@Component({
  selector: 'app-table-search-filter',
  templateUrl: './table-search-filter.component.html',
  styleUrls: ['./table-search-filter.component.scss']
})
export class TableSearchFilterComponent implements OnInit {

  @Input() searchConfig: Config = <Config>{};

  @Input() set properties(value: Array<Column>) {
    this._initProperties(value);
  }

  @Output() searchConfigChange: EventEmitter<Config> = new EventEmitter<Config>();

  /***
   * will contain the columns of
   * type = 'TEXT' | 'COUNTRY'
   */
  textProperties: Array<Column> = [];

  /***
   * will contain the columns of
   * type = 'CHECK' | 'MULTI_CHOICES'
   */
  otherProperties: Array<Column> = [];

  currentTextProperty: Column = {_attrs: [''], _name: '', _type: 'TEXT'};

  searchString = '';

  searchPicto = picto.search.meta;

  constructor() { }

  ngOnInit() {
  }

  private _initProperties(value: Array<Column> = []) {
    if (value.length) {
      this.textProperties = value.filter((column) =>
        (this.type(column) === 'TEXT' || this.type(column) === 'COUNTRY') && this.isSearchable(column)
      );

      if (this.currentTextProperty._attrs[0] === '' && this.textProperties.length > 0) {
        this.currentTextProperty = this.textProperties[0];
      }

      this.otherProperties = value.filter(column =>
        (this.type(column) === 'CHECK' || this.type(column) === 'MULTI-CHOICES') && this.isSearchable(column)
      );
    }
  }

  public isSearchable(column: Column): boolean {
    return column._isSearchable === undefined ? true : column._isSearchable;
  }

  public isTextSelected(column: Column): boolean {
    return this.currentTextProperty._attrs[0] === column._attrs[0];
  }

  public onChangeTextProp(event: Event) {
    this.currentTextProperty = this.textProperties.find(column =>
      column._attrs[0] === (event.target as HTMLSelectElement).value
    );
    if (this.searchString) {
      this.onSearchText();
    }
  }

  public onSearchText() {

  }

  public type(column: Column): types {
    return column._type;
  }

  public name(column: Column) {
    return column._name;
  }

  public attrs(column: Column) {
    return column._attrs[0];
  }

}
