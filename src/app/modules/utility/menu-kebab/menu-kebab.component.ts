import { Component, Inject, Input, PLATFORM_ID, OnInit, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-utility-carousel-menu',
  exportAs: 'app-utility-carousel-menu',
  templateUrl: './menu-kebab.html',
  styleUrls: ['./menu-kebab.scss']
})

export class MenuKebabComponent implements OnInit {

  //config button controls
  @Input() showControls = true;

  //Size
  @Input() menuHeight = '30px'
  @Input() minWidthItem = '6em'

  //color
  @Input() backgroundColor = '#e1e7ea';
  @Input() clickColor = '#00B0FF';
  @Input() textColor = '#4F5D6B ';
  @Input() btnRight = '39px';

  @Output() menuItemClicked: EventEmitter<any> = new EventEmitter();

  /**
   * get configuration for the menu
   * @param value
   * quantity
   */
  @Input() set config(value: any) {
    if (value) {
      this._quantity = value.quantity || 5; // if no quantity, I will take 5 => means display 5 by 5
      this._initQuantity = value.initQuantity || 0;
      this._initIndex = value.initIndex || 0;
      this._sources = value.sources || [];
      this._identifier = value.identifier || '';
      this.setUpMenu();
    }
  }

  //Config Template
  private _displaySuiteItems = true;
  private _ngUnsubscribe: Subject<any> = new Subject<any>();
  private _quantity: number = 0;
  private _identifier: string = '';
  private _type: string = '';
  private _sources: Array<any> = [];
  private _displayedItems: Array<any> = [];
  private _itemSelected: any;
  private _initQuantity: number;
  private _initIndex: number = 0;

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

  clickOnMenu(event: Event, itemClicked: any) {
    event.preventDefault();
    this._itemSelected = itemClicked;
    this.menuItemClicked.emit(itemClicked);
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

  /**
   next() {
    let viewToView = (this._quantity);
    let maxValQuantityNext = this.sources.length;

    //when max view value for btn next with max value && max init valu
    if (this.displayedItems.length > 0) {
      if (((maxValQuantityNext - this._quantity) < this._quantity)) {
        //assign max value
        this._quantity = maxValQuantityNext;
        this._initIndex = (this._initIndex + this._initIndex);
        this._displayedItems = this._sources.slice(this._initIndex, this._quantity);
        return this.displayedItems;
        //when we can increment initIndex && quantity
      } else {
        this._quantity = (this._quantity + this._quantity)
        this._initIndex = viewToView;
        this._displayedItems = this._sources.slice(this._initIndex, this._quantity);
        return this.displayedItems;
      }
      //If dont have length && [].length === 0
    } else {
      return this.displayedItems;
    }

  }
   */

  prev() {
    if (this._currentPagination > 1 && this._currentPagination <= this._maxPagination) {
      // then go to previous
      this._currentPagination -= 1;
      const from = (this._currentPagination - 1) * this._quantity;
      const to = from + this._quantity;
      this._displayedItems = this._sources.slice(from, to);
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  get displaySuiteItems(): boolean {
    return this._displaySuiteItems;
  }

  set displaySuiteItems(value: boolean) {
    this._displaySuiteItems = value;
  }

  get quatity(): number {
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

  get initIndex(): number {
    return this._initIndex;
  }

  get initQuantity(): number {
    return this._initQuantity;
  }

  get currentPagination(): number {
    return this._currentPagination;
  }

  get maxPagination(): number {
    return this._maxPagination;
  }

}
