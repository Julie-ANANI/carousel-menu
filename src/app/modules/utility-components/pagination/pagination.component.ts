import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateNotificationsService } from '../../../services/notifications/notifications.service';
import { PaginationInterface } from '../../../models/pagination';
import { LocalStorageService } from '../../../services/localStorage/localStorage.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent implements OnInit {

  @Input() set total(value: number) {
    this._total = value;
    this._numPages = Math.ceil(this._total / this.perPage);
  };

  @Input() set configValue(value: PaginationInterface) {
    if (this.checkConfig(value.limit)) {
      this.initialConfigValues.limit = JSON.parse(JSON.stringify(value.limit));
      this.initialConfigValues.offset = JSON.parse(JSON.stringify(value.offset));
    }
  }

  @Input() propertyName: string;

  @Output() configChange = new EventEmitter <any>();

  private _numPages: number;

  perPageValues: Array<number> = [10, 20, 50, 100, 1000];

  initialConfigValues: PaginationInterface = {
    limit: 10,
    offset: 0
  };

  private _localOffset = 0;

  private _limit = 0;

  private _total = 0;

  constructor(private lsService: LocalStorageService,
              private translateNotificationService: TranslateNotificationsService) {}

  ngOnInit() {
    this._limit = this.initialConfigValues.limit;

    const localLimit = parseInt(this.lsService.getItem(`${this.propertyName}-limit`), 10);

    if (localLimit !== null && this.propertyName && this.checkConfig(localLimit)) {
      this.initialConfigValues.limit = localLimit;
    }

    this._numPages = Math.ceil(this._total / this.perPage);

    this._update();
  }

  checkConfig(limit: number): boolean {
    if (limit >= 10 && limit <= 1000) {
      const index = this.perPageValues.findIndex((item) => item === limit);
      if (index === -1) {
        return false;
      } else {
        return true;
      }
    }

    return false;
  }

  get numPages(): number {
    return this._numPages;
  }

  get currentPage(): number {
    // return (this._config.offset / this._config.limit) + 1;
    return (this.initialConfigValues.offset / this.initialConfigValues.limit) + 1;
  }

  private _update() {
    if (this.propertyName) {
      this.lsService.setItem(`${this.propertyName}-limit`, this.initialConfigValues.limit);
      // this.lsService.setItem(`${this.propertyName}-offset`, this.config.offset);
    }

    // this.configChange.emit(this._config);

    if (this._localOffset !== this.initialConfigValues.offset || this._limit !== this.initialConfigValues.limit) {
      this.configChange.emit(this.initialConfigValues);
      this._localOffset = this.initialConfigValues.offset;
    }

  }

  set currentPage(page: number) {
    // this._config.offset = this._config.limit * (page - 1);
    if (page >= 1) {
      this.initialConfigValues.offset = this.initialConfigValues.limit * (page - 1);
      this._update();
    } else {
      this.translateNotificationService.error('ERROR.ERROR', 'ERROR.PAGINATION');
    }
  }

  get perPage(): number {
    // return this._config.limit;
    return this.initialConfigValues.limit;
  }

  set perPage(number: number) {
    this.initialConfigValues.limit = number;
    this._update();
    this._numPages = Math.ceil(this._total / this.perPage);
  }


  get limit(): number {
    return this._limit;
  }

  set limit(value: number) {
    this._limit = value;
  }

  get total(): number {
    return this._total;
  }

}
