import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { JobConfig } from '../../../../models/targetPros';
import { JobsFrontService } from '../../../../services/jobs/jobs-front.service';

/**
 * SL - 0: excluded, 1: included
 * JT - 0: excluded, 1: included, 2: neutral, 3:mixe
 */

@Component({
  selector: 'app-shared-search-config-pro',
  templateUrl: './shared-search-config-pro.component.html',
  styleUrls: ['./shared-search-config-pro.component.scss']
})
export class SharedSearchConfigProComponent implements OnInit {
  /**
   * if it's a job cotegory
   */
  @Input() isJobTypo = false;

  /**
   * one category: seniority level/ job category
   * @param value
   */
  @Input() set option(value: { name: string, state: number }) {
    this._currentState = value.state;
    this._context = value.name;
    if (this.isJobTypo) {
      this.initJobStates();
      this._countStates();
    }
  }

  /**
   * identifier in jobConfig
   * @param value
   */
  @Input() set identifier(value: string) {
    this._identifier = value;
  }

  @Input() set jobs(jobs: Array<JobConfig>) {
    this._jobConfigs = jobs;
  }

  @Input() set filteredJobs(jobs: Array<JobConfig>) {
    this._filteredJobsIds = jobs.map(_j => _j._id);
  }

  /**
   * preview mode
   * @param preview
   */
  @Input() set isPreview(preview: Boolean) {
    this._isPreview = preview;
  }

  @Input() set showToggleSearch(value){
    this._showToggleSearch = value;
  }

  @Output() onToggleChange: EventEmitter<boolean> = new EventEmitter();

  private _context = ''; // SeniorityLevel's name / Job Category's name

  private _identifier = '';

  private _isPreview: Boolean = false;

  private _jobConfigs: Array<JobConfig> = [];

  private _filteredJobsIds: Array<String> = [];

  private _currentState = 0;

  private _showToggleSearch = false;

  private _nbIncluded: number;

  private _nbExcluded: number;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _jobFrontService: JobsFrontService) {
  }

  ngOnInit() {
    this._countStates();
  }


  get jobConfigs(): Array<JobConfig> {
    return this._jobConfigs;
  }

  getCurrentState() {
    switch (this._currentState) {
      case 0:
        return {
          border: '4px solid #EA5858',
          color: '#EA5858'
        };
      case 3:
      case 2:
        return {
          border: '4px solid #333333',
          color: '#333333'
        };
      case 1:
        return {
          border: '4px solid #2ECC71',
          color: '#2ECC71'
        };
    }
  }

  get currentState(): number {
    return this._currentState;
  }

  get context(): string {
    return this._context;
  }

  get nbIncluded(): number {
    return this._nbIncluded;
  }

  get nbExcluded(): number {
    return this._nbExcluded;
  }

  /**
   * job state
   */
  setJobStates() {
    switch (this._currentState) {
      case 0:
        this._currentState = 2;
        this.jobConfigs.map(_job => {
          _job.state = 2;
        });
        break;
      case 1:
        this._currentState = 0;
        this.jobConfigs.map(_job => {
          _job.state = 0;
        });
        break;
      case 2:
        this._currentState = 1;
        this.jobConfigs.map(_job => {
          _job.state = 1;
        });
        break;
      case 3:
        this._currentState = 1;
        this.jobConfigs.map(_job => {
          _job.state = 1;
        });
        break;
    }
  }

  /**
   * job state
   */
  initJobStates() {
    switch (this._currentState) {
      case 0:
        this.jobConfigs.map(_job => {
          _job.state = 0;
        });
        break;
      case 1:
        this.jobConfigs.map(_job => {
          _job.state = 1;
        });
        break;
      case 2:
        this.jobConfigs.map(_job => {
          _job.state = 2;
        });
        break;
    }
  }

  /**
   * seniority level: 0/1
   */
  setSeniorityLevelState() {
    switch (this._currentState) {
      case 0:
        this._currentState = 1;
        break;
      case 1:
        this._currentState = 0;
        break;
    }
  }

  /**
   * count: included/excluded in one job category
   * @private
   */
  private _countStates() {
    if (this.isJobTypo) {
      this._nbIncluded = this.jobConfigs.filter(_job => _job.state === 1).length;
      this._nbExcluded = this.jobConfigs.filter(_job => _job.state === 0).length;
    }
  }

  /**
   * state on change: job/job category/seniority level
   * change states, send results
   * @param event
   */
  stateOnChange(event: Event) {
    event.preventDefault();
    if (!this.isPreview) {
      if (this.isJobTypo) {
        this.setJobStates();
        this._jobFrontService.targetedProsUpdatedOnChange(
          {
            action: 'jobTypos',
            jobs: this.jobConfigs,
            identifier: this._identifier,
            state: this._currentState
          });
      } else {
        this.setSeniorityLevelState();
        this._jobFrontService.targetedProsUpdatedOnChange(
          {
            action: 'seniorLevels',
            state: this._currentState,
            identifier: this._identifier
          });
      }
      this._countStates();
    }
  }


  get showToggleSearch(): boolean {
    return this._showToggleSearch;
  }

  onClickToggle() {
    this._showToggleSearch = !this._showToggleSearch;
  }

  /**
   * get color + border style according to job's state
   * @param job
   */
  getJobCurrentState(job: any) {
    switch (job.state) {
      case 0:
        return {
          border: '4px solid #EA5858',
          color: '#EA5858'
        };
      case 2:
        return {
          border: '4px solid #333333',
          color: '#333333'
        };
      case 1:
        return {
          border: '4px solid #2ECC71',
          color: '#2ECC71'
        };
    }
  }

  /**
   * job state change
   * @param event
   * @param job
   */
  stateJobOnChange(event: Event, job: any) {
    if (!this.isPreview) {
      event.preventDefault();
      switch (job.state) {
        case 0:
          job.state = 2;
          break;
        case 1:
          job.state = 0;
          break;
        case 2:
          job.state = 1;
          break;
      }
      this._countStates();
      this._jobFrontService.targetedProsUpdatedOnChange(
        {
          action: 'jobTypos',
          jobs: this.jobConfigs,
          identifier: this._identifier,
          state: this._currentState
        });
      this._currentState = this.checkTypoState();
    }
  }

  /**
   * check Job category state, it will change the state in jobs of the job category
   */
  checkTypoState() {
    const _stateNeutral = this._jobConfigs.filter((_job: any) => {
      return _job.state === 2;
    }).length;

    const _stateExcluded = this._jobConfigs.filter((_job: any) => {
      return _job.state === 0;
    }).length;

    const _stateIncluded = this._jobConfigs.filter((_job: any) => {
      return _job.state === 1;
    }).length;

    if (_stateNeutral === this._jobConfigs.length) {
      return 2;
    } else if (_stateExcluded === this._jobConfigs.length) {
      return 0;
    } else if (_stateIncluded === this._jobConfigs.length) {
      return 1;
    } else {
      return 3;
    }
  }

  showJob(job: JobConfig) {
    return this._filteredJobsIds.includes(job._id);
  }

  get isPreview(): Boolean {
    return this._isPreview;
  }
}
