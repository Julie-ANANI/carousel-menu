import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sq-sort',
  templateUrl: './shared-sort.component.html',
  styleUrls: ['./shared-sort.component.scss']
})
export class SharedSortComponent implements OnInit {
  @Input() service: any;
  @Input() prop: string;
  private _order: number;

  constructor() {
    this._order = 0;
  }

  ngOnInit() {
  }

  public sort(): void {
    this._order = this._order == 1 ? -1 : this._order + 1;
    this.service.sortBy(this.prop, this._order);
  }

  get order(): number {
    return this._order;
  }
}
