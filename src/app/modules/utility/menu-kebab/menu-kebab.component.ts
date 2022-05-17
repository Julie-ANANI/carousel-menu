import {
  Component, Inject, Input, PLATFORM_ID, OnInit, EventEmitter, Output,
} from '@angular/core';


@Component({
  selector: 'app-utility-carousel-menu',
  templateUrl: './menu-kebab.html',
  styleUrls: ['./menu-kebab.scss'],
})


export class MenuKebabComponent implements OnInit {

  // false: displayItem[0] compare to sources[0]
  showPrev = true;

  // false: displayItem[last] compare to sources[last]
  showNext = true;

  // TODO all

  @Input() showControls = true;
  @Input() timing = '250ms ease-in';

  //Size
  @Input() kebabCarouselWidth = {};
  @Input() minDelimitersOfItems = 5;

  //color
  @Input() color = '#EFEFEF';
  @Input() btnViewColor = '#4F5D6B';
  @Input() textColor = '#00B0FF';

  private _initItemSize = true;

  //item
  private _currentItem: any;

  /**
   * here, you get configuration for the menu
   * @param value
   * quatity = 5
   */
  @Input() set config(value: any) {
    if (value) {
        this._quatity = value.quatity || 0;
        this._sources = value.sources || [];
        this._identifier = value.identifier || '';
        // TODO check sources
      //initialise _displayedItems
        this._displayedItems = this._sources.slice(0, this._quatity);
    }
  }

  //Config Template
  private _isDisplayItems = false;
  private _displaySuiteKebabItems = true;

  private _quatity: number = 0;

  private _identifier: string = '';

  private _sources: Array<any> = [];

  private _displayedItems: Array<any> = [];

  @Output() menuItemClicked: EventEmitter<any> = new EventEmitter();


  constructor(@Inject(PLATFORM_ID) protected _platformId: Object) {
  }

  ngOnInit() {

  }


  /**
   * TODO: to change
   */
  next() {
    // if (this.currentItem + 1 === this.items.length) return;
    // this.currentItem = (this.currentItem + 1) % this.items.length;
    // //const offset = this.currentItem * this.itemWidth;
    // const myAnimation: AnimationFactory = this.buildAnimation();
    // this.player = myAnimation.create(this.carousel.nativeElement);
    // this.player.play();
  }

  /**
   * TODO: to change
   */
  prev() {
    console.log('previous button');
    // get first item in displayedItems
    // go through sources
    // find first item in sources, and get the index.
    // if index > 5 => change completely the displayedItems
    // if index < 5 => take what's in former sources + what's left in displayedItems
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

  get initItemSize(): boolean {
    return this._initItemSize;
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


  get currentItem(): any {
    return this._currentItem;
  }

  clickOnMenu(event: Event, item: any) {
    event.preventDefault();
    this._currentItem = item;
    this.menuItemClicked.emit(item);
  }
}


