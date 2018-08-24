import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigTemplate } from '../../../../models/config';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent implements OnInit {

  @Input() set config(value: any) {
    this._config = JSON.parse(JSON.stringify(value));
  };

  @Input() perPageValues: Array<number>;
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
  private _config: any = {};
  // private _initialized = false;
  initialConfigValues: ConfigTemplate = {
    limit: 10,
    offset: 0
  };

  constructor() {
    this.perPageValues = this.perPageValues || [10, 20, 50, 100, 1000];
  }

  ngOnInit() {
    // this._initialized = true;
    this.initialize();
  }

  initialize() {
    const localLimit = parseInt(localStorage.getItem(`${this.propertyName}-limit`) || '0', 10);

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

    /*const limit = parseInt(value1, 10);

    if (limit >= 10 && limit <= 1000) {
      this.perPageValues.forEach((items) => {
        const index = this.perPageValues.findIndex((item) => item === limit);
        if (index === -1) {
          this.initialConfigValues.limit = 10;
          this.initialConfigValues.offset = 0;
          return true;
        } else {
          this.initialConfigValues.limit = limit;
          return true;
        }
      });
    }

    this.initialConfigValues.limit = 10;
    this.initialConfigValues.offset = 0;
    return true;*/
  }

  get numPages(): number {
    return this._numPages;
  }

  get currentPage(): number {
    // return (this._config.offset / this._config.limit) + 1;
    return (this.initialConfigValues.offset / this.initialConfigValues.limit) + 1;
  }

  private _update() {
    /*if (this.propertyName) {
      localStorage.setItem(`${this.propertyName}-limit`, JSON.stringify(this.initialConfigValues.limit));
      // sessionStorage.setItem(`${this.propertyName}-offset`, this.config.offset);
    }*/
    console.log(this.initialConfigValues);

    // this.configChange.emit(this._config);
  }

  goToPage(event: any): void {
    const page = parseInt((<HTMLInputElement> event.srcElement).value);
    this.config.offset = this.config.limit * (page - 1);
    this._update();
  }

  set currentPage(page: number) {
    // this._config.offset = this._config.limit * (page - 1);
    this.initialConfigValues.offset = this.initialConfigValues.limit * (page - 1);
    this._update();
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

  get config(): any {
    return this._config;
  }

}
