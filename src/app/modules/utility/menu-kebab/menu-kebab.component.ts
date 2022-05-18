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


  next() {
    console.log('next button');

    //pseudo calcul
    // let initValueDisplayedItems = 0
    // let diffItems = (initValueDisplayedItems - 1);
    // let itemsToDisplay= (diffItems + this.displayedItems.length)
    // let lastItemDisplayed = (diffItems + this.displayedItems.length) % this.displayedItems.length;

    let maxValInitNext = this._quatity % this.displayedItems.length;
    let maxValQuantityOnePart = (this.displayedItems.length % this._quatity);
    let maxValQuantityNext = (maxValQuantityOnePart + maxValInitNext);

    //If dont have length && [].length === 0
    console.log('initIndex :' + this._initIndex);
    console.log('quantity :' + this._quatity);
    console.log('max length :' + this._sources.length);
    console.log('max quantity :' + maxValQuantityNext);
    console.log('max init :' + maxValInitNext);

      //when max view value for btn next with max value && max init valu
      if(this._quatity === maxValQuantityNext && this._initIndex === maxValInitNext ){
        console.log('tu assign max value');
        //assign max value
        this._quatity = maxValQuantityNext;
        this._initIndex = maxValInitNext;
        this._displayedItems = this._sources.slice(this._initIndex, this._quatity);
        return this.displayedItems;
        //when we can increment initIndex && quantity
      } else if (this._initIndex !== this.displayedItems.length) {
      this._quatity ++
      this._initIndex ++
      this._displayedItems = this._sources.slice(this._initIndex, this._quatity);
      return this.displayedItems;

      //If dont have length && [].length === 0
    } else {
      console.log('tu fais rien');
      return this.displayedItems;
    }
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

    let initValueDisplayedItems = 0
    let diffItems = (initValueDisplayedItems - 1);
    let itemsToDisplay= (diffItems + this.displayedItems.length)

    let lastItemDisplayed = (diffItems + this.displayedItems.length) % this.displayedItems.length;

    console.log(diffItems);
    console.log(lastItemDisplayed); // -1
    console.log(itemsToDisplay);



      // if(this._displayedItems && this._initIndex !== 0 && this._quatity < this._displayedItems.length){
      //   console.log('start value prev cas 1 :' + (this._initIndex));
      //   console.log('initIndex prev :' + (this._initIndex - 1));
      //   console.log('quantity prev :' + (this._quatity + 1));
      //   this._quatity ++
      //   this._initIndex - 1
      //   this._displayedItems = this._sources.slice(this._initIndex, this._quatity);
      //   return this._displayedItems;
      // } else if(this._initIndex === 0 ){
      //   console.log('ELSE')
      //   console.log('start value prev cas 1 :' + (this._initIndex));
      //   console.log('initIndex prev :' + (this._initIndex - 1));
      //   console.log('quantity prev :' + (this._quatity + 1));
      //   return this._displayedItems;
      // }

    let initIndexPrev = this._initIndex
    //const diff = 1;
    console.log('initIndexPrev : ' + initIndexPrev);

    if(this._displayedItems && this._displayedItems.length){
      console.log('start value prev cas 1 :' + (this._initIndex));
      console.log('initIndex prev :' + (this._initIndex = (initIndexPrev - 1)));
      console.log('quantity prev :' + (this._quatity + 1));
      console.log('max quantity :' + (this._quatity % this.displayedItems.length ));
      this._quatity ++
      this._initIndex = initIndexPrev - 1;
      this._displayedItems = this._sources.slice(this._initIndex, this._quatity);
      return initIndexPrev - 1 && this._displayedItems

      //return this._displayedItems;
    }

      console.log('value init index max:' + ((this._initIndex - this.displayedItems.length) <  this.displayedItems.length)); //si 13 est < lenght




    //const offset = this.currentItem * this.itemWidth;

    // const myAnimation : AnimationFactory = this.buildAnimation();
    // this.player = myAnimation.create(this.carousel.nativeElement);
    // this.player.play();



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


