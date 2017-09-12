/**
 * Created by bastien on 11/09/2017.
 */
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[sqSort]'
})
export class SqSortDirective {
  @Input() service: any;
  @Input() prop: string;

  private _order: number;

  constructor(private _el: ElementRef) {
    this._order = 0;
  }

  @HostListener('click', ['$event']) onClick() {
    this._order = this._order == 1 ? -1 : this._order + 1;
    this.service.sortBy(this.prop, this._order);
  }

}
