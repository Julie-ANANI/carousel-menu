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
      this.searchJob('');
      this._sortedFilteredJobsTypologies = this.sortJobTypologies(this._jobsTypologies);
      this._sortedFilteredJobsTypologies = _.orderBy(this._sortedFilteredJobsTypologies, ['totalCount'], ['desc']);
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

  private _currentJobIdentifier = '';

  private _currentJobTypo: JobsTypologies = <JobsTypologies>{};

  private _currentIndex = 0;

  private _count = 0;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _jobFrontService: JobsFrontService) {
  }

  ngOnInit() {
    this._jobFrontService
      .targetedProsToUpdate()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((result: { targetPros: TargetPros, isToggle?: boolean, identifier?: string }) => {
        if (!this._isPreview) {
          this._targetedProsToUpdate = result.targetPros || <TargetPros>{};
          this.initialiseTargetedPros(result.targetPros);
          this.searchJob(this._searchJobKey);
          if (this._count === 0 || this._count === 1) {
            this._sortedFilteredJobsTypologies = this.sortJobTypologies(this._filteredJobsTypologies);
            this._sortedFilteredJobsTypologies = _.orderBy(this._sortedFilteredJobsTypologies, ['totalCount'], ['desc']);
            this._count++;
          } else {
            this.toggleStatus(result.isToggle, result.identifier);
            if (this._currentJobIdentifier) {
              if (result.identifier !== this._currentJobIdentifier) {
                this.getCurrentJobTypo(result.identifier);
              }
            }
            this._currentJobIdentifier = result.identifier;
          }
        }
      });
  }

  getCurrentJobTypo(identifier: string) {
    for (let i = 0; i < this._sortedFilteredJobsTypologies.length; i++) {
      if (this._sortedFilteredJobsTypologies[i].identifier === identifier) {
        this._currentIndex = i;
        this._currentJobTypo = this._jobsTypologies[identifier];
      }
    }
    this._sortedFilteredJobsTypologies = this._sortedFilteredJobsTypologies.filter(jobTypo => jobTypo.identifier !== identifier);
    this._sortedFilteredJobsTypologies = _.orderBy(this._sortedFilteredJobsTypologies, ['totalCount'], ['desc']);
    this._sortedFilteredJobsTypologies.splice(this._currentIndex, 0, this._currentJobTypo);
  }

  sortJobTypologies(jobsTypologies: { [property: string]: JobsTypologies }) {
    if (!_.isEmpty(jobsTypologies)) {
      const _sortedFilteredJobsTypologies: Array<JobsTypologies> = [];
      Object.keys(jobsTypologies).forEach(key => {
        jobsTypologies[key].totalCount = jobsTypologies[key].jobs.filter((job: any) => job.state === 1).length +
          jobsTypologies[key].jobs.filter((job: any) => job.state === 0).length;
        jobsTypologies[key].identifier = key;
        jobsTypologies[key].isToggle = jobsTypologies[key].isToggle ? jobsTypologies[key].isToggle : false;
        _sortedFilteredJobsTypologies.push(jobsTypologies[key]);
      });
      return _sortedFilteredJobsTypologies;
    } else {
      return [];
    }
  }

  initialiseTargetedPros(targetedPros: TargetPros) {
    this._jobsTypologies = targetedPros.jobsTypologies;
    this._searchOperator = targetedPros.searchOperator;
    this._seniorityLevels = targetedPros.seniorityLevels;
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
    if (!_.isEmpty(this._filteredJobsTypologies)) {
      return this._filteredJobsTypologies;
    }
  }

  public searchJob(keyword: string) {
    if (!!keyword) {
      this._searchJobKey = keyword;
      this._filteredJobsTypologies = {};
      Object.keys(this._jobsTypologies).forEach(jobTypoKey => {
        if (this._jobsTypologies[jobTypoKey].name.en.toLowerCase().includes(keyword.toLowerCase())
          || this._jobsTypologies[jobTypoKey].name.fr.toLowerCase().includes(keyword.toLowerCase())) {
          this._filteredJobsTypologies[jobTypoKey] = this._jobsTypologies[jobTypoKey];
        } else {
          const filteredJobs = this._jobsTypologies[jobTypoKey].jobs.filter(j => j.label.en.toLowerCase().includes(keyword.toLowerCase())
            || j.label.fr.toLowerCase().includes(keyword.toLowerCase()));
          if (filteredJobs.length) {
            this._filteredJobsTypologies[jobTypoKey] = this._jobsTypologies[jobTypoKey];
          }
        }
      });
    } else {
      this._filteredJobsTypologies = Object.assign({}, this._jobsTypologies);
    }
  }

  public onClickSearchJobs(keyword: string) {
    this.searchJob(keyword);
    this._sortedFilteredJobsTypologies = this.sortJobTypologies(this._filteredJobsTypologies);
    this._sortedFilteredJobsTypologies = _.orderBy(this._sortedFilteredJobsTypologies, ['totalCount'], ['desc']);
  }

  selectAllOnChange(event: Event, type: 'SENIORITY_LEVEL' | 'JOB_TYPOLOGY') {
    if (!this._isPreview) {
      switch (type) {
        case 'JOB_TYPOLOGY':
          if (this._selectAllJobs === 1) {
            Object.keys(this._jobsTypologies).map(key => {
              this._jobsTypologies[key].state = 0;
              this._jobsTypologies[key].jobs.forEach(job => job.state = 0);
            });
            this._selectAllJobs = 0;
          } else if (this._selectAllJobs === 0) {
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
          this._jobFrontService.setTargetedProsToUpdate({targetPros: this._targetedProsToUpdate});
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
          this._jobFrontService.setTargetedProsToUpdate({targetPros: this._targetedProsToUpdate});
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

  toggleStatus(isToggle: boolean = false, identifier: string = '') {
    if (isToggle) {
      this._sortedFilteredJobsTypologies.map(jobTypo => {
        jobTypo.isToggle = jobTypo.identifier === identifier;
      });
    }
  }
}
