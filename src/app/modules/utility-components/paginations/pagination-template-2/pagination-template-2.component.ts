import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pagination } from '../interfaces/pagination';

@Component({
  selector: 'app-pagination-2',
  templateUrl: './pagination-template-2.component.html',
  styleUrls: ['./pagination-template-2.component.scss']
})

export class PaginationTemplate2Component implements OnInit {

  @Input() set pagination(value: Pagination) {
    console.log(value);
    this._pagination = value;
    this._calculatePage();
    console.log(this._pagination);
  }

  @Output() paginationChange: EventEmitter<Pagination> = new EventEmitter<Pagination>();

  private _pagination: Pagination;

  parPages: Array<number> = [ 10, 25, 50, 100 ];

  constructor() {}

  ngOnInit() {
    this._pagination.currentPage = 1;
    this._pagination.previousPage = 0;
    this._pagination.nextPage = 2;
  }

  private _calculatePage() {
    this._pagination.totalPage = Math.ceil(this._pagination.totalCount / this._pagination.parPage);
    this._pagination.paginatorNumber = [];

    for (let i = 1; i <= this._pagination.totalPage; i++) {
      this._pagination.paginatorNumber.push(i);
    }

    this.setPageNumber();

  }

  public setPageNumber() {

  }

  get pagination(): Pagination {
    return this._pagination;
  }

}
