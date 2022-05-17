import {Component, Inject, Input, PLATFORM_ID, ElementRef,
ViewChild, OnInit, TemplateRef, EventEmitter
} from '@angular/core';
import { AnimationFactory, AnimationPlayer, AnimationBuilder, animate, style } from '@angular/animations';

// export class CarouselItemElement {
// }

@Component({
  selector: 'carousel',
  exportAs: 'carousel',
  templateUrl: './menu-kebab.html',
  styleUrls: ['./menu-kebab.scss'],
})


export class MenuKebabComponent implements OnInit {

  // TODO all
 // @ContentChildren(MenuKebabDirective) items: QueryList<MenuKebabDirective>;
  //@ViewChildren(CarouselItemElement, {read: ElementRef}) private _itemsElements: QueryList<ElementRef>;
  @ViewChild('carousel') private carousel: ElementRef;

  items: Array<any> =[];

  // false: displayItem[0] compare to sources[0]
  showPrev = true;

  // false: displayItem[last] compare to sources[last]
  showNext = true;

  // TODO all

  /**
   * TODO: to change
   */
  next() {
    if (this.currentItem + 1 === this.items.length) return;
    this.currentItem = (this.currentItem + 1) % this.items.length;
    //const offset = this.currentItem * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation();
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  // TODO remove
  private buildAnimation() {
    return this.builder.build([
      animate(this.timing, style({transform: `translateX(-150px)`}))
    ]);
  }

  /**
   * TODO: to change
   */
  prev() {
    // get first item in displayedItems
    // go through sources
    // find first item in sources, and get the index.
    // if index > 5 => change completely the displayedItems
    // if index < 5 => take what's in former sources + what's left in displayedItems
    //
    // if (this.currentItem === 0) return;
    //
    // this.currentItem = ((this.currentItem - 1) + this.items.length) % this.items.length;
    // //const offset = this.currentItem * this.itemWidth;
    //
    // const myAnimation: AnimationFactory = this.buildAnimation();
    // this.player = myAnimation.create(this.carousel.nativeElement);
    // this.player.play();
  }


  // ngAfterViewInit() {
  //
  //   setTimeout(() => {
  //     this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
  //     this.carouselWrapperStyle = {
  //       width: `${this.itemWidth}px`
  //     }
  //   });
  //   throw new Error("Method not implemented.");
  // }

  @Input() showControls = true;
  @Input() timing = '250ms ease-in';

  //Size
  @Input() kebabCarouselWidth = {};
  @Input() minDelimitersOfItems = 5;

  //color
  @Input() color = '#EFEFEF';
  @Input() btnViewColor = '#4F5D6B';
  @Input() textColor = '#00B0FF';


  // Config Template
  @Input() itemTemplate: TemplateRef<{ item: any }>
  // @Input() initialState: 'expandable' | 'collapsed' = 'collapsed';
  // @Input() expandable = false;

  public alwaysDisplayedItems: string[] = [];
  public menueExpandableItems: string[] = [];

  //size
 // private itemWidth: number;
  carouselWrapperStyle = {}
  private _initItemSize = true;

  //item
  private currentItem: number = 0;

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
  private player: AnimationPlayer;

  private _quatity: number = 0;

  private _identifier: string = '';

  private _sources: Array<any> = [];

  private _displayedItems: Array<any> = [];

  private _clickOnMenu: EventEmitter<any> = new EventEmitter();


  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private builder: AnimationBuilder) {
  }

  ngOnInit() {

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

  // get itemsElements(): QueryList<ElementRef> {
  //   return this._itemsElements;
  // }

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

  clickOnMenu(event: Event, item: any) {
    event.preventDefault();
    this._clickOnMenu.emit(item);
  }
}


