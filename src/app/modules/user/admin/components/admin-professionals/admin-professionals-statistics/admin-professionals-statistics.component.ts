import {Component, OnInit} from '@angular/core';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {ClassificationService} from '../../../../../../services/classification/classification.service';
import {EmailType, SeniorityClassification} from '../../../../../../models/SeniorityClassification';
import {JobsClassification} from '../../../../../../models/jobsClassification';
import {HttpErrorResponse} from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-professionals-statistics',
  templateUrl: './admin-professionals-statistics.component.html',
  styleUrls: ['./admin-professionals-statistics.component.scss']
})
export class AdminProfessionalsStatisticsComponent implements OnInit {
  get repartitionStats(): { emailConfidence: EmailType; total: number; notClassified: number; classified: number } {
    return this._repartitionStats;
  }

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

  private _seniorityLevelsClassifications: Array<SeniorityClassification> = [];

  get seniorityLevelsClassifications(): Array<SeniorityClassification> {
    return this._seniorityLevelsClassifications;
  }

  private _jobsClassifications: Array<JobsClassification> = [];

  get jobsClassifications(): Array<JobsClassification> {
    return this._jobsClassifications;
  }

  private _fetchingError = false;

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  private _config: { emailConfidence?: EmailType; year?: number; month?: number; week?: number } = {};

  get config(): { emailConfidence?: EmailType; year?: number; month?: number; week?: number } {
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

  private _isLoading = false;

  get isLoading(): boolean {
    return this._isLoading;
  }

  private _allRepartitionStats: Array<{ emailConfidence: EmailType, total: number, notClassified: number, classified: number }> = [];
  private _repartitionStats: { emailConfidence: EmailType, total: number, notClassified: number, classified: number };
  private _notClassified = 0;
  private _classified = 0;

  private _selectedEmailConfidenceType: EmailType = 'ALL';

  get selectedEmailConfidenceType(): EmailType {
    return this._selectedEmailConfidenceType;
  }

  private _nbRiskyEmailsClassified = 0;

  private _nbGoodEmailsClassified = 0;

  get nbGoodEmailsClassified(): number {
    return this._nbGoodEmailsClassified;
  }

  get nbRiskyEmailsClassified(): number {
    return this._nbRiskyEmailsClassified;
  }

  ngOnInit() {
    this._initYears();
    Promise.all([
      this._getSeniorityLevelsClassification({emailConfidence: 'RISKY'}),
      this._getSeniorityLevelsClassification({emailConfidence: 'GOOD'}),
      this._getSeniorityLevelsClassification({emailConfidence: 'ALL'}),
      this._getJobsClassification({emailConfidence: 'RISKY'}),
      this._getJobsClassification({emailConfidence: 'GOOD'}),
      this._getJobsClassification({emailConfidence: 'ALL'})
    ]).then((values) => {
      this.selectEmailConfidenceType('ALL');
      this.computeEmailConfidenceStats();
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
    this._config.emailConfidence = this.selectedEmailConfidenceType;
    Promise.all([this._getSeniorityLevelsClassification(this._config), this._getJobsClassification(this._config)]).then((values) => {
      this._isLoading = false;
    }).catch(err => {
      console.log(err);
      this._isLoading = false;
    });
  }

  public selectEmailConfidenceType(type: EmailType) {
    this._selectedEmailConfidenceType = (type === this._selectedEmailConfidenceType) ? 'ALL' : type;
    this._seniorityLevelsClassification = this.seniorityLevelsClassifications.find(s => s.emailConfidence === this._selectedEmailConfidenceType)
    this._jobsClassification = this.jobsClassifications.find(j => j.emailConfidence === this._selectedEmailConfidenceType)
    this._repartitionStats = this._allRepartitionStats.find(r => r.emailConfidence === this._selectedEmailConfidenceType)
  }

  public computeEmailConfidenceStats() {
    this._nbRiskyEmailsClassified = this._allRepartitionStats.find(r => r.emailConfidence === 'RISKY').total;
    this._nbGoodEmailsClassified = this._allRepartitionStats.find(r => r.emailConfidence === 'GOOD').total;
  }

  private _getSeniorityLevelsClassification(config: any) {
    return new Promise(((resolve, reject) => {
      this._classificationService.seniorityLevels(config).subscribe((res: { classification: SeniorityClassification }) => {

        if (res.classification) {
          this._allRepartitionStats.push({
            emailConfidence: config.emailConfidence,
            total: res.classification.total,
            notClassified: (res.classification.seniorityLevels.find(c => !c._id) || {count: 0}).count,
            classified: res.classification.total - this._notClassified
          });

          if (config.emailConfidence === 'ALL') {
            this._notClassified = (res.classification.seniorityLevels.find(c => !c._id) || {count: 0}).count;
            this._classified = res.classification.total - this._notClassified;
          }

          const seniorityLevelsOrder = ['Top executive', 'Top manager', 'Manager', 'Expert', 'Other', 'Excluding', 'Irregular', 'No jobs'];
          res.classification.seniorityLevels.sort(function (a, b) {
            return seniorityLevelsOrder.indexOf(a.name) - seniorityLevelsOrder.indexOf(b.name);
          });

          this._seniorityLevelsClassifications.push(res.classification);
        } else {
          this._seniorityLevelsClassifications = [];
          this._seniorityLevelsClassification = null;
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
      this._classificationService.categoriesAndJobs(config).subscribe((res: { classification: JobsClassification }) => {
        if (res.classification) {
          res.classification.categories = res.classification.categories.sort((a, b) => {
            const aLabel = (a.label || {en: 'Not classified yet'}).en;
            const bLabel = (b.label || {en: 'Not classified yet'}).en;
            return aLabel.localeCompare(bLabel);
          });

          res.classification.categories.forEach(category => {
            category.jobs = category.jobs.sort((a, b) => a.label.en.localeCompare(b.label.en));
          });

          this._jobsClassifications.push(res.classification);
        } else {
          this._jobsClassifications = [];
          this._jobsClassification = null;
        }

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

  get classified(): number {
    return this._classified;
  }

  numberFormatter(num: number, digits: number) {
    if (num < 10) {
      return '1+';
    } else if (num < 100) {
      return (Math.floor(num / 10) * 10) + '+';
    } else if (num < 1000) {
      return (Math.floor(num / 100) * 100) + '+';
    } else {
      const lookup = [
        {value: 1e3, symbol: "k"},
        {value: 1e6, symbol: "M"}
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      const item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
      });
      return (item ? Math.floor(num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0") + '+';
    }
  }
}
