import { Component, Inject, Input, PLATFORM_ID, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-utility-carousel-menu',
  exportAs: 'app-utility-carousel-menu',
  templateUrl: './menu-carousel.html',
  styleUrls: ['./menu-carousel.scss']
})

export class MenuCarouselComponent implements OnInit {
  //Size
  @Input() minWidthItem = '6em'
  //margin
  @Input() btnRight = '5em';

  @Output() menuItemClicked: EventEmitter<any> = new EventEmitter();

  /**
   * get configuration for the menu
   * @param value
   * quantity
   */
  @Input() set config(value: any) {
    if (value) {
      //quantity it's for to choose the number of items you want between the next and prev buttons
      this._quantity = value.quantity || 10;
      this._sources = value.sources || [];
      this._identifier = value.identifier || '';
      this.setUpMenu();
    }
  }

  //Config Template
  private _quantity: number = 0;
  private _identifier: string = '';
  private _type: string = '';
  private _sources: Array<any> = [];
  private _displayedItems: Array<any> = [];
  private _itemSelected: any;
  private _currentPagination = 1;
  private _maxPagination = 0;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object) {}

  ngOnInit() {}

  setUpMenu() {
    this._displayedItems = this._sources.slice(0, this._quantity);
    if (this._sources && this._sources.length > 0) {
      this._maxPagination = Math.ceil(this._sources.length / this._quantity);
    }
  }

  clickOnMenu(event: Event, item: any) {
    event.preventDefault();
    this._itemSelected = item;
    this.menuItemClicked.emit(item);
  }

  next() {
    // there is next items
    if (this._currentPagination < this._maxPagination) {
      // then go to next
      const from = this._currentPagination * this._quantity;
      const to = from + this._quantity;
      this._displayedItems = this._sources.slice(from, to);
      this._currentPagination += 1;
    }
  }

  prev() {
    if (this._currentPagination > 1 && this._currentPagination <= this._maxPagination) {
      // then go to previous
      this._currentPagination -= 1;
      const from = (this._currentPagination - 1) * this._quantity;
      const to = from + this._quantity;
      this._displayedItems = this._sources.slice(from, to);
    }
  }

  get quantity(): number {
    return this._quantity;
  }

  get identifier(): string {
    return this._identifier;
  }

  get sources(): Array<any> {
    return this._sources;
  }

  get displayedItems(): Array<any> {
    return this._displayedItems;
  }

  get type(): string {
    return this._type;
  }

  get itemSelected(): string {
    return this._itemSelected;
  }

  get currentPagination(): number {
    return this._currentPagination;
  }

  get maxPagination(): number {
    return this._maxPagination;
  }

}
