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

  private _parPages: Array<number> = [ 10, 25, 50, 100 ];

  private _startPageNumber: number;

  private _endPageNumber: number;

  constructor() {}

  ngOnInit() {
    this._pagination.currentPage = 1;
    this._pagination.previousPage = 0;
    this._pagination.nextPage = 2;
    this._startPageNumber = 0;
    this._endPageNumber = 11;
  }

  private _calculatePage() {
    this._pagination.totalPage = Math.ceil(this._pagination.totalCount / this._pagination.parPage);
    this._pagination.paginatorNumber = [];

    for (let i = 1; i <= this._pagination.totalPage; i++) {
      this._pagination.paginatorNumber.push(i);
    }

    this.setPageNumber();

  }

  public navigatePage(pageNumber: number) {
    const mediumNumber = this._pagination.paginatorNumber[this._endPageNumber - 1] - 5;

    if (pageNumber > mediumNumber) {
      this.moveForward(pageNumber, mediumNumber);
    } else {
      this.moveBackward(pageNumber, mediumNumber);
    }

    this._pagination.currentPage = pageNumber;

  }

  public moveForward(pageNumber: number, mediumNumber: number) {
    const diff = pageNumber - mediumNumber;

    if (this._endPageNumber + diff < this._pagination.paginatorNumber.length) {
      this._endPageNumber += diff;
    } else {
      this._endPageNumber = this._pagination.paginatorNumber.length;
    }

    this._startPageNumber = this._endPageNumber - 11;

  }

  public moveBackward(pageNumber: number, mediumNumber:number) {
    const diff = mediumNumber - pageNumber;

    if (this._startPageNumber - diff > 0) {
      this._startPageNumber -=diff;
    } else {
      this._startPageNumber = 0;
    }

    this._endPageNumber = this._startPageNumber + 11;

  }

  public setPageNumber() {

  }

  public onChangeParPage(value: number) {
    this._pagination.parPage = value;
  }

  get pagination(): Pagination {
    return this._pagination;
  }

  get parPages(): Array<number> {
    return this._parPages;
  }

  get startPageNumber(): number {
    return this._startPageNumber;
  }

  get endPageNumber(): number {
    return this._endPageNumber;
  }

}
