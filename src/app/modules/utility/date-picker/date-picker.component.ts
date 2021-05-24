import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CalAnimation, IAngularMyDpOptions, IMyDateModel, IMyDefaultMonth} from 'angular-mydatepicker';

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
  templateUrl: './date-picker.component.html'
})
export class DatePickerComponent implements OnInit {

  /**
   * setting the default calendar view.
   * for the first time it will be set when pass the value of isDisabledUntil.
   * @param value
   */
  @Input() set defMonth(value: DatePickerDefMonth) {
    if (!!value && value.month && value.year) {
      this._setDefaultMonth(value.month, value.year);
    }
  }

  /**
   * value in format yyyy-mm-dd (2021-06-24)
   * when you pass it until this date and including this all are disabled.
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

  private _currentLang = this._translateService.currentLang;

  private _defaultMonth: IMyDefaultMonth = <IMyDefaultMonth>{};

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    this._initDateOptions();
  }

  private _initDateOptions() {
    this._datePickerOptions = {
      inline: true,
      dateRange: false,
      dateFormat: this._currentLang === 'en' ? 'yyyy-mm-dd' : 'dd-mm-yyyy',
      calendarAnimation: { in: CalAnimation.ScaleTop, out: CalAnimation.ScaleTop},
      disableWeekends: true
    };

    if (!!this._isDisabledUntil) {
      this._datePickerOptions['disableUntil'] = {
        year: Number(this._isDisabledUntil.slice(0, 4)),
        month: Number(this._isDisabledUntil.slice(5, 7)),
        day: Number(this._isDisabledUntil.slice(8, 10))
      };

      this._setDefaultMonth(Number(this._isDisabledUntil.slice(5, 7)), Number(this._isDisabledUntil.slice(0, 4)));
    }
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
  }

  get currentLang(): string {
    return this._currentLang;
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

}
