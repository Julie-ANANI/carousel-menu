import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {ClassificationService} from '../../../../../../services/classification/classification.service';
import {EmailType, SeniorityClassification} from '../../../../../../models/seniority-classification';
import {JobsClassification} from '../../../../../../models/jobs-classification';
import {HttpErrorResponse} from '@angular/common/http';
import * as moment from 'moment';
import {isPlatformBrowser} from '@angular/common';
import {first} from 'rxjs/operators';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {TranslateNotificationsService} from '../../../../../../services/translate-notifications/translate-notifications.service';
import {LangEntryService} from '../../../../../../services/lang-entry/lang-entry.service';

@Component({
  selector: 'app-professionals-statistics',
  templateUrl: './admin-professionals-statistics.component.html',
  styleUrls: ['./admin-professionals-statistics.component.scss']
})
export class AdminProfessionalsStatisticsComponent implements OnInit {

  private _seniorityLevelsClassification: SeniorityClassification;

  private _jobsClassification: JobsClassification;

  private _seniorityLevelsClassifications: Array<SeniorityClassification> = [];

  private _jobsClassifications: Array<JobsClassification> = [];

  private _fetchingError = false;

  private _selectedYear = '';

  private _config: { emailConfidence?: EmailType; year?: number; month?: number; week?: number } = {};

  private _selectedMonth = '';

  private _selectedWeek = '';

  private _dropdownYears: Array<string> = [];

  private _dropdownWeeks: Array<string> = [];

  private _allRepartitionStats: Array<{ emailConfidence: EmailType, classified: number }> = [];

  private _repartitionStats: { emailConfidence: EmailType, classified: number };

  private _classified = 0;

  private _selectedEmailConfidenceType: EmailType = 'ALL';

  private _nbRiskyEmailsClassified = 0;

  private _nbGoodEmailsClassified = 0;

  private _isLoading = true;

