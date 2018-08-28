import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigTemplate } from '../../../../models/config';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent implements OnInit {

  @Input() total: number;
  @Input() propertyName: string;

  @Input() set configValue(value: ConfigTemplate) {
    if (this.checkConfig(value.limit)) {
      this.initialConfigValues.limit = JSON.parse(JSON.stringify(value.limit));
      this.initialConfigValues.offset = JSON.parse(JSON.stringify(value.offset));
    }
  }

  @Output() configChange = new EventEmitter <any>();

  private _numPages: number;
  perPageValues: Array<number> = [10, 20, 50, 100, 1000];

  initialConfigValues: ConfigTemplate = {
    limit: 10,
    offset: 0
  };

  private _localOffset = 0;
  private _limit = 0;

  constructor(private translateNotificationService: TranslateNotificationsService) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this._limit = this.initialConfigValues.limit;

    const localLimit = parseInt(localStorage.getItem(`${this.propertyName}-limit`) || '10', 10);

    if (this.propertyName && localLimit && this.checkConfig(localLimit)) {
      this.initialConfigValues.limit = localLimit;
    }

    this._numPages = Math.ceil(this.total / this.perPage);
    this._update();

  }

  /*ngOnChanges() {
    if (!this._initialized && this.propertyName) {
      // Dès l'initialisation, on regarde si l'utilisateur a déjà des préférences concernant la pagination,
      // Et on met à jour si c'est le cas
      this._config.limit = localStorage.getItem(`${this.propertyName}-limit`) || this._config.limit;
      // this.config.offset = sessionStorage.getItem(`${this.propertyName}-offset`) || this.config.offset;
    }
    this._numPages = Math.ceil(this.total / this.perPage);
    this._update();

  }*/

  checkConfig(value1: any): boolean {
    const limit = parseInt(value1, 10);

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
      localStorage.setItem(`${this.propertyName}-limit`, this.initialConfigValues.limit);
      // sessionStorage.setItem(`${this.propertyName}-offset`, this.config.offset);
    }

    // this.configChange.emit(this._config);

    if (this._localOffset !== this.initialConfigValues.offset || this._limit !== this.initialConfigValues.limit) {
      this.configChange.emit(this.initialConfigValues);
      this._localOffset = this.initialConfigValues.offset;
    }

  }

  /*goToPage(event: any): void {
    const page = parseInt((<HTMLInputElement> event.srcElement).value);
    this.config.offset = this.config.limit * (page - 1);
    this._update();
  }*/

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
    // this._config.limit = number;
    this.initialConfigValues.limit = number;
    this._update();
    this._numPages = Math.ceil(this.total / this.perPage);
  }

  get localOffset(): number {
    return this._localOffset;
  }


  get limit(): number {
    return this._limit;
  }

  set limit(value: number) {
    this._limit = value;
  }

}
