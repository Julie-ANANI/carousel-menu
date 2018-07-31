import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})

export class PaginationComponent implements OnInit, OnChanges {

  @Input() config: any;
  @Input() perPageValues: Array<number>;
  @Input() total: number;
  @Input() propertyName: string;

  @Output() configChange = new EventEmitter <any>();

  private _numPages: number;
  private _initialized = false;

  constructor() {
    this.perPageValues = this.perPageValues || [10, 20, 50, 100, 1000];
  }

  ngOnInit() {
    this._initialized = true;
  }

  ngOnChanges() {
    if (!this._initialized && this.propertyName) {
      // Dès l'initialisation, on regarde si l'utilisateur a déjà des préférences concernant la pagination,
      // Et on met à jour si c'est le cas
      this.config.limit = localStorage.getItem(`${this.propertyName}-limit`) || this.config.limit;
      // this.config.offset = sessionStorage.getItem(`${this.propertyName}-offset`) || this.config.offset;
    }
    this._numPages = Math.ceil(this.total / this.perPage);
    this._update();
  }

  get numPages(): number {
    return this._numPages;
  }

  get currentPage(): number {
    return (this.config.offset / this.config.limit) + 1;
  }

  private _update() {
    if (this.propertyName) {
      localStorage.setItem(`${this.propertyName}-limit`, this.config.limit);
      // sessionStorage.setItem(`${this.propertyName}-offset`, this.config.offset);
    }
    this.configChange.emit(this.config);
  }

  goToPage(event: any): void {
    const page = parseInt((<HTMLInputElement> event.srcElement).value);
    this.config.offset = this.config.limit * (page - 1);
    this._update();
  }

  set currentPage(page: number) {
    this.config.offset = this.config.limit * (page - 1);
    this._update();
  }

  get perPage(): number {
    return this.config.limit;
  }

  set perPage(number: number) {
    this.config.limit = number;
    this._update();
    this._numPages = Math.ceil(this.total / this.perPage);
  }


}
