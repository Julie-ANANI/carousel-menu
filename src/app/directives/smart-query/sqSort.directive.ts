/**
 * Created by bastien on 11/09/2017.
 */
import { Directive, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[sqSort]'
})
export class SqSortDirective {
  @Input() service: any;
  @Input() prop: string;

  private _order: number;

  constructor(private _renderer: Renderer2) {
    this._order = 0;
  }

  @HostListener('click', ['$event']) onClick(e) {
    this._order = this._order == 1 ? -1 : this._order + 1;
    if (this._order === 1) {
      this._renderer.addClass(e.target, "sq-sort-ascent");
    } else if (this._order === -1) {
      this._renderer.addClass(e.target, "sq-sort-descent");
      this._renderer.removeClass(e.target, "sq-sort-ascent");
    } else {
      this._renderer.removeClass(e.target, "sq-sort-descent");
    }
    this.service.sortBy(this.prop, this._order);
  }
}
