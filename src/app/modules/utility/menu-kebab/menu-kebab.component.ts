import {Component, Inject, Input, PLATFORM_ID, OnInit, EventEmitter, Output,} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-utility-carousel-menu',
  exportAs:'app-utility-carousel-menu',
 templateUrl: './menu-kebab.html',
  styleUrls: ['./menu-kebab.scss']
})

export class MenuKebabComponent implements OnInit {
  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }
  get itemSelected(): string {
    return this._itemSelected;
  }
  get initIndex(): number {
    return this._initIndex;
  }

  //moins input

  //config button controls
  @Input() showControls = true;

  //Size
  @Input() minDelimitersOfItems = 7;
  @Input() menuHeight = '30px'
  @Input() itemWidth = '146px'
  @Input() maxWidthItem = '6em'

  //color
  @Input() backgroundColor = '#e1e7ea';
  @Input() btnViewColor = '#4F5D6B';
  @Input() textColor = '#00B0FF';

  //position
  @Input() positionBtnKebabBottom = '0.5em';
  @Input() positionBtnKebabRight = '1em';
  @Input() positionBtnMore = '9px';
  @Input() positionBtnMoreBottom = '0.5em';
  @Input() positionBtnMoreLeft = '16em';
  @Input() positionBtnMoreTop = '-1 em';
  @Input() positionBtnLess = '1em';

  @Input() positionBtnNextBottom = '16px';


  //@Output() menuItemClicked: any;
  @Output() menuItemClicked: EventEmitter<any> = new EventEmitter();

  /**
   * here, you get configuration for the menu
   * @param value
   *
   */
  @Input() set config(value: any) {
    if (value) {
      this._quatity = value.quatity || 0;
      this._initIndex = value.initIndex || 0;
      this._sources = value.sources || [];
      this._identifier = value.identifier || '';
     // this._type = value.type || '';
      this._displayedItems = this._sources.slice(this._initIndex, this._quatity);
    }
  }


  private _initIndex: number = 0;

  //Config Template
  private _isDisplayItems = false;
  private _displaySuiteKebabItems = true;
  private _ngUnsubscribe: Subject<any> = new Subject<any>();
  private _quatity: number = 0;
  private _identifier: string = '';
  private _type: string = '';
  private _sources: Array<any> = [];
  private _displayedItems: Array<any> = [];
  private _itemSelected: string = '';
  private _currentItem: any;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object) {}

  ngOnInit() {}

  clickOnMenu(event: Event, item: string) {
    event.preventDefault();
    this._currentItem = item;
    this.menuItemClicked.emit(item);
  }


  next() {
    let maxValInitNext = this.sources.length;
    let viewToView = (this._quatity - 1);
    let maxValQuantityNext = this.sources.length;

      //when max view value for btn next with max value && max init valu
      if(this.displayedItems.length > 0){
        if(this._quatity === maxValQuantityNext && this._initIndex === maxValQuantityNext){
          //assign max value
          this._quatity = maxValQuantityNext;
          this._initIndex = maxValInitNext;
          this._displayedItems = this._sources.slice(this._initIndex, this._quatity);
          return this.displayedItems;
          //when we can increment initIndex && quantity
        } else {
          this._quatity = (this._quatity + this._quatity)
          this._initIndex = viewToView;
          this._displayedItems = this._sources.slice(this._initIndex, this._quatity);
          return this.displayedItems;
        }
      //If dont have length && [].length === 0
    } else {
      return this.displayedItems;
    }

   }

  prev() {
    let initIndexPrev = this._initIndex

    if(this._displayedItems && this._displayedItems.length){
      this._quatity = this._quatity - 1
      this._initIndex = initIndexPrev - 1;
      this._displayedItems = this._sources.slice(this._initIndex, this._quatity);
      return initIndexPrev - 1 && this._displayedItems
    } else {
      return this.displayedItems;
    }

  }

  get displaySuiteKebabItems(): boolean {
    return this._displaySuiteKebabItems;
  }

  set displaySuiteKebabItems(value: boolean) {
    this._displaySuiteKebabItems = value;
  }

  get isDisplayItems(): boolean {
    return this._isDisplayItems;
  }

  set isDisplayItems(value: boolean) {
    this._isDisplayItems = value;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  get quatity(): number {
    return this._quatity;
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
}


