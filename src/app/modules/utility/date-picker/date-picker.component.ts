import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CalAnimation, IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth} from 'angular-mydatepicker';
import * as moment from 'moment';
import {IMyMarkedDates} from 'angular-mydatepicker/lib/interfaces/my-marked-dates.interface';

export interface DatePickerDefMonth {
  month: number;
  year: number;
}

/**
 * a calendar view date picker.
 * ex: New project last step component.
 *
 * package: https://github.com/kekeh/angular-mydatepicker
 * wiki: https://github.com/kekeh/angular-mydatepicker/wiki
 */

@Component({
  selector: 'app-utility-date-picker',
  template: `
    <div [id]="'date-picker'" class="date-picker">
      <label>
        <input
          (dateChanged)="onDateChanged($event)"
          [defaultMonth]="defaultMonth"
          [locale]="currentLang"
          [options]="datePickerOptions"
          angular-mydatepicker
          type="hidden">
      </label>
    </div>
  `
})
export class DatePickerComponent implements OnInit, OnChanges {

  /**
   * setting the default calendar view.
   * for the first time it will be set when pass the value of isDisabledUntil.
   * implementation detail: https://github.com/kekeh/angular-mydatepicker/wiki/defaultMonth-attribute
   * @param value
   */
  @Input() set defMonth(value: DatePickerDefMonth) {
    if (!!value && value.month && value.year) {
      this._defMonth = value;
    }
  }

  /**
   * pass the array of the dates you want to marks.
   * more info: https://github.com/kekeh/angular-mydatepicker/wiki/usage-of-markDates-option
   * @param value
   */
  @Input() set markDates(value: Array<IMyMarkedDates>) {
    this._markDates = value || [];
  }

  /**
   * value in format yyyy-mm-dd (2021-06-24)
   * when you pass it until this date and including this all are disabled.
   * implementation detail: https://github.com/kekeh/angular-mydatepicker/wiki/disable-until-yesterday
   * @param value
   */
  @Input() set isDisabledUntil(value: string) {
    if (!!value) {
      this._isDisabledUntil = value;
      this._initDateOptions();
    }
  }

  /**
   * IMyDateModel {
   *   isRange: boolean;
   *   singleDate?: IMySingleDateModel;
   *   dateRange?: IMyDateRangeModel;
   * }
   *
   * IMySingleDateModel {
   *   date?: IMyDate;
   *   jsDate?: Date;
   *   formatted?: string;
   *   epoc?: number;
   * }
   *
   * IMyDate {
   *   year: number;
   *   month: number;
   *   day: number;
   * }
   */
  @Output() selectedDate: EventEmitter<IMyDateModel> = new EventEmitter<IMyDateModel>();

  private _datePickerOptions: IAngularMyDpOptions = <IAngularMyDpOptions>{};

  private _isDisabledUntil = '';

  private _defaultMonth: IMyDefaultMonth = <IMyDefaultMonth>{};

  private _defMonth: DatePickerDefMonth = <DatePickerDefMonth>{};

  private _markDates: Array<IMyMarkedDates> = [];

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    this._initDateOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes && changes.defMonth && changes.defMonth.currentValue) {
      this._setDefaultMonth(this._defMonth.month, this._defMonth.year);
    } else if (!!this._isDisabledUntil) {
      this._setDefaultMonth(Number(this._isDisabledUntil.slice(5, 7)), Number(this._isDisabledUntil.slice(0, 4)));
    }

    if (changes && changes.markDates && changes.markDates.currentValue && changes.markDates.currentValue.length) {
      this._initMarkDates();
    }

  }

  private _initDateOptions() {
    this._datePickerOptions = {
      inline: true,
      dateRange: false,
      dateFormat: this.currentLang === 'en' ? 'yyyy-mm-dd' : 'dd-mm-yyyy',
      calendarAnimation: { in: CalAnimation.ScaleTop, out: CalAnimation.ScaleTop},
      disableWeekends: true,
      maxYear: moment().add(1, 'years').year()
    };

    if (!!this._isDisabledUntil) {
      this._datePickerOptions['disableUntil'] = {
        year: Number(this._isDisabledUntil.slice(0, 4)),
        month: Number(this._isDisabledUntil.slice(5, 7)),
        day: Number(this._isDisabledUntil.slice(8, 10))
      };
    }

    if (this._markDates.length) {
      this._initMarkDates();
    }
  }

  private _initMarkDates() {
    this._datePickerOptions.markDates = this._markDates;
  }

  /**
   * this will make the calendar view open to passed month.
   * @param month
   * @param year
   * @private
   */
  private _setDefaultMonth(month: number, year: number) {
    const _month = month.toString().length === 1 ? `0${month}` : month.toString();
    const _year = year.toString(10);

    this._defaultMonth = {
      defMonth: `${_month}/${_year}`
    };
  }

  /***
   * when the user selects the date from the date-picker emitting that value.
   * @param event
   */
  public onDateChanged(event: IMyDateModel) {
    this.selectedDate.emit(event);
    this._initDateOptions();
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get isDisabledUntil(): string {
    return this._isDisabledUntil;
  }

  get datePickerOptions(): IAngularMyDpOptions {
    return this._datePickerOptions;
  }

  get defaultMonth(): IMyDefaultMonth {
    return this._defaultMonth;
  }


  get markDates(): Array<IMyMarkedDates> {
    return this._markDates;
  }

  get defMonth(): DatePickerDefMonth {
    return this._defMonth;
  }

}
