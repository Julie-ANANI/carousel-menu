import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'sqPagination',
  templateUrl: './shared-pagination.component.html',
  styleUrls: ['./shared-pagination.component.scss']
})
export class SharedPaginationComponent implements OnInit {
  @Input() config: any;
  @Output() configChange = new EventEmitter <any>();
  @Input() perPageValues: number[];
  @Input() total: number;

  private _numPages: number;
  private _currentPage: number;

  constructor() {
    this.perPageValues = this.perPageValues || [10, 20, 50, 100];
    this._currentPage = 1;
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this._numPages = Math.ceil(this.total / this.perPage);
  }

  get numPages(): number {
    return this._numPages;
  }

  get currentPage(): number {
    return (this.config.offset / this.config.limit) + 1;
  }
  
  goToPage(event: any): void {
    const page = parseInt((<HTMLInputElement> event.srcElement).value);
    this.config.offset = this.config.limit * (page - 1);
    this.configChange.emit(this.config);
  }

  set currentPage(page: number) {
    this.config.offset = this.config.limit * (page - 1);
    this.configChange.emit(this.config);
  }

  get perPage(): number {
    return this.config.limit;
  }

  set perPage(number: number) {
    this.config.limit = number;
    this.configChange.emit(this.config);
    this._numPages = Math.ceil(this.total / this.perPage);
  }
}
