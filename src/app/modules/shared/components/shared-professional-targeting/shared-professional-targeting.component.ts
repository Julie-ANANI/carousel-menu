import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { JobConfig, JobsTypologies, SeniorityLevel, TargetPros } from '../../../../models/target-pros';
import { takeUntil } from 'rxjs/operators';
import { JobsFrontService } from '../../../../services/jobs/jobs-front.service';
import { Subject } from 'rxjs';

import * as _ from 'lodash';
import { isPlatformBrowser } from '@angular/common';
import { LangEntryService } from '../../../../services/lang-entry/lang-entry.service';


@Component({
  selector: 'app-shared-professional-targeting',
  templateUrl: './shared-professional-targeting.component.html',
  styleUrls: ['./shared-professional-targeting.component.scss'],
})
export class SharedProfessionalTargetingComponent implements OnInit, OnDestroy {
  @Input() set isPreview(value) {
    this._isPreview = value;
  }

  /**
   * only when is preview mode
   * @param value
   */
  @Input() set targetedProsToUpdate(value: TargetPros) {
    if (!_.isEmpty(value) && this._isPreview) {
      this.initialiseTargetedPros(value);
      this._filteredJobsTypologies = value.jobsTypologies;
      this._sortedFilteredJobsTypologies = this.sortJobTypologies(this._filteredJobsTypologies);
      this._sortedFilteredJobsTypologies = _.orderBy(this._sortedFilteredJobsTypologies, ['totalCount'], ['desc']);
      this.finalSortJobTypo();
    }
  }

  private _seniorityLevels: { [property: string]: SeniorityLevel } = {};

  private _filteredJobsTypologies: { [property: string]: JobsTypologies } = {};

  private _jobsTypologies: { [property: string]: JobsTypologies } = {};

  private _searchOperator = 'OR' || 'AND';

  private _isPreview: Boolean = false;

  private _targetedProsToUpdate: TargetPros = <TargetPros>{};

  private _selectAllSeniorityLevels = 0;

  private _selectAllJobs = 0;

  private _sortedFilteredJobsTypologies: Array<JobsTypologies> = [];

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _searchJobKey = '';

