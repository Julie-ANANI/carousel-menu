import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-shared-date-selector',
  templateUrl: './shared-date-selector.component.html',
  styleUrls: ['./shared-date-selector.component.scss']
})

export class SharedDateSelectorComponent implements OnInit {
  @Input() set months(value: Array<number>) {
      this._months = value;
  }

  @Input() set years(value: Array<number>) {
    this._years = value;
  }

  @Input() set monthSelected(month: number) {
    this._monthSelected = month;
  }

  @Input() set yearSelected(year: number) {
    this._yearSelected = year;
  }

  @Output() monthSelectedChange: EventEmitter<number> = new EventEmitter<number>();

  @Output() yearSelectedChange: EventEmitter<number> = new EventEmitter<number>();

  private _monthSelected: number;

  private _yearSelected: number;

  private _months: Array<number> = [];

  private _years: Array<number> = [];

  constructor() {
  }

  ngOnInit(): void {
  }


  get monthSelected(): number {
    return this._monthSelected;
  }


  get yearSelected(): number {
    return this._yearSelected;
  }

  sendMonthSelection() {
    this.monthSelectedChange.emit(this._monthSelected);
  }

  sendYearSelection() {
    this.yearSelectedChange.emit(this._yearSelected);
  }


  get months(): Array<number> {
    return this._months;
  }

  get years(): Array<number> {
    return this._years;
  }
}
