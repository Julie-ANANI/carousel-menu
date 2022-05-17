import {Component, Inject, Input, PLATFORM_ID, OnInit, EventEmitter, Output,} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-utility-carousel-menu',
  exportAs:'app-utility-carousel-menu',
 templateUrl: './menu-kebab.html',
  styleUrls: ['./menu-kebab.scss']
})

export class MenuKebabComponent implements OnInit {
  get initIndex(): number {
    return this._initIndex;
  }

  //config button controls
  @Input() showControls = true;

  //Size
  @Input() minDelimitersOfItems = 5;
  @Input() menuHeight = '40px'
  @Input() itemWidth = '146px'

  //color
  @Input() backgroundColor = '#EFEFEF';
  @Input() btnViewColor = '#4F5D6B';
  @Input() textColor = '#00B0FF';

  //position
  @Input() positionBtnPrev = '-0,7em';
  @Input() positionBtnNext = '3em';
  @Input() positionBtnKebab = '-6em';
  @Input() positionBtnLess = '1em';

  @Output() menuItemClicked: EventEmitter<any> = new EventEmitter();

  /**
   * here, you get configuration for the menu
   * @param value
   * quatity = 5
   */
  @Input() set config(value: any) {
    if (value) {
      this._quatity = value.quatity || 0;
      this._initIndex = value.initIndex || 0;
      this._sources = value.sources || [];
      this._identifier = value.identifier || '';
      // TODO check sources
      //initialise _displayedItems
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
  private _sources: Array<any> = [];
  private _displayedItems: Array<any> = [];

  // false: displayItem[0] compare to sources[0]
  //showPrev = true;

  // false: displayItem[last] compare to sources[last]
  showNext = true;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object) {}

  ngOnInit() {}

  clickOnMenu(event: Event, item: any) {
    event.preventDefault();
    this._currentItem = item;
    this.menuItemClicked.emit(item);
  }

  //todo change
  next(event: Event, item: any) {
    console.log('next button');
    //console.log($event);
    //event.preventDefault();
   // this._currentItem = item;

    // false: displayItem[last] compare to sources[last]

    //recupère la longeur du tableau

    //boucle sur le tableau
         //push show item sauf le dernier




    //si c'est le dernier index afficher button prev

    //si c'est le dernier display hide
    // width + decal width 1

    let initValueDisplayedItems = 0
    let diffItems = (initValueDisplayedItems - 1);
    let itemsToDisplay= (diffItems + this.displayedItems.length)

     let lastItemDisplayed = (diffItems + this.displayedItems.length) % this.displayedItems.length;

    console.log(diffItems);
    console.log(lastItemDisplayed);
    console.log(itemsToDisplay);

    if(!this.displayedItems) {
      return;
    } else {
      //value start
      console.log('start value :' + (this._initIndex + 1));
      console.log('start value :' + (lastItemDisplayed + 1));
      this._initIndex ++
      this._quatity ++
      this._displayedItems = this._sources.slice(this._initIndex, this._quatity);
      return this.displayedItems;
      //value end
      //if not last
    }

    //const offset = this.currentItem * this.itemWidth;

    // const myAnimation : AnimationFactory = this.buildAnimation();
    // this.player = myAnimation.create(this.carousel.nativeElement);
    // this.player.play();


  }

  //todo change this
  // private buildAnimation( ) {
  //   return this.builder.build([
  //     animate(this.timing, style({ transform: `translateX(-150px)` }))
  //   ]);
  // }

  //todo change
  prev() {
    console.log('previous button');
    // if( this.currentItem === 0 ) return;
    //
    // this.currentItem = ((this.currentItem - 1) + this.items.length) % this.items.length;
    // //const offset = this.currentItem * this.itemWidth;
    //
    // const myAnimation : AnimationFactory = this.buildAnimation();
    // this.player = myAnimation.create(this.carousel.nativeElement);
    // this.player.play();
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