  private _currentJobIdentifier = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _jobFrontService: JobsFrontService) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._jobFrontService
        .targetedProsToUpdate()
        .pipe(takeUntil(this._ngUnsubscribe))
        .subscribe((result: { targetPros: TargetPros, isToggle?: boolean, identifier?: string }) => {
          // when is not preview + has targetPros
          // 1. prepare targetPros
          // 2. search if there is a keyword
          // 3. sort
          if (!this._isPreview && !_.isEmpty(result.targetPros)) {
            this._targetedProsToUpdate = result.targetPros || <TargetPros>{};
            this.initialiseTargetedPros(result.targetPros);
            this.searchJob(this._searchJobKey);
            if (!result.identifier) {
              this._sortedFilteredJobsTypologies = this.sortJobTypologies(this._filteredJobsTypologies);
              this._sortedFilteredJobsTypologies = _.orderBy(this._sortedFilteredJobsTypologies, ['totalCount'], ['desc']);
              this.finalSortJobTypo();
            } else {
              if (result.identifier !== this._currentJobIdentifier) {
                this.getCurrentJobTypo(result.identifier);
              }
            }
            this.toggleStatus(result.isToggle, result.identifier);
            this._currentJobIdentifier = result.identifier;
          }
        });
    }
  }

  /**
   * sort jobTyo
   * clicked on A: A won't move, sort other jobs
   * @param identifier
   */
  getCurrentJobTypo(identifier: string) {
    let currentIndex = 0;
    let before = 1;
    let currentJobTypo: JobsTypologies;
    for (let i = 0; i < this._sortedFilteredJobsTypologies.length; i++) {
      if (this._sortedFilteredJobsTypologies[i].identifier === identifier) {
        currentIndex = i;
        currentJobTypo = this._filteredJobsTypologies[identifier];
      }

      if (this._sortedFilteredJobsTypologies[i].identifier === this._currentJobIdentifier) {
        this._sortedFilteredJobsTypologies[i].totalCount = this._jobsTypologies[this._currentJobIdentifier].totalCount;
        before = i;
      }
    }

    if (currentIndex === 1 && before === 0) {
      this._sortedFilteredJobsTypologies = _.orderBy(this._sortedFilteredJobsTypologies, ['totalCount'], ['desc']);
      this.finalSortJobTypo();
    } else {
      this._sortedFilteredJobsTypologies = this._sortedFilteredJobsTypologies.filter(jobTypo => jobTypo.identifier !== identifier);
      this._sortedFilteredJobsTypologies = _.orderBy(this._sortedFilteredJobsTypologies, ['totalCount'], ['desc']);
      this.finalSortJobTypo();
      this._sortedFilteredJobsTypologies.splice(currentIndex, 0, currentJobTypo);
    }
  }

  /**
   * prepare a list of jobsTypologies, ready to sort
   * @param jobsTypologies
   */
  sortJobTypologies(jobsTypologies: { [property: string]: JobsTypologies }) {
    if (!_.isEmpty(jobsTypologies)) {
      const _sortedFilteredJobsTypologies: Array<JobsTypologies> = [];
      Object.keys(jobsTypologies).forEach(key => {
        _sortedFilteredJobsTypologies.push(jobsTypologies[key]);
      });
      return _sortedFilteredJobsTypologies;
    } else {
      return [];
    }
  }

  /**
   * prepare targetedPros
   * @param targetedPros
   */
  initialiseTargetedPros(targetedPros: TargetPros) {
    Object.keys(targetedPros.jobsTypologies).forEach((_job) => {
      targetedPros.jobsTypologies[_job] = LangEntryService.jobEntry(targetedPros.jobsTypologies[_job], 'name');
      if (targetedPros.jobsTypologies[_job].jobs && targetedPros.jobsTypologies[_job].jobs.length) {
        targetedPros.jobsTypologies[_job].jobs.map((_jobConfig) => {
          return LangEntryService.jobEntry(_jobConfig, 'label');
        });
      }
    });
    this._jobsTypologies = targetedPros.jobsTypologies;
    this._searchOperator = targetedPros.searchOperator;
    this._seniorityLevels = targetedPros.seniorityLevels;
    this.initialiseSelectAllSeniorityLevel(this._seniorityLevels);
    this.initialiseSelectAllJobs(this._jobsTypologies);
  }

  /**
   * selectAll button state
   * @param seniorityLevels
   */
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

  finalSortJobTypo() {
    let finalSort: Array<JobsTypologies> = [];
    const jobTyposSelected = this._sortedFilteredJobsTypologies.filter(job => job.totalCount !== 0);
    const jobTypoNonSelected = this._sortedFilteredJobsTypologies.filter(job => job.totalCount === 0);
    jobTyposSelected.map(job => {
      if (!finalSort.find(el => el.identifier === job.identifier)) {
        const jobTyposSameCount = jobTyposSelected.filter(j => j.totalCount === job.totalCount);
        if (jobTyposSameCount && jobTyposSameCount.length) {
          finalSort = finalSort.concat(_.orderBy(jobTyposSameCount, ['identifier']));
        } else {
          finalSort.push(job);
        }
      }
    });
    if (jobTypoNonSelected && jobTypoNonSelected.length) {
      finalSort = finalSort.concat(_.orderBy(jobTypoNonSelected, ['identifier']));
    }
    this._sortedFilteredJobsTypologies = finalSort;
  }

  /**
   * selectAll button state
   * @param jobsTypologies
   */
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

  /**
   * search jobs by keyword
   * @param keyword
   */
  public searchJob(keyword: string) {
    if (!!keyword) {
      this._filteredJobsTypologies = {};
      Object.keys(this._jobsTypologies).forEach(jobTypoKey => {
        const keyword_toLowerCase = keyword.toLowerCase();
        if (this._jobsTypologies[jobTypoKey] && this._jobsTypologies[jobTypoKey].entry && this._jobsTypologies[jobTypoKey].entry.length) {
          const jobTypoFound = this._jobsTypologies[jobTypoKey].entry.find(e => e.label.toLowerCase().indexOf(keyword_toLowerCase) !== -1);
          if (!!jobTypoFound) {
            this._filteredJobsTypologies[jobTypoKey] = JSON.parse(JSON.stringify(this._jobsTypologies[jobTypoKey]));
            this._filteredJobsTypologies[jobTypoKey].isToggle = false;
          } else {
            const jobFound = this._jobsTypologies[jobTypoKey].jobs && this._jobsTypologies[jobTypoKey].jobs.length
              && this._jobsTypologies[jobTypoKey].jobs.filter(
                job => job.entry && job.entry.length && job.entry.find(e => e.label.toLowerCase().indexOf(keyword_toLowerCase) !== -1)
              );
            if (jobFound && jobFound.length) {
              this._filteredJobsTypologies[jobTypoKey] = JSON.parse(JSON.stringify(this._jobsTypologies[jobTypoKey]));
              this._filteredJobsTypologies[jobTypoKey].jobs = jobFound;
              this._filteredJobsTypologies[jobTypoKey].isToggle = false;
            }
          }
        }
      });
    } else {
      this._filteredJobsTypologies = JSON.parse(JSON.stringify(this._jobsTypologies));
    }
  }

  /**
   * click: search job + sort
   * @param keyword
   */
  public onClickSearchJobs(keyword: string) {
    this._searchJobKey = keyword;
    this._filteredJobsTypologies = {};
    this.searchJob(keyword);
    this._sortedFilteredJobsTypologies = this.sortJobTypologies(this._filteredJobsTypologies);
    this._sortedFilteredJobsTypologies = _.orderBy(this._sortedFilteredJobsTypologies, ['totalCount'], ['desc']);
    this.finalSortJobTypo();
    if (!!keyword) {
      this._sortedFilteredJobsTypologies.map((job, index) => {
        job.isToggle = index === 0;
      });
    } else {
      this._sortedFilteredJobsTypologies.map((job, index) => {
        job.isToggle = false;
      });
    }
  }


  get searchJobKey(): string {
    return this._searchJobKey;
  }

  /**
   * select all
   * @param event
   * @param type
   */
  selectAllOnChange(event: Event, type: 'SENIORITY_LEVEL' | 'JOB_TYPOLOGY') {
    event.preventDefault();
    if (!this._isPreview) {
      switch (type) {
        case 'JOB_TYPOLOGY':
          if (this._selectAllJobs === 1) {
            Object.keys(this._jobsTypologies).map(key => {
              this._jobsTypologies[key].state = 0;
              this._jobsTypologies[key].jobs.forEach(job => job.state = 0);
              this._jobsTypologies[key].totalCount = this._jobsTypologies[key].jobs.length;
              this._filteredJobsTypologies[key].state = 0;
              this._filteredJobsTypologies[key].jobs.forEach(job => job.state = 0);
              this._filteredJobsTypologies[key].totalCount = this._jobsTypologies[key].jobs.length;
              this._filteredJobsTypologies[key].isToggle = false;
              this._jobsTypologies[key].isToggle = false;
            });
            this._selectAllJobs = 0;
          } else if (this._selectAllJobs === 0) {
            Object.keys(this._jobsTypologies).map(key => {
              this._jobsTypologies[key].state = 2;
              this._jobsTypologies[key].jobs.forEach(job => job.state = 2);
              this._jobsTypologies[key].totalCount = 0;
              this._filteredJobsTypologies[key].state = 2;
              this._filteredJobsTypologies[key].jobs.forEach(job => job.state = 2);
              this._filteredJobsTypologies[key].totalCount = 0;
              this._filteredJobsTypologies[key].isToggle = false;
              this._jobsTypologies[key].isToggle = false;
            });
            this._selectAllJobs = 2;
          } else {
            Object.keys(this._jobsTypologies).map(key => {
              this._jobsTypologies[key].state = 1;
              this._jobsTypologies[key].jobs.forEach(job => job.state = 1);
              this._jobsTypologies[key].totalCount = this._jobsTypologies[key].jobs.length;
              this._filteredJobsTypologies[key].state = 1;
              this._filteredJobsTypologies[key].jobs.forEach(job => job.state = 1);
              this._filteredJobsTypologies[key].totalCount = this._jobsTypologies[key].jobs.length;
              this._filteredJobsTypologies[key].isToggle = false;
              this._jobsTypologies[key].isToggle = false;
            });
            this._selectAllJobs = 1;
          }
          this._targetedProsToUpdate.jobsTypologies = this._jobsTypologies;
          this._jobFrontService.setTargetedProsToUpdate({
            targetPros: this._targetedProsToUpdate,
            identifier: this._currentJobIdentifier,
            isToggle: false,
            toSave: true,
          });
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
          this._jobFrontService.setTargetedProsToUpdate({
            targetPros: this._targetedProsToUpdate, identifier: this._currentJobIdentifier,
            isToggle: false,
            toSave: true,
          });
          break;
      }
      this._sortedFilteredJobsTypologies = this.sortJobTypologies(this._filteredJobsTypologies);
      this._sortedFilteredJobsTypologies = _.orderBy(this._sortedFilteredJobsTypologies, ['totalCount'], ['desc']);
      this.finalSortJobTypo();
    }
  }

  /**
   * keep one job typo toggle show
   * @param isToggle
   * @param identifier
   */
  toggleStatus(isToggle: boolean = false, identifier: string = '') {
    if (isToggle) {
      this._sortedFilteredJobsTypologies.map(jobTypo => {
        jobTypo.isToggle = jobTypo.identifier === identifier;
      });
    }
  }

  sortJobs(jobs: Array<JobConfig>) {
    // return jobs;
    if (jobs && jobs.length) {
      return _.sortBy(jobs, ['label.en']);
    }
  }


  get targetedProsToUpdate(): TargetPros {
    return this._targetedProsToUpdate;
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

}
