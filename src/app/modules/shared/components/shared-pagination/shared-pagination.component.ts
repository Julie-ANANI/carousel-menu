import {Component, Input, OnInit} from '@angular/core';
import { TranslateService, initTranslation } from './i18n/i18n';

@Component({
  selector: 'sqPagination',
  templateUrl: './shared-pagination.component.html',
  styleUrls: ['./shared-pagination.component.scss']
})
export class SharedPaginationComponent implements OnInit {
  @Input() service: any;
  @Input() perPageValues: number[];
  @Input() total: number;

  private _perPage: number;
  private _numPages: number;
  private _currentPage: number;

  constructor(private _translateService: TranslateService) {
    this.perPageValues = this.perPageValues || [10, 20, 50, 100];
    this._perPage = 10;
    this._currentPage = 1;
  }

  ngOnInit() {
    initTranslation(this._translateService);
  }

  ngOnChanges() {
    this._numPages = Math.ceil(this.total / this.perPage);
  }

  get numPages(): number {
    return this._numPages;
  }

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(page: number) {
    this._currentPage = page;
    this.service.goToPage(page);
  }

  get perPage(): number {
    return this._perPage;
  }

  set perPage(number: number) {
    this._perPage = number;
    this.service.numPerPage(number);
    this._numPages = Math.ceil(this.total / this.perPage);
  }
}
