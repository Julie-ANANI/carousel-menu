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

  //config button controls
  @Input() showControls = true;

  //Size
  @Input() minDelimitersOfItems = 7;
  @Input() menuHeight = '30px'
  @Input() itemWidth = '146px'
  @Input() maxWidthItem = '6em'

  //color
  @Input() backgroundColor = '0';
  @Input() btnViewColor = '#4F5D6B';
  @Input() textColor = '#00B0FF';

  //position
  @Input() positionBtnKebabBottom = '0.5em';
  @Input() positionBtnKebabRight = '1em';
  @Input() positionBtnMore = '9px';
  @Input() positionBtnMoreBottom = '0.5em';
  @Input() positionBtnMoreLeft = '16em';
  @Input() positionBtnLess = '1em';

  @Input() positionBtnNextBottom = '16px';


  //@Output() menuItemClicked: any;
  @Output() menuItemClicked: EventEmitter<any> = new EventEmitter();

  private _itemSelected: string = '';
  //calculate width max
        //display max item
  // - item for button view more

  // - affiche le max d'item possible dans le premier état (view more) ' +
  // - le reste en surplus est affiché après le click view more


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
      this._type = value.type || '';
      this._displayedItems = this._sources.slice(this._initIndex, this._quatity);
    }
  }

  //size
  private _initItemSize = true;

  //item
  private _currentItem: any;

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

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object) {}

  ngOnInit() {}

  clickOnMenu(event: Event, item: string) {
    event.preventDefault();
    this._currentItem = item;
    this.menuItemClicked.emit(item);
  }


  next() {
    //let maxValInitNext = this._quatity % this.displayedItems.length;
    let maxValInitNext = this._initIndex - 1;
    let maxValQuantityOnePart = (this.displayedItems.length % this._quatity);
    let maxValQuantityNext = ((maxValQuantityOnePart + maxValInitNext) + 1);

      //when max view value for btn next with max value && max init valu
      if(this.displayedItems.length > 0){

        if(this.displayedItems.length > 0 && this._quatity === maxValQuantityNext && this._initIndex === maxValQuantityNext){
          console.log('tu assign max value');
          //assign max value
          this._quatity = maxValQuantityNext;
          this._initIndex = maxValInitNext;
          this._displayedItems = this._sources.slice(this._initIndex, this._quatity);
          return this.displayedItems;
          //when we can increment initIndex && quantity
        } else {
          console.log('TU INCREMENTE');
          this._quatity ++
          this._initIndex ++
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


  //old logic
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

  get initItemSize(): boolean {
    return this._initItemSize;
  }

  get currentItem(): any {
    return this._currentItem;
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