  private _dropdownMonths: Array<string> = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _langEntryService: LangEntryService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _rolesFrontService: RolesFrontService,
              private _classificationService: ClassificationService) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._initYears();
      this._getClassificationsByEmailConfidences();
    }
  }

  private _getClassificationsByEmailConfidences() {
    Promise.all([
      this._getSeniorityLevelsClassification({...this._config, emailConfidence: 'RISKY'}),
      this._getSeniorityLevelsClassification({...this._config, emailConfidence: 'GOOD'}),
      this._getSeniorityLevelsClassification({...this._config, emailConfidence: 'ALL'}),
      this._getJobsClassification({...this._config, emailConfidence: 'RISKY'}),
      this._getJobsClassification({...this._config, emailConfidence: 'GOOD'}),
      this._getJobsClassification({...this._config, emailConfidence: 'ALL'})
    ]).then(() => {
      this.selectEmailConfidenceType('ALL');
      this.computeEmailConfidenceStats();
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      this._isLoading = false
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
          delete (this._config.week);
          this._selectedWeek = '';
        } else {
          delete (this._config.month);
        }
        break;
      case 'YEAR':
        this._selectedYear = value;
        if (!!value) {
          this._config.year = parseInt(value, 0);
          delete (this._config.week);
          this._selectedWeek = '';
          delete (this._config.month);
          this._selectedMonth = '';
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
    this._getClassificationsByEmailConfidences();
  }

  public selectEmailConfidenceType(type: EmailType) {
    this._selectedEmailConfidenceType = (type === this._selectedEmailConfidenceType) ? 'ALL' : type;
    this._seniorityLevelsClassification = this.seniorityLevelsClassifications.find(s => s.emailConfidence === this._selectedEmailConfidenceType);
    this._jobsClassification = this.jobsClassifications.find(j => j.emailConfidence === this._selectedEmailConfidenceType);
    this._repartitionStats = this._allRepartitionStats.find(r => r.emailConfidence === this._selectedEmailConfidenceType);
  }

  public computeEmailConfidenceStats() {
    this._nbRiskyEmailsClassified = this._allRepartitionStats.find(r => r.emailConfidence === 'RISKY').classified;
    this._nbGoodEmailsClassified = this._allRepartitionStats.find(r => r.emailConfidence === 'GOOD').classified;
  }

  private _getSeniorityLevelsClassification(config: any) {
    return new Promise(((resolve, reject) => {
      this._classificationService.seniorityLevels(config).pipe(first()).subscribe((res: { classification: SeniorityClassification }) => {
        if (res.classification) {
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

  /** TODO delete the commented part after multilang migration
   *
   * @param config
   * @private
   */
  private _getJobsClassification(config: any) {
    return new Promise(((resolve, reject) => {
      this._classificationService.categoriesAndJobs(config).pipe(first()).subscribe((res: { classification: JobsClassification }) => {

        if (res.classification) {
          /*res.classification.categories = res.classification.categories.sort((a, b) => {
            const aLabel = (a.label || {en: 'Not classified yet'}).en;
            const bLabel = (b.label || {en: 'Not classified yet'}).en;
            return aLabel.localeCompare(bLabel);
          });*/
          res.classification.categories = res.classification.categories.sort((a, b) => {
            const aLabel = this._langEntryService.transform(a.entry, 'label', 'en') || 'Not classified yet';
            const bLabel = this._langEntryService.transform(b.entry, 'label', 'en') || 'Not classified yet';
            return aLabel.localeCompare(bLabel);
          });

          this._allRepartitionStats.push({
            emailConfidence: config.emailConfidence,
            classified: res.classification.total
          });

          if (config.emailConfidence === 'ALL') {
            this._classified = res.classification.total;
          }

          /*res.classification.categories.forEach(category => {
            category.jobs = category.jobs.sort((a, b) => a.label.en.localeCompare(b.label.en));
          });*/
          res.classification.categories.forEach(category => {
            category.jobs = category.jobs.sort((a, b) => {
              const aLabel = this._langEntryService.transform(a.entry, 'label', 'en');
              const bLabel = this._langEntryService.transform(b.entry, 'label', 'en');
              return aLabel.localeCompare(bLabel);
            });
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

  private _initYears(): void {
    this._classificationService.classificationDates().pipe(first()).subscribe((dates) => {
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
      this._translateNotificationsService.error('Error', ErrorFrontService.getErrorKey(err.error));
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

  numberFormatter(num: number) {
    const bigDigitsBases = [
      {value: 1, symbol: ''},
      {value: 1e3, symbol: 'k'},
      {value: 1e6, symbol: 'M'},
      {value: 1e9, symbol: 'G'}
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/; // remove last digits after abbreviated number
    const item = bigDigitsBases.slice().reverse().find((item) => num >= item.value);
    if (item) {
      const truncateNum = Math.floor(num / item.value);
      const round = Math.pow(10, truncateNum.toString().length - 1);
      return (Math.floor(truncateNum / round) * round).toString().replace(rx, '$1') + item.symbol + '+';
    }
    return '0';
  }

  get dropdownMonths(): any[] {
    return this._dropdownMonths;
  }

  get seniorityLevelsClassification(): SeniorityClassification {
    return this._seniorityLevelsClassification;
  }
  get jobsClassification(): JobsClassification {
    return this._jobsClassification;
  }


  get seniorityLevelsClassifications(): Array<SeniorityClassification> {
    return this._seniorityLevelsClassifications;
  }

  get jobsClassifications(): Array<JobsClassification> {
    return this._jobsClassifications;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get config(): { emailConfidence?: EmailType; year?: number; month?: number; week?: number } {
    return this._config;
  }

  get selectedYear(): string {
    return this._selectedYear;
  }

  get selectedMonth(): string {
    return this._selectedMonth;
  }

  get selectedWeek(): string {
    return this._selectedWeek;
  }

  get dropdownYears(): any[] {
    return this._dropdownYears;
  }

  get dropdownWeeks(): any[] {
    return this._dropdownWeeks;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get repartitionStats(): { emailConfidence: EmailType; classified: number } {
    return this._repartitionStats;
  }

  get selectedEmailConfidenceType(): EmailType {
    return this._selectedEmailConfidenceType;
  }

  get nbGoodEmailsClassified(): number {
    return this._nbGoodEmailsClassified;
  }

  get nbRiskyEmailsClassified(): number {
    return this._nbRiskyEmailsClassified;
  }
}
