import {
  AfterViewInit,Component,
  ContentChildren,
  Directive, Inject, Input, PLATFORM_ID, QueryList, ElementRef,
  ViewChildren, ViewChild, OnInit, TemplateRef
} from '@angular/core';
import {Subject} from 'rxjs';
import {MenuKebabDirective} from './menu-kebab.directive';
import {AnimationFactory, AnimationPlayer, AnimationBuilder, animate, style} from '@angular/animations';


//todo remove this
@Directive({
  selector: '.carousel-item'
})
export class CarouselItemElement {
}


@Component({
  selector: 'app-menu-kebab',
  exportAs:'app-menu-kebab',
 templateUrl: './menu-kebab.html',
  styleUrls: ['./menu-kebab.scss']
})


export class MenuKebabComponent implements AfterViewInit, OnInit {

  //todo all
  @ContentChildren(MenuKebabDirective) items : QueryList<MenuKebabDirective>;
  @ViewChildren(CarouselItemElement, { read: ElementRef }) private itemsElements : QueryList<ElementRef>;
  @ViewChild('carousel') private carousel : ElementRef;

  //todo change
  next() {
    if( this.currentItem + 1 === this.items.length ) return;
    this.currentItem = (this.currentItem + 1) % this.items.length;
    //const offset = this.currentItem * this.itemWidth;
    const myAnimation : AnimationFactory = this.buildAnimation();
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  //todo change this
  private buildAnimation( ) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-150px)` }))
    ]);
  }

  //todo change
  prev() {
    if( this.currentItem === 0 ) return;

    this.currentItem = ((this.currentItem - 1) + this.items.length) % this.items.length;
    //const offset = this.currentItem * this.itemWidth;

    const myAnimation : AnimationFactory = this.buildAnimation();
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }


  //todo remove
  ngAfterViewInit() {

    setTimeout(() => {
      this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
      this.carouselWrapperStyle = {
        width: `${this.itemWidth}px`
      }
    });
    throw new Error("Method not implemented.");
  }

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
  @Input() itemTemplate: TemplateRef<{item: any}>
 // @Input() initialState: 'expandable' | 'collapsed' = 'collapsed';
 // @Input() expandable = false;

  public alwaysDisplayedItems: string[] = [];
  public menueExpandableItems: string[] = [];

  //size
  private itemWidth : number;
  carouselWrapperStyle = {}
  private _initItemSize = true;

  //item
  private currentItem: number = 0;

  //Config Template
  private _isDisplayItems = false;
  private _displaySuiteKebabItems = true;
  private player : AnimationPlayer;


  private _ngUnsubscribe: Subject<any> = new Subject<any>();


  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private builder: AnimationBuilder) {
  }

  ngOnInit() {

    //check status
    //this.expandable = this.initialState === 'expandable';
    // this.alwaysDisplayedItems = this.itemsTest.slice(0, this.minDelimitersOfItems);
    // this.menueExpandableItems = this.itemsTest.slice(this.minDelimitersOfItems, this.itemsTest.length);
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


  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}


