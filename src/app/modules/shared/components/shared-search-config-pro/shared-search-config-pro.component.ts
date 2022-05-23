import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { JobConfig } from '../../../../models/target-pros';
import { JobsFrontService } from '../../../../services/jobs/jobs-front.service';
import { LangEntryService } from '../../../../services/lang-entry/lang-entry.service';

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
  @Input() set option(value: any) {
    if (value) {
      this._currentState = value.state;
      if (value.hasOwnProperty('name')) {
        this._context = value.name;
      } else {
        this._context =  this._langEntryService.jobLabelEntry(value.typo, 'label');
      }
      if (this.isJobTypo) {
        this.initJobStates();
        this._countStates();
      }
      this.setNextState();
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
    if (jobs && jobs.length) {
      this._jobConfigs = jobs;
      this._currentState = this._jobFrontService.checkJobTypoState(jobs);
    }
  }

  @Input() set filteredJobs(jobs: Array<JobConfig>) {
    if (jobs && jobs.length) {
      this._filteredJobsIds = jobs.map(_j => _j._id);
    }
  }

  /**
   * preview mode
   * @param preview
   */
  @Input() set isPreview(preview: Boolean) {
    this._isPreview = preview;
  }

  @Input() set showToggleSearch(value) {
    this._showToggleSearch = value;
  }

  private _context = ''; // SeniorityLevel's name / Job Category's name

  private _identifier = '';

  private _isPreview: Boolean = false;

  private _jobConfigs: Array<JobConfig> = [];

  private _filteredJobsIds: Array<String> = [];

  private _currentState = 0;

  private _showToggleSearch = false;

  private _nbIncluded: number;

  private _nbExcluded: number;

  private _isHovered = false;

  private _hoverState = 0;

  count = 1;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _jobFrontService: JobsFrontService,
              private _langEntryService: LangEntryService) {
  }


  ngOnInit() {
    this._countStates();
  }

  getCurrentState() {
    if (!this._isHovered) {
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
    } else {
      switch (this._hoverState) {
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
          _job.hovered = false;
          _job.hoveredState = 0;
        });
        break;
      case 1:
        this.jobConfigs.map(_job => {
          _job.state = 1;
          _job.hovered = false;
          _job.hoveredState = 0;
        });
        break;
      case 2:
        this.jobConfigs.map(_job => {
          _job.state = 2;
          _job.hovered = false;
          _job.hoveredState = 0;
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
    this.setNextState();
    if (this.isJobTypo) {
      this.setJobStates();
      this._jobFrontService.targetedProsUpdatedOnChange(
        {
          action: 'jobTypos',
          jobs: this.jobConfigs,
          identifier: this._identifier,
          state: this._currentState,
          isToggle: this._showToggleSearch,
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


  get showToggleSearch(): boolean {
    return this._showToggleSearch;
  }

  onClickToggle() {
    this._showToggleSearch = !this._showToggleSearch;
    this._jobFrontService.targetedProsUpdatedOnChange(
      {
        action: 'jobTypos',
        jobs: this.jobConfigs,
        identifier: this._identifier,
        state: this._currentState,
        isToggle: this._showToggleSearch,
      });
  }

  /**
   * get color + border style according to job's state
   * @param job
   */
  getJobCurrentState(job: any) {
    if (!job.hovered) {
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
    } else {
      switch (job.hoveredState) {
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

  }

  /**
   * job state change
   * @param event
   * @param job
   */
  stateJobOnChange(event: Event, job: any) {
    event.preventDefault();
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
    this.jobNextState(job);
    this._countStates();
    this._currentState = this._jobFrontService.checkJobTypoState(this.jobConfigs);
    this._jobFrontService.targetedProsUpdatedOnChange(
      {
        action: 'jobTypos',
        jobs: this.jobConfigs,
        identifier: this._identifier,
        state: this._currentState,
        isToggle: this._showToggleSearch,
      });
  }

  showJob(job: JobConfig) {
    return !job.hidden && this._filteredJobsIds.includes(job._id);
  }

  get isPreview(): Boolean {
    return this._isPreview;
  }

  setNextState() {
    if (this.isJobTypo) {
      switch (this._currentState) {
        case 0:
          this._hoverState = 2;
          break;
        case 1:
          this._hoverState = 0;
          break;
        case 2:
          this._hoverState = 1;
          break;
        case 3:
          this._hoverState = 1;
          break;
      }
    } else {
      switch (this._currentState) {
        case 0:
          this._hoverState = 1;
          break;
        case 1:
          this._hoverState = 0;
          break;
      }
    }
  }

  showNextState(event: Event) {
    event.stopPropagation();
    this.setNextState();
    this._isHovered = true;
  }

  closeHoverState() {
    this._isHovered = false;
  }

  closeJobHoverState(job: JobConfig) {
    job.hovered = false;
  }

  jobNextState(job: JobConfig) {
    switch (job.state) {
      case 0:
        job.hoveredState = 2;
        break;
      case 1:
        job.hoveredState = 0;
        break;
      case 2:
        job.hoveredState = 1;
        break;
    }
  }

  showJobNextState(event: Event, job: JobConfig) {
    event.preventDefault();
    this.jobNextState(job);
    job.hovered = true;
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

  get jobConfigs(): Array<JobConfig> {
    return this._jobConfigs;
  }

  get hoverState(): number {
    return this._hoverState;
  }

  get isHovered(): boolean {
    return this._isHovered;
  }


}
