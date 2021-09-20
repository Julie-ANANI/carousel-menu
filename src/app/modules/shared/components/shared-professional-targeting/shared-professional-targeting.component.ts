import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { JobsTypologies, SeniorityLevel, TargetPros } from '../../../../models/targetPros';
import { takeUntil } from 'rxjs/operators';
import { JobsFrontService } from '../../../../services/jobs/jobs-front.service';
import { Subject } from 'rxjs';

import * as _ from 'lodash';

@Component({
  selector: 'app-shared-professional-targeting',
  templateUrl: './shared-professional-targeting.component.html',
  styleUrls: ['./shared-professional-targeting.component.scss'],
})
export class SharedProfessionalTargetingComponent implements OnInit, OnDestroy {
  @Input() set isPreview(value) {
    this._isPreview = value;
  }

  @Input() set targetedProsToUpdate(value: TargetPros) {
    if (value && this._isPreview) {
      this._targetedProsToUpdate = value;
      this.initialiseTargetedPros(value);
    }
  }

  private _seniorityLevels: { [property: string]: SeniorityLevel } = {};

  private _filteredJobsTypologies: { [property: string]: JobsTypologies } = {};

  private _jobsTypologies: { [property: string]: JobsTypologies } = {};

  private _searchOperator = 'OR' || 'AND';

  private _isLoading = false;

  private _isPreview: Boolean = false;

  private _targetedProsToUpdate: TargetPros = <TargetPros>{};

  private _selectAllSeniorityLevels = 0;

  private _selectAllJobs = 0;

