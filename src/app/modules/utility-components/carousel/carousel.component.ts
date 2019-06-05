import { Component, Input, OnInit } from '@angular/core';
import { Carousel } from './models/carousel';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})

export class CarouselComponent implements OnInit {

  @Input() set carouselOptions(value: Carousel) {
    this._loadData(value);
  }

  private _carouselOptions: Carousel;

  private _totalItems: number = 0;

  private _currentSlideIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  private _loadData(value: Carousel) {
    if (value) {
      this._carouselOptions = value;
      this._totalItems = this._carouselOptions.images ? this._carouselOptions.images.length : 0;
    }
  }

  public OnClickPrev(event: Event) {
    event.preventDefault();

    switch (this._carouselOptions.type) {

      case 'IMAGE':
        this._currentSlideIndex = this._currentSlideIndex === 0 ? this._currentSlideIndex = this._totalItems - 1 : this._currentSlideIndex -=1;
        break;

      case 'LOGO':
        break;
    }

  }

  public OnClickNext(event: Event) {
    event.preventDefault();

    switch (this._carouselOptions.type) {

      case 'IMAGE':
        this._currentSlideIndex = this._currentSlideIndex === 0 || this._currentSlideIndex !== this._totalItems - 1 ? this._currentSlideIndex += 1 : 0;
        break;

      case 'LOGO':
        break;
    }

  }

  public onClickNav(event: Event, index: number) {
    event.preventDefault();
    this._currentSlideIndex = index;
  }

  get carouselOptions(): Carousel {
    return this._carouselOptions;
  }

  get totalItems(): number {
    return this._totalItems;
  }

  get currentSlideIndex(): number {
    return this._currentSlideIndex;
  }

}
