import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pagination } from '../interfaces/pagination';
import { LocalStorageService } from '../../../../services/localStorage/localStorage.service';
import { MouseService } from '../../../../services/mouse/mouse.service';

@Component({
  selector: 'app-pagination-2',
  templateUrl: './pagination-template-2.component.html',
  styleUrls: ['./pagination-template-2.component.scss']
})

export class PaginationTemplate2Component implements OnInit {

  @Input() set pagination(value: Pagination) {
    this._pagination = value;
    this._callingFunctions();
  }

  @Input() set totalCount(value: number) {
    this._totalCount = value;

    if (value) {
      this._callingFunctions();
    }

  }

  @Output() paginationChange: EventEmitter<Pagination> = new EventEmitter<Pagination>();

  private _pagination: Pagination;

  private _parPages: Array<number> = [ 10, 25, 50, 100 ];

  private _startPageNumber: number;

  private _endPageNumber: number;

  private _toggleParPageMenu: boolean;

  private _totalCount: number;

  constructor(private _localStorageService: LocalStorageService,
              private _mouseService: MouseService) {

    this._startPageNumber = 0;
    this._endPageNumber = 11;

    this._mouseService.startEvent(true);

    this._mouseService.targetId().subscribe((value: string) => {
      this._toggleParPageMenu = value === 'pagination-button-parPage';
    });

  }

  ngOnInit() {
  }

  private _callingFunctions() {
    this._initializeValues();
    this._calculatePage();
    this._setOffset();
  }

  private _initializeValues() {
    const localStorage = parseInt(this._localStorageService.getItem(this._pagination.propertyName), 10);
    this._pagination.currentPage = this.currentPage;
    this._pagination.previousPage = this._pagination.previousPage ? this._pagination.previousPage : 0;
    this._pagination.nextPage = this._pagination.nextPage ? this._pagination.nextPage : 2;
    this._pagination.parPage = localStorage ? localStorage : 10;
  }

  private _calculatePage() {
    this._pagination.totalPage = Math.ceil(this._totalCount / this._pagination.parPage);
    this._pagination.paginatorNumber = [];

    for (let i = 1; i <= this._pagination.totalPage; i++) {
      this._pagination.paginatorNumber.push(i);
    }

  }

  public navigatePage(pageNumber: number) {
    const mediumNumber = this._pagination.paginatorNumber[this._endPageNumber - 1] - 5;

    if (pageNumber > mediumNumber) {
      this.moveForward(pageNumber, mediumNumber);
    } else {
      this.moveBackward(pageNumber, mediumNumber);
    }

    this._pagination.currentPage = pageNumber;
    this._emitPaginationChanges();

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

  public onChangeParPage(value: number) {
    this._pagination.parPage = value;
    this._calculatePage();
    this._emitPaginationChanges();
  }

  private _emitPaginationChanges() {
    this._setOffset();
    this._storeParPageLocally();

    if (this._pagination.offset >= this._totalCount) {
      this._pagination.offset = 0;
      this._pagination.currentPage = 1;
      this._startPageNumber = 0;
    }

    this.paginationChange.emit(this._pagination);
  }

  private _setOffset() {
    this._pagination.offset = this.currentPage === 1 ? 0 : (this.currentPage - 1) * this._pagination.parPage;
  }

  private _storeParPageLocally() {
    this._localStorageService.setItem(this._pagination.propertyName, (this._pagination.parPage).toString())
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

  get toggleParPageMenu(): boolean {
    return this._toggleParPageMenu;
  }

  get totalCount(): number {
    return this._totalCount;
  }

  get currentPage(): number {
    return this._pagination && this._pagination.currentPage ? this._pagination.currentPage : 1;
  }

}