  private _sortedFilteredJobsTypologies: Array<JobsTypologies> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _searchJobKey = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _jobFrontService: JobsFrontService) {
  }

  ngOnInit() {
    this._jobFrontService
      .targetedProsToUpdate()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((targetedPros) => {
        if (!this._isPreview) {
          this._targetedProsToUpdate = targetedPros || <TargetPros>{};
          this.initialiseTargetedPros(targetedPros);
        }
      });
  }

  sortJobTypologies(jobsTypologies: { [property: string]: JobsTypologies }) {
    if (!_.isEmpty(jobsTypologies)) {
      let _sortedFilteredJobsTypologies: Array<JobsTypologies> = [];
      Object.keys(jobsTypologies).forEach(key => {
        jobsTypologies[key].totalCount = jobsTypologies[key].jobs.filter((job: any) => job.state === 1).length +
          jobsTypologies[key].jobs.filter((job: any) => job.state === 0).length;
        jobsTypologies[key].identifier = key;
        _sortedFilteredJobsTypologies.push(jobsTypologies[key]);
      });
      _sortedFilteredJobsTypologies = _.orderBy(_sortedFilteredJobsTypologies, ['totalCount'], ['desc']);
      return _sortedFilteredJobsTypologies;
    } else {
      return [];
    }
  }

  initialiseTargetedPros(targetedPros: TargetPros) {
    this._jobsTypologies = targetedPros.jobsTypologies;
    this._searchOperator = targetedPros.searchOperator;
    this._seniorityLevels = targetedPros.seniorityLevels;
    this._filteredJobsTypologies = targetedPros.jobsTypologies;
    this.onClickSearchJob(this._searchJobKey);
    this.initialiseSelectAllSeniorityLevel(this._seniorityLevels);
    this.initialiseSelectAllJobs(this._jobsTypologies);
  }

  initialiseSelectAllSeniorityLevel(seniorityLevels: any) {
    const stateExcluded = _.find(seniorityLevels, {state: 0});
    const stateIncluded = _.find(seniorityLevels, {state: 1});
    if (stateExcluded && stateIncluded) {
      this._selectAllSeniorityLevels = 3;
    } else if (stateExcluded) {
      this._selectAllSeniorityLevels = 0;
    } else {
      this._selectAllSeniorityLevels = 1;
    }
  }

  initialiseSelectAllJobs(jobsTypologies: any) {
    const stateExcluded = _.find(jobsTypologies, {state: 0});
    const stateIncluded = _.find(jobsTypologies, {state: 1});
    const stateNeutral = _.find(jobsTypologies, {state: 2});
    const stateMixed = _.find(jobsTypologies, {state: 3});
    if (stateExcluded && !stateIncluded && !stateNeutral && !stateMixed) {
      this._selectAllJobs = 0;
    } else if (!stateExcluded && stateIncluded && !stateNeutral && !stateMixed) {
      this._selectAllJobs = 1;
    } else if (!stateExcluded && !stateIncluded && stateNeutral && !stateMixed) {
      this._selectAllJobs = 2;
    } else {
      this._selectAllJobs = 3;
    }
  }

  /**
   * update JobCategories
   * @param searchOp
   */
  searchOperatorOnChange(searchOp: string) {
    this._searchOperator = searchOp;
    this._targetedProsToUpdate.searchOperator = searchOp === 'OR' ? 'OR' : 'AND';
    this._jobFrontService.targetedProsUpdatedOnChange({action: 'searchOperator', searchOp: searchOp});
  }

  previewSearchConfig() {
    this._isPreview = true;
  }

  get isPreview(): Boolean {
    return this._isPreview;
  }

  get filteredJobsTypologies(): { [p: string]: JobsTypologies } {
    return this._filteredJobsTypologies;
  }

  public onClickSearchJob(keyword: string) {
    if (!!keyword) {
      this._searchJobKey = keyword;
      this._filteredJobsTypologies = {};
      const keys = Object.keys(this._jobsTypologies);
      for (let i = 0; i < keys.length; i++) {
        const category = this._jobsTypologies[keys[i]];

        if (category.name.en.toLowerCase().includes(keyword.toLowerCase())
          || category.name.fr.toLowerCase().includes(keyword.toLowerCase())) {
          this._filteredJobsTypologies[keys[i]] = {
            state: category.state,
            name: category.name,
            jobs: category.jobs
          };
        } else {
          const filteredJobs = category.jobs.filter(j => j.label.en.toLowerCase().includes(keyword.toLowerCase())
            || j.label.fr.toLowerCase().includes(keyword.toLowerCase()));
          if (filteredJobs.length) {
            this._filteredJobsTypologies[keys[i]] = {
              state: category.state,
              name: category.name,
              jobs: filteredJobs
            };
          }
        }
        this._sortedFilteredJobsTypologies = this.sortJobTypologies(this._filteredJobsTypologies);
      }
    } else {
      this._filteredJobsTypologies = Object.assign({}, this._jobsTypologies);
      this._sortedFilteredJobsTypologies = this.sortJobTypologies(this._filteredJobsTypologies);
    }
  }

  selectAllOnChange(event: Event, type: 'SENIORITY_LEVEL' | 'JOB_TYPOLOGY') {
    if (!this._isPreview) {
      switch (type) {
        case 'JOB_TYPOLOGY':
          if (this._selectAllJobs === 1) {
            Object.keys(this._jobsTypologies).map(key => {
              this._jobsTypologies[key].state = 2;
              this._jobsTypologies[key].jobs.forEach(job => job.state = 2);
            });
            this._selectAllJobs = 2;
          } else {
            Object.keys(this._jobsTypologies).map(key => {
              this._jobsTypologies[key].state = 1;
              this._jobsTypologies[key].jobs.forEach(job => job.state = 1);
            });
            this._selectAllJobs = 1;
          }
          this._targetedProsToUpdate.jobsTypologies = this._jobsTypologies;
          this._jobFrontService.setTargetedProsToUpdate(this._targetedProsToUpdate);
          break;
        case 'SENIORITY_LEVEL':
          if (this._selectAllSeniorityLevels === 1) {
            Object.keys(this._seniorityLevels).map(key => {
              this._seniorityLevels[key].state = 0;
            });
            this._selectAllSeniorityLevels = 0;
          } else {
            Object.keys(this._seniorityLevels).map(key => {
              this._seniorityLevels[key].state = 1;
            });
            this._selectAllSeniorityLevels = 1;
          }
          this._targetedProsToUpdate.seniorityLevels = this._seniorityLevels;
          this._jobFrontService.setTargetedProsToUpdate(this._targetedProsToUpdate);
          break;
      }
    }
  }


  get targetedProsToUpdate(): TargetPros {
    return this._targetedProsToUpdate;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  getSeniorityLevelsKeys() {
    if (!_.isEmpty(this._seniorityLevels)) {
      return Object.keys(this._seniorityLevels).filter(key => key !== 'excluding').concat('excluding') || [];
    } else {
      return [];
    }
  }

  get getFilteredJobsTypologiesKeys() {
    if (!_.isEmpty(this._filteredJobsTypologies)) {
      return Object.keys(this._filteredJobsTypologies) || Object.keys(this._jobsTypologies);
    } else {
      return [];
    }
  }

  get seniorityLevels(): { [p: string]: SeniorityLevel } {
    if (!_.isEmpty(this._seniorityLevels)) {
      return this._seniorityLevels;
    }
  }

  get jobsTypologies(): { [p: string]: JobsTypologies } {
    if (!_.isEmpty(this._jobsTypologies)) {
      return this._jobsTypologies;
    }
  }

  get searchOperator(): string {
    return this._searchOperator;
  }

  get selectAllJobs(): number {
    return this._selectAllJobs;
  }

  get selectAllSeniorityLevels(): number {
    return this._selectAllSeniorityLevels;
  }

  get nbAllJobSelected(): number {
    if (!_.isEmpty(this._jobsTypologies)) {
      let _total = 0;
      Object.keys(this._jobsTypologies).forEach(key => {
        _total += this._jobsTypologies[key].jobs.filter(job => job.state === 1).length;
      });
      return _total;
    }
  }

  get nbAllJobExcluded(): number {
    if (!_.isEmpty(this._jobsTypologies)) {
      let _total = 0;
      Object.keys(this._jobsTypologies).forEach(key => {
        _total += this._jobsTypologies[key].jobs.filter(job => job.state === 0).length;
      });
      return _total;
    }
  }

  get nbAllSeniorityLevelSelected(): number {
    if (!_.isEmpty(this._seniorityLevels)) {
      let _total = 0;
      Object.keys(this._seniorityLevels).forEach(key => {
        _total += this._seniorityLevels[key].state;
      });
      return _total;
    } else {
      return 0;
    }

  }

  get nbAllSeniorityLevelExcluded(): number {
    if (!_.isEmpty(this._seniorityLevels)) {
      return Object.keys(this._seniorityLevels).length - this.nbAllSeniorityLevelSelected;
    } else {
      return 0;
    }
  }

  get sortedFilteredJobsTypologies(): Array<JobsTypologies> {
    return this._sortedFilteredJobsTypologies;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
