import {Component, OnInit} from '@angular/core';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {ClassificationService} from '../../../../../../services/classification/classification.service';
import {SeniorityClassification} from '../../../../../../models/SeniorityClassification';
import {JobsClassification} from '../../../../../../models/jobsClassification';
import {HttpErrorResponse} from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-professionals-statistics',
  templateUrl: './admin-professionals-statistics.component.html',
  styleUrls: ['./admin-professionals-statistics.component.scss']
})
export class AdminProfessionalsStatisticsComponent implements OnInit {
  constructor(private _rolesFrontService: RolesFrontService,
              private _classificationService: ClassificationService) {
  }

  private _seniorityLevelsClassification: SeniorityClassification;

  get seniorityLevelsClassification(): SeniorityClassification {
    return this._seniorityLevelsClassification;
  }

  private _jobsClassification: JobsClassification;

  get jobsClassification(): JobsClassification {
    return this._jobsClassification;
  }

  private _fetchingError = false;

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  private _config: { year?: number; month?: number; week?: number } = {};

  get config(): { year?: number; month?: number; week?: number } {
    return this._config;
  }

  private _selectedYear = '';

  get selectedYear(): string {
    return this._selectedYear;
  }

  private _selectedMonth = '';

  get selectedMonth(): string {
    return this._selectedMonth;
  }

  private _selectedWeek = '';

  get selectedWeek(): string {
    return this._selectedWeek;
  }

  private _dropdownYears: Array<string> = [];

  get dropdownYears(): any[] {
    return this._dropdownYears;
  }

  private _dropdownMonths: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  get dropdownMonths(): any[] {
    return this._dropdownMonths;
  }

  private _dropdownWeeks: Array<string> = [];

  get dropdownWeeks(): any[] {
    return this._dropdownWeeks;
  }

  private _isLoading = true;

  get isLoading(): boolean {
    return this._isLoading;
  }

  private _total = 0;
  private _notClassified = 0;

  get total(): number {
    return this._total;
  }

  get notClassified(): number {
    return this._notClassified;
  }

  ngOnInit() {
    this._initYears();
    Promise.all([this._getSeniorityLevelsClassification({}), this._getJobsClassification({})]).then((values) => {
      this._isLoading = false;
    });
  }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(['professionals']);
  }

  public onChangeDate(type: 'MONTH' | 'YEAR' | 'WEEK', value: string) {
    switch (type) {
      case 'MONTH':
        this._selectedMonth = value;
        if (!!value) {
          this._config.month = this.dropdownMonths.indexOf(value) + 1;
        } else {
          delete (this._config.month);
        }
        break;
      case 'YEAR':
        this._selectedYear = value;
        if (!!value) {
          this._config.year = parseInt(value, 0);
        } else {
          delete (this._config.year);
        }
        break;
      case 'WEEK':
        this._selectedWeek = value;
        if (!!value) {
          this._config.week = this.dropdownWeeks.indexOf(value);
        } else {
          delete (this._config.week);
        }
        break;
    }

    if (!!this.selectedYear && !!this.selectedMonth) {
      this._weekCount(parseInt(this._selectedYear, 0), this.dropdownMonths.indexOf(this._selectedMonth) + 1);
    }

    this._isLoading = true;
    Promise.all([this._getSeniorityLevelsClassification(this._config), this._getJobsClassification(this._config)]).then((values) => {
      this._isLoading = false;
    });
  }

  private _getSeniorityLevelsClassification(config: any) {
    return new Promise(((resolve, reject) => {
      this._classificationService.seniorityLevels(config).subscribe((res: { classification: any }) => {

        if (res.classification) {
          this._seniorityLevelsClassification = res.classification;
          this._total = this._seniorityLevelsClassification.total;
          this._notClassified = (this._seniorityLevelsClassification.seniorityLevels.find(c => !c._id) || {count: 0}).count;
        }

        resolve();
      }, (error) => {
        console.error(error);
        this._fetchingError = true;
        reject();
      });
    }));
  }

  private _getJobsClassification(config: any) {
    return new Promise(((resolve, reject) => {
      this._classificationService.categoriesAndJobs(config).subscribe((res: { classification: any }) => {
        this._jobsClassification = res.classification;
        this._jobsClassification.categories = this._jobsClassification.categories.sort((a, b) => {
          const aLabel = (a.label || {en: 'Not classified yet'}).en;
          const bLabel = (b.label || {en: 'Not classified yet'}).en;
          return aLabel.localeCompare(bLabel);
        });

        this._jobsClassification.categories.forEach(category => {
          category.jobs = category.jobs.sort((a, b) => a.label.en.localeCompare(b.label.en));
        });
        resolve();
      }, (error) => {
        console.error(error);
        this._fetchingError = true;
        reject();
      });
    }));
  }

  private _initYears() {

    this._classificationService.classificationDates().subscribe((dates) => {

      let _firstYear = 2020;
      const _currentYear = Number(moment().year().toString());
      if (dates.length) {
        _firstYear = Number(new Date(dates[0]).getFullYear());
      }
      for (let i = _currentYear; i >= _firstYear; i--) {
        this._dropdownYears.push((i).toString(10));
      }
      this._selectedYear = _currentYear.toString(10);

    }, (err: HttpErrorResponse) => {
      console.error(err);
    });
  }

  private _weekCount(year: number, month: number) {

    const ordinalNumbers = ['1st', '2nd', '3rd', '4th', '5th'];

    const lastOfMonth = new Date(year, month, 0);

    const days = lastOfMonth.getDate();
    const numberOfWeeks = Math.ceil(days / 7);

    this._dropdownWeeks = ordinalNumbers.slice(0, numberOfWeeks);
  }
}
